// This file copies web3 and can be updated for the new blockchain (hashgraph)
require('dotenv').config();
const Eth = require('web3-eth');

// const { NAME, SYMBOL, DECIMALS, SUPPLY, MIGRATED_TOKEN_ADDRESS, GAS_PRICE_DEV, GAS_LIMIT } = require('../../smart-contracts/config.js');

const targetEth = new Eth(process.env.TARGET_BLOCKCHAIN_URL);
const from = process.env.DEPLOYER_ADDRESS;

// Source Blockchain
const privateKey = process.env.TARGET_OWNER_PRIVATE_KEY;
const account = targetEth.accounts.privateKeyToAccount(`0x${privateKey}`);
targetEth.accounts.wallet.add(account);
targetEth.defaultAccount = account.address;

const deployContract = async (abi, bytecode, args) => {
  const newContract = new targetEth.Contract(abi, { from, data: bytecode });
  const deployed = await newContract.deploy({ data: bytecode, arguments: args });
  let address;
  try {
    const instance = await deployed.send({ from, gas: 4.7e6 });
    address = instance.options.address;
    console.log(address);
  } catch (e) {
    console.log(e.toString());
  }
  return address;
};

const getContractInstance = (contractAddress, abi) => {
  return new targetEth.Contract(abi, contractAddress);
};

const getBlockTimestamp = (blockNumber) => {
  return new Promise((resolve, reject) => {
    return targetEth.getBlock(blockNumber)
      .then((result) => {
        if (!result) reject();
        resolve(result.timestamp);
      })
      .catch(() => { resolve(undefined); });
  });
};

// const { abi, bytecode } = require('../../smart-contracts/build/contracts/MigratedToken.json');

// const run = async () => {
//   const address = await deployContract(abi, bytecode, [NAME, SYMBOL, DECIMALS, SUPPLY, MIGRATED_TOKEN_ADDRESS]);
//   console.log(address);
// }

// run();

module.exports = {
  targetEth,
  deployContract,
  getBlockTimestamp,
  getContractInstance,
};
