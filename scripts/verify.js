require('dotenv').config()
const hre = require("hardhat");
const { ethers, network } = hre

async function main() {
  // fetch from network
  // fetch from image
  // compare

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });