require('dotenv').config()
const hre = require("hardhat");
const { ethers } = hre
const { merklize, createProofsObj, writeSignedProofs } = require('./utilities/merkle')
const { unarchive } = require('./utilities/archive')
const { execute } = require('./utilities/execute')
const { writeFileFromTemplate } = require('./utilities/template')
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
  } catch (err) {
    console.log(`Error Steganographic write ${err}`)
    throw err
  }

  const absPath = __dirname.split('/')
  const path = absPath.slice(0, absPath.length - 1)
  await unarchive(`${archiveDir}data.zip`, `${path.join('/')}/${archiveWorkspace}`)

  fs.copySync(`${archiveWorkspace}Greeter.sol`, `${contractDir}Greeter.sol`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });