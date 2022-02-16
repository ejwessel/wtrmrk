require('dotenv').config()
const hre = require("hardhat");
const { ethers, network } = hre
const { extractProofFromFile } = require('./utilities/merkle')
const { unarchive } = require('./utilities/archive')
const { execute } = require('./utilities/execute')
const { setupWorkspaces } = require('./utilities/workspace')
const { archiveDir, archiveWorkspace, contractDir, nftContractName } = require('./constants')
const fs = require("fs-extra");
const chalk = require('chalk');

async function main() {
  setupWorkspaces([archiveDir, archiveWorkspace, contractDir])

  //steganographically extract archive
  try {
    await execute('stegify', ['decode', '--carrier', 'test.png', '--result', `${archiveDir}data.zip`])
    console.log(chalk.green('Success! Image Decoded'))
  } catch (err) {
    console.log(`Error Steganographic write ${err}`)
    throw err
  }

  const absPath = __dirname.split('/')
  const path = absPath.slice(0, absPath.length - 1)
  await unarchive(`${archiveDir}data.zip`, `${path.join('/')}/${archiveWorkspace}`)

  fs.copySync(`${archiveWorkspace}${nftContractName}.sol`, `${contractDir}${nftContractName}.sol`)

  await hre.run('compile')
  console.log('Compiling extracted contract')

  // conditional for deployment
  if (!process.env.DEPLOY) {
    exit(0)
  }

  const [deployer] = await ethers.getSigners();
  const deployerProof = extractProofFromFile(`${archiveWorkspace}proofs.json`, deployer.address)

  const nftFactory = await ethers.getContractFactory(nftContractName);
  const nft = await nftFactory.connect(deployer).deploy('hello')
  await nft.deployed()
  console.log(`NFT Contract deployed to: ${chalk.green(nft.address)}`);

  // verify the contract block explorer
  if (network.name !== 'localhost' && network.name !== 'hardhat') {
    await hre.run("verify:verify", {
      address: nft.address,
      constructorArguments: [
        // name,
        // symbol,
        // provenance,
        // maxSupply
      ]
    })
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });