require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-web3');
require("@nomiclabs/hardhat-solpp");
require("@nomiclabs/hardhat-etherscan");

function getNetworkUrl(networkName) {
  const alchemyKey = process.env.ALCHEMY_API_KEY || "";
  const url = `https://eth-${networkName}.alchemyapi.io/v2/` + alchemyKey;
  return url;
}

module.exports = {
  networks: {
    // forking is always enabled
    hardhat: {
      forking: {
        url: getNetworkUrl('mainnet'),
      },
      accounts: [{ privateKey: process.env.PRIVATE_KEY, balance: '10000000000000000000000' }],
    },
    mainnet: {
      url: getNetworkUrl('mainnet'),
      accounts: [process.env.PRIVATE_KEY],
      baseFeePerGas: 140e9,
      timeout: 1000000,
    },
    rinkeby: {
      url: getNetworkUrl('rinkeby'),
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 4e9,
      timeout: 1000000,
    },
  },
  solidity: {
    version: "0.8.1",
    optimizer: {
      enabled: true,
      runs: 999999,
    },
  },
  mocha: {
    timeout: 1000000,
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      avalanche: process.env.SNOWTRACE_API_KEY,
    },
  },
  // Disable the following when running the tests
  solpp: {
    "cwd": "./contracts",
    "noFlatten": false
  }
}