const Eth = require('web3-eth');

const eth = new Eth(process.env.WEB3_URL_SERVER);

// Source Blockchain
const privateKey = process.env.KYC_WHITELIST_OWNER_PRIVATE_KEY;
const account = eth.accounts.privateKeyToAccount(`0x${privateKey}`);
eth.accounts.wallet.add(account);
eth.defaultAccount = account.address;

const getContractInstance = (contractAddress, abi) => {
  return new eth.Contract(abi, contractAddress);
};

const getBlockTimestamp = (blockNumber) => {
  return new Promise((resolve, reject) => {
    return eth.getBlock(blockNumber)
      .then((result) => {
        if (!result) reject();
        resolve(result.timestamp);
      })
      .catch(() => { resolve(undefined); });
  });
};


module.exports = {
  eth,
  getBlockTimestamp,
  getContractInstance,
};
