require('dotenv').config()
const hre = require("hardhat");
const { ethers } = hre
const { merklize, getProof } = require('./utilities/merkle')
const { setupArchiver } = require('./utilities/archive')
const { execute } = require('./utilities/execute')
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
  const proofObj = { sig: '', mapping: {} }
  addresses.forEach((address) => {
    const proof = getProof(tree, address)
    proofObj['mapping'][address] = proof
  })

  //NOTE: reads signers from hardhat.config.js
  const accounts = await ethers.getSigners();
  const signer = accounts[0]
  const sig = await signer.signMessage(JSON.stringify(proofObj))
  console.log('proof signature')
  console.log(chalk.green(sig))
  proofObj['sig'] = sig
  console.log('proof mapping')
  console.log(proofObj)

  try {
    const data = JSON.stringify(proofObj, null, 2)
    fs.writeFileSync('./outputs/proofs.json', data)
    console.log(chalk.green('Created proofs.json'))
    //file written successfully
  } catch (err) {
    console.log(`Error writing proofs.json ${err}`)
    throw err
  }

  //replace template contract code
  try {
    const data = {
      root,
      sig
    }
    //renderToFolder is not working...
    const rData = await renderFile('./contract_templates/Greeter.sol', data)
    fs.writeFileSync('./contracts/Greeter.sol', rData)
    console.log(chalk.green('Created templated files'))
  } catch (err) {
    console.log(`Error templating ${err}`)
    throw err
  }

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