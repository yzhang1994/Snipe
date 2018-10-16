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

const setMultipleInitialBalances = async (contractAddress, balances) => {
  const contractInstance = getContractInstance(contractAddress, abi);
  console.log('+++++++');
  console.log(balances);
  console.log(typeof balances);
  console.log('+++++++');

  const balancesObj = balances;
  const holders = Object.keys(balancesObj);
  const count = holders.length;

  const setBalance = async (index) => {
    if (index < count) {
      const holder = holders[index];
      console.log(holders[index]);
      console.log(balances);
      console.log(balances[holder]);
      await contractInstance.methods.setInitialHolderBalance(holders[index], balances[holders[index]].toString())
        .send({ from: deployer, gas: GAS_LIMIT });
      setBalance(index + 1);
    }
  };
  setBalance(0);
};

module.exports = {
  setInitialBalance,
  setMultipleInitialBalances,
};
