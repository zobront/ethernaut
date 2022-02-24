require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/fb419f740b7e401bad5bec77d0d285a5',
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
