const { ethers } = require("hardhat");
const { expect } = require("chai");
const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs')
const timeMachine = require('ganache-time-traveler');
const fs = require("fs-extra");
const config = require('hardhat.config.js')

// NOTE: DISABLE solpp WITHIN hardhat.config.js WHEN RUNNING TESTS!

describe("Test ERC721Image", function () {
  let accounts
  let deployer
  let nonWhitelistedAccount
  let tree
  let root
  let leaf
  let proof
  let snapshotId

  beforeEach(async () => {
    let snapshot = await timeMachine.takeSnapshot()
    snapshotId = snapshot['result'];
  })

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId)
  })

  before(async () => {
    // setup accounts
    accounts = await hre.ethers.getSigners();
    deployer = accounts[0]
    nonWhitelistedAccount = accounts[1]

    // Create Merkle Data: Tree, Root, Proof
    tree = new MerkleTree(
      [
        '0x493d7ca07ccce5b66d244e305c11838f9cf66ffc',
        '0x5814e529d85fb2751d5df9a808ab12e06d1114a0',
        accounts[0].address //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
      ],
      keccak256, { hashLeaves: true, sortPairs: true })
    root = tree.getHexRoot()
    leaf = keccak256(deployer.address)
    proof = tree.getHexProof(leaf)
  })


  it("Check instantiated values", async () => {
    const nftFactory = await ethers.getContractFactory("ERC721Image");
    const nft = await nftFactory.connect(deployer).deploy(proof, 'www.google.com')
    expect(await nft.fee()).to.equal(ethers.BigNumber.from("1000000000000000000"))
    expect(await nft.root()).to.equal('0xc83aea70ecfb16a08a9aed5f227872b05473debe80e5bc7f300839be8feb8b36')
    expect(await nft.sig()).to.equal('0x6d735763fec3449b427bb24f0202d89bcdee471b919d3890b4cbb8a7e6dfdb7c7f97b6b6b4c97713fd5c68a231bd036460bd511c25dc1b1d378a24d77bdcbb6d1c')
    expect(await nft.baseURI()).to.equal('www.google.com')
  })

  it("Whitelisted address successfully deploys without paying fee", async () => {
    const nftFactory = await ethers.getContractFactory("ERC721Image");
    await expect(nftFactory.connect(deployer).deploy(proof, 'www.google.com')).to.not.be.reverted;
  });

  it("Non whitelisted address successfully deploys with paying fee", async () => {
    const nftFactory = await ethers.getContractFactory("ERC721Image");
    const oneEther = ethers.BigNumber.from("1000000000000000000");
    await expect(nftFactory.connect(nonWhitelistedAccount).deploy(
      proof,
      'www.google.com',
      { value: oneEther }
    )).to.not.be.reverted;
  });

  it("Non whitelisted address unsuccessfully deploys withoutpaying fee", async () => {
    const nftFactory = await ethers.getContractFactory("ERC721Image");
    await expect(nftFactory.connect(nonWhitelistedAccount).deploy(
      proof,
      'www.google.com'
    )).to.be.revertedWith('address not whitelisted, at least 1 Ether fee required for deployment');
  });
});
