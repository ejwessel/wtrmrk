require('dotenv').config()
const hre = require("hardhat");
const { ethers } = hre
const { merklize, createProofsObj, writeSignedProofs } = require('./utilities/merkle')
const { setupArchiver } = require('./utilities/archive')
const { execute } = require('./utilities/execute')
const { writeFileFromTemplate } = require('./utilities/template')
const { renderFile } = require('template-file')
const fs = require("fs-extra");
const chalk = require('chalk')
const { spawn } = require('child_process');

async function main() {
  //merkle
  const addresses = process.env.ADDRESSES.split(',')
  const { tree, root } = merklize(addresses)
  console.log(`root hash: ${chalk.green(root)}`)
  console.log('tree')
  console.log(tree.toString())

  //write the signature and proofs to file
  const proofObj = createProofsObj(addresses)

  //NOTE: reads signers from hardhat.config.js
  const accounts = await ethers.getSigners();
  const signer = accounts[0]
  const sig = await signer.signMessage(JSON.stringify(proofObj))
  proofObj['sig'] = sig

  await writeSignedProofs(proofObj, './outputs/proofs.json',)
  await writeFileFromTemplate({ root, sig }, './contract_templates/Greeter.sol', './contracts/Greeter.sol',)

  // await hre.run('compile');
  // copy flattened contracts and deconstruct.js
  fs.copySync('./cache/solpp-generated-contracts', 'outputs/')
  fs.copySync('./scripts/deconstruct.js', 'outputs/deconstruct.js')

  //zip flattened contracts
  try {
    await setupArchiver('outputs/', 'archive/data.zip')
  } catch (err) {
    console.log(`Error Archiving ${err}`)
    throw err
  }

  //steganographically add to the chosen image
  try {
    await execute('stegify', ['encode', '--carrier', 'images/pi_2.png', '--data', 'archive/data.zip', '--result', 'test.png'])
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