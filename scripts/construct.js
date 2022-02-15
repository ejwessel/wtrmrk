require('dotenv').config()
const { ethers } = require("hardhat");
const { merklize, getProof } = require('./utilities/merkle')
const fs = require('fs')

async function main() {
  //merkle
  const addresses = process.env.ADDRESSES.split(',')
  const { tree, root } = merklize(addresses)
  console.log(`root hash: ${root}`)
  console.log('tree')
  console.log(tree.toString())

  //write the signature and proofs to file
  const proofObj = { sig: '', mapping: {} }
  addresses.forEach((address) => {
    const proof = getProof(tree, address)
    proofObj['mapping'][address] = proof
  })

  const accounts = await ethers.getSigners();
  console.log('proof signature')
  const signer = accounts[0]
  const sig = await signer.signMessage(JSON.stringify(proofObj))
  console.log(sig)
  proofObj['sig'] = sig
  console.log('proof mapping')
  console.log(proofObj)

  try {
    const data = JSON.stringify(proofObj, null, 2)
    fs.writeFileSync('./outputs/proofs.json', data)
    //file written successfully
  } catch (err) {
    console.error(err)
  }

  //replace template contract code

  //zip flattened contracts, js deployment code, merkle proofs files together

  //


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });