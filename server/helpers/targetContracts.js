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

const setMultipleInitialBalances = async (contractAddress, values) => {
  const contractInstance = getContractInstance(contractAddress, abi);
  console.log('+++++++');
  console.log(values);
  console.log(typeof values);
  console.log('+++++++');

  const valuesArray = JSON.parse(values);
  const count = valuesArray.length;

  const setBalance = async (index) => {
    if (index < count) {
      console.log(valuesArray[index]);
      const { holder, value } = valuesArray[index];
      await contractInstance.methods.setInitialHolderBalance(holder, value)
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
