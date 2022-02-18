require('dotenv').config()
const hre = require("hardhat");
const { ethers } = hre
const { merklize, createProofsObj, writeSignedProofs } = require('./utilities/merkle')
const { createArchive } = require('./utilities/archive')
const { execute } = require('./utilities/execute')
const { setupWorkspaces, fixSPDXErrors } = require('./utilities/workspace')
const { writeFileFromTemplate } = require('./utilities/template')
const { archiveDir, archiveWorkspace, contractDir, contractTemplateDir, contractFlattenedDir, nftContractName } = require('./constants')
const fs = require("fs-extra");
const chalk = require('chalk')

async function main() {
  setupWorkspaces([archiveDir, archiveWorkspace, contractDir])

  const addresses = process.env.ADDRESSES.split(',')
  const { tree, root } = merklize(addresses)
  console.log(`root hash: ${chalk.green(root)}`)
  console.log('tree')
  console.log(tree.toString())

  //write the signature and proofs to file
  const proofObj = createProofsObj(addresses)
  console.log('proof mapping created')

  //NOTE: reads signers from hardhat.config.js
  const accounts = await ethers.getSigners();
  const signer = accounts[0]
  const sig = await signer.signMessage(JSON.stringify(proofObj))
  proofObj['sig'] = sig
  console.log('signature added to proof mapping')

  await writeSignedProofs(proofObj, `${archiveWorkspace}proofs.json`)
  await writeFileFromTemplate(
    {
      root,
      sig,
      owner: signer.address,
      fee: 1,
      name: 'Pi',
      symbol: 'PI'
    },
    `${contractTemplateDir}${nftContractName}.sol`, `${contractDir}${nftContractName}.sol`
  )

  try {
    await hre.run("compile");
  } catch (err) {
    console.log(chalk.yellow("Fixing flatten issue with SPDX"))
    await fixSPDXErrors(`${contractFlattenedDir}${nftContractName}.sol`)
    console.log(chalk.yellow("SPDX Issues Fixed"))
  }

  // copy flattened contracts and deconstruct.js
  fs.copySync(contractFlattenedDir, archiveWorkspace)

  //zip flattened contracts
  try {
    await createArchive(archiveWorkspace, `${archiveDir}data.zip`)
  } catch (err) {
    console.log(`Error Archiving ${err}`)
    throw err
  }

  //steganographically add to the chosen image
  try {
    await execute('stegify', ['encode', '--carrier', 'images/pi_2.png', '--data', `${archiveDir}data.zip`, '--result', 'test.png'])
  } catch (err) {
    console.log(`Error Steganographic write ${err}`)
    throw err
  }
  console.log(chalk.green("Success! Image Encoded"))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });