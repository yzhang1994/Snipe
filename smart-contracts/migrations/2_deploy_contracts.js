const MigratedToken = artifacts.require('./MigratedToken.sol');
const { DEPLOYER_ADDRESS, NAME, SYMBOL, DECIMALS, SUPPLY, MIGRATED_TOKEN_ADDRESS } = require('../config');

module.exports = (deployer, network, accounts) => {
  // Accounts
  const owner = (network === 'test' || network === 'development') ? accounts[0] : DEPLOYER_ADDRESS;

  // Contract instances
  let migratedToken;

  // 0. Deploy MigratedToken
  deployer.deploy(MigratedToken, NAME, SYMBOL, DECIMALS, SUPPLY, MIGRATED_TOKEN_ADDRESS, { from: owner })
    .then(() => MigratedToken.deployed())
    .then(_instance => migratedToken = _instance)

    // @dev Logs
    .then(() => console.log('  Contract addresses:'))
    .then(() => console.log(`  - MigratedToken             : ${migratedToken.address}`))
};