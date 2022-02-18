require('dotenv').config()
const hre = require("hardhat");
const { ethers } = hre

async function verify(contractName, contractAddress, signer) {
  const nftFactory = await ethers.getContractFactory(contractName)
  const expectedBytecode = nftFactory.bytecode
  const deployedBytecode = await signer.provider.getCode(contractAddress)
  return expectedBytecode.includes(deployedBytecode.substring(2)) //substring removes 0x
}

module.exports = {
  verify
}