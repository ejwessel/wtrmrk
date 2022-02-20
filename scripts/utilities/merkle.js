const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs')
const fs = require("fs-extra");
const chalk = require('chalk')

function merklize(elements) {
  console.log('Elements to merkelize:')
  elements.forEach(element => {
    console.log(chalk.yellow(element.toString()))
  })
  tree = new MerkleTree(elements, keccak256, { hashLeaves: true, sortPairs: true })
  return { tree, root: tree.getHexRoot() }
}

function getProof(tree, address) {
  leaf = keccak256(address)
  proof = tree.getHexProof(leaf)
  return proof.length > 0 ? proof : undefined
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
  const deploymentProof = address in proofs['mapping'] ? proofs['mapping'][address] : `0x${keccak256('none').toString('hex')}`
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