const Web3 = require('web3');

let web3;

const web3Url = process.env.WEB3_URL_SERVER;

const __getWeb3 = () => {
  return new Web3(window.web3.currentProvider || new Web3.providers.HttpProvider(web3Url));
};

const getPrivateWeb3 = () => {
  return new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
};

const getContractInstance = (contractAddress, abi) => {
  if (typeof web3 === 'undefined') web3 = __getWeb3();
  return new web3.eth.Contract(abi, contractAddress);
};

const getPrivateContractInstance = (contractAddress, abi) => {
  if (typeof web3 === 'undefined') web3 = getPrivateWeb3();
  return new web3.eth.Contract(abi, contractAddress);
};

const getBlockNumber = async () => {
  let blockNumber = 0;
  if (typeof web3 === 'undefined') web3 = __getWeb3();
  try {
    blockNumber = await web3.eth.getBlockNumber();
  } catch (e) {
    console.log(`Error retrieving block number: ${e.toString()}`);
  }
  return Number(blockNumber);
};


module.exports = {
  getPrivateWeb3,
  getContractInstance,
  getPrivateContractInstance,
  getBlockNumber,
};
