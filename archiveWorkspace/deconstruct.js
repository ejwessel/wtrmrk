require('dotenv').config()
const hre = require("hardhat");
const { ethers } = hre
const { extractProofFromFile } = require('./utilities/merkle')
const { unarchive } = require('./utilities/archive')
const { execute } = require('./utilities/execute')
const fs = require("fs-extra");
const chalk = require('chalk');

const archiveDir = 'archive/'
const archiveWorkspace = 'archiveWorkspace/'
const contractTemplateDir = 'contract_templates/'
const contractDir = 'contracts/'
const contractFlattenedDir = 'cache/solpp-generated-contracts'

async function main() {
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir)
    console.log('Created archive dir')
  }
  if (!fs.existsSync(archiveWorkspace)) {
    fs.mkdirSync(archiveWorkspace)
    console.log('Created archive workspace')
  }
  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir)
    console.log('Created contracts dir')
  }

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

  fs.copySync(`${archiveWorkspace}Greeter.sol`, `${contractDir}Greeter.sol`)

  await hre.run('compile')
  console.log('Compiling extracted contract')

  // conditional for deployment
  if (!process.env.DEPLOY) {
    exit(0)
  }

  const [deployer] = await ethers.getSigners();
  const deployerProof = extractProofFromFile(`${archiveWorkspace}proofs.json`, deployer.address)

  const nftFactory = await ethers.getContractFactory("Greeter");
  const nft = await nftFactory.connect(deployer).deploy('hello')
  await nft.deployed()
  console.log(`NFT Contract deployed to: ${chalk.green(nft.address)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });