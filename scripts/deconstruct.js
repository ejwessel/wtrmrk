require('dotenv').config()
const hre = require("hardhat");
const { ethers, network } = hre
const { extractProofFromFile } = require('./utilities/merkle')
const { unarchive } = require('./utilities/archive')
const { execute } = require('./utilities/execute')
const { setupWorkspaces } = require('./utilities/workspace')
const pinataSDK = require('@pinata/sdk');

const { archiveDir, archiveWorkspace, contractDir, nftContractName } = require('./constants')
const fs = require("fs-extra");
const chalk = require('chalk');

async function main() {
  setupWorkspaces([archiveDir, archiveWorkspace, contractDir])

  const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

  const { IpfsHash } = await pinata.pinFromFS('test.png')
  const uri = `https://ipfs.io/ipfs/${IpfsHash}`
  console.log(`Image uploaded to IPFS at ${chalk.green(uri)}`)

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

  console.log(`Deploy: ${chalk.green(process.env.DEPLOY)}`)
  // conditional for deployment
  if (!process.env.DEPLOY) {
    exit(0)
  }

  const [deployer, nonWhitelisted] = await ethers.getSigners();
  const deployerProof = extractProofFromFile(`${archiveWorkspace}proofs.json`, deployer.address)
  const nftFactory = await ethers.getContractFactory(nftContractName);
  const beforeBal = await deployer.getBalance()

  // Creator/Whitelisted
  // const nft = await nftFactory.connect(deployer).deploy([deployerProof], uri)

  // NonWhitelisted !Pays
  // const nft = await nftFactory.connect(nonWhitelisted).deploy([deployerProof], uri, { value: 0.0 }) // should reject

  // NonWhitelisted Pays
  const oneEther = ethers.BigNumber.from("1000000000000000000");
  const nft = await nftFactory.connect(nonWhitelisted).deploy([deployerProof], uri, { value: oneEther })
  const afterBal = await deployer.getBalance()
  console.log(`${ethers.utils.formatEther(beforeBal)} Ether`, `${ethers.utils.formatEther(afterBal)} Ether`)

  await nft.deployed()
  console.log(`NFT Contract deployed to: ${chalk.green(nft.address)}`);
  const fee = await nft.fee()
  const root = await nft.root()
  const sig = await nft.sig()
  const baseURI = await nft.baseURI()
  console.log(`Fee: ${chalk.green(ethers.utils.formatEther(fee))} Ether`)
  console.log(`Root: ${chalk.green(root)}`)
  console.log(`Sig: ${chalk.green(sig)}`)
  console.log(`Base URI: ${chalk.green(baseURI)}`)


  // verify the contract block explorer
  if (network.name !== 'localhost' && network.name !== 'hardhat') {
    await hre.run("verify:verify", {
      address: nft.address,
      constructorArguments: [deployerProof, uri]
    })
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });