require('dotenv').config()
const hre = require("hardhat");
const { ethers, network } = hre

async function verify(contractName, contractAddress, signer) {
  const nftFactory = await ethers.getContractFactory(contractName)
  const expectedBytecode = nftFactory.bytecode
  const bytecode = await signer.provider.getCode(contractAddress)
  console.log(expectedBytecode)
  console.log(bytecode)
  console.log(expectedBytecode.length)
  console.log(bytecode.length)
  for (let i = 0; i < expectedBytecode.length; i++) {
    if (expectedBytecode[i] != bytecode[i]) {
      console.log(i)
      break
    }
  }
  // const nft = await ethers.getContractAt('ERC721Image', contractAddress, signer)
  // const uri = await nft.baseURI()
  // const bytecode = nft.bytecode


  // fetch from network
  // fetch from image
  // compare
}

module.exports = {
  verify
}