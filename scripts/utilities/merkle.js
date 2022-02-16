const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs')
const fs = require("fs-extra");
const chalk = require('chalk')

function merklize(elements) {
  console.log('elements to merkelize:')
  console.log(chalk.yellow(elements.toString()))
  tree = new MerkleTree(elements, keccak256, { hashLeaves: true, sortPairs: true })
  return { tree, root: tree.getHexRoot() }
}

function getProof(tree, address) {
  leaf = keccak256(address)
  proof = tree.getHexProof(leaf)
  return proof[0] ? proof[0] : ''
}

function createProofsObj(addresses) {
  const proofObj = { sig: '', mapping: {} }
  addresses.forEach((address) => {
    const proof = getProof(tree, address)
    proofObj['mapping'][address] = proof
  })
  return proofObj
}

async function writeSignedProofs(proofObj, destinationPath) {
  try {
    const data = JSON.stringify(proofObj, null, 2)
    fs.writeFileSync(destinationPath, data)
    console.log(chalk.green('Created proofs.json'))
    //file written successfully
  } catch (err) {
    console.log(`Error writing proofs.json ${err}`)
    throw err
  }
}

module.exports = {
  merklize,
  getProof,
  createProofsObj,
  writeSignedProofs
}