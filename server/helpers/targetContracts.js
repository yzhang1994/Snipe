const { getContractInstance, deployer } = require('./targetWeb3.js');

const { abi } = require('../../smart-contracts/build/contracts/MigratedToken.json');
const { GAS_LIMIT } = require('../../smart-contracts/config.js');

const setInitialBalance = async (contractAddress, holder, value) => {
  const contractInstance = getContractInstance(contractAddress, abi);
  const receipt = await contractInstance.methods
    .setInitialHolderBalance(holder, value).send({ from: deployer, gas: GAS_LIMIT });
  console.log(receipt);
  return receipt;
};

module.exports = {
  setInitialBalance,
};
