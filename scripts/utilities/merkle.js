const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs')
const fs = require("fs-extra");
const chalk = require('chalk')

function merklize(elements) {
  console.log('Elements to merkelize:')
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
    console.log(`Created: ${chalk.green('proofs.json')}`)
    //file written successfully
  } catch (err) {
    console.log(`Error writing proofs.json ${err}`)
    throw err
  }
}

function extractProofFromFile(proofPath, address) {
  const rawJson = fs.readFileSync(proofPath)
  const proofs = JSON.parse(rawJson)
  const deploymentProof = proofs[address] ? proofs[address] : ''
  console.log(`proof: ${chalk.green(deploymentProof)}`)
  return deploymentProof

}

module.exports = {
  merklize,
  getProof,
  createProofsObj,
  writeSignedProofs,
  extractProofFromFile
}