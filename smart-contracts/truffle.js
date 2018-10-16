const { DEPLOYER_ADDRESS } = require('./config');

module.exports = {
  networks: {
    testrpc: {
      host: 'localhost',
      port: 8545,
      gas: 4700000,             // Current Ropsten limit is approx 4712388
      gasPrice: 20e9,           // 20 GWei
      network_id: '688',
      from: DEPLOYER_ADDRESS,
    },
  },
};