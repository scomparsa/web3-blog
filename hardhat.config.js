require("@nomicfoundation/hardhat-toolbox");

const config = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};

module.exports = config;
