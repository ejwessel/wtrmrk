const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs')
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

module.exports = {
  merklize,
  getProof
}