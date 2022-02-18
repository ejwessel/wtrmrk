require('dotenv').config()
const hre = require("hardhat");
const { ethers, network } = hre
const { unarchive } = require('./utilities/archive')
const { execute } = require('./utilities/execute')
const { setupWorkspaces } = require('./utilities/workspace')
const { verify } = require('./utilities/verify')
const { archiveDir, archiveWorkspace, contractDir, nftContractName } = require('./constants')
const fs = require("fs-extra");
const download = require('download');
const chalk = require('chalk');

const imagePath = 'image-ipfs.png'

async function main() {
  setupWorkspaces([archiveDir, archiveWorkspace, contractDir])

  fs.writeFileSync(imagePath, await download(process.env.URI));

  //steganographically extract archive
  try {
    await execute('stegify', ['decode', '--carrier', imagePath, '--result', `${archiveDir}data.zip`])
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

  const [deployer] = await ethers.getSigners();
  const nft = await ethers.getContractAt(nftContractName, process.env.CONTRACT_ADDRESS, deployer)
  const bytecodeIsVerified = await verify(nftContractName, nft.address, deployer)
  console.log(`Deployed bytecode at ${chalk.green(nft.address)} matches ${chalk.green(process.env.URI)}: ${chalk.green(bytecodeIsVerified)}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });