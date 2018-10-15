import Web3 from 'web3';
import uport from './uport';

let eth;
const gasPrice = '2000000000';

const initialize = (type) => {
  if (type === 'uport') {
    console.log('No injected web3');
    ({ eth } = new Web3(uport.web3.currentProvider));
    // throw new Error('no web3 instance found in runtime');
  } else if (type === 'metamask') {
    console.log('Injected web3 detected');
    ({ eth } = new Web3(web3.currentProvider));
  }
};

const getContractInstance = (contractAddress, abi) => {
  // set default gas price to 20 gwei
  const options = { gasPrice };
  return new eth.Contract(abi, contractAddress, options);
};

const getConstant = (contractAddress, abi, constant) => {
  const contractInstance = getContractInstance(contractAddress, abi);
  return contractInstance.methods[constant].call().call();
};

const getNetworkId = () => eth.net.getId();
const getAccounts = () => eth.getAccounts();
const getBalance = address => eth.getBalance(address);
const getTransaction = tx => eth.getTransaction(tx);
const getTransactionCount = acct => eth.getTransactionCount(acct);
const getTransactionReceipt = tx => eth.getTransactionReceipt(tx);

const getNetwork = async () => {
  const netId = await getNetworkId();
  switch (netId) {
    case 1: return 'mainnet';
    case 3: return 'ropsten';
    case 4: return 'rinkeby';
    case 42: return 'kovan';
    default: return 'unknown';
  }
};

const sendEther = async (from, to, value) => {
  return eth.sendTransaction({
    from,
    to,
    value: web3.toWei(value, 'ether'),
  });
};

const onLoad = async () => {
  return getAccounts();
};

const safetyWrapper = (func) => {
  return (...args) => {
    try {
      return func.call(null, ...args);
    } catch (e) {
      return console.error(e);
    }
  };
};

module.exports = {
  initialize: safetyWrapper(initialize),
  onLoad: safetyWrapper(onLoad),
  getAccounts: safetyWrapper(getAccounts),
  getBalance: safetyWrapper(getBalance),
  getConstant: safetyWrapper(getConstant),
  getContractInstance: safetyWrapper(getContractInstance),
  getNetwork: safetyWrapper(getNetwork),
  getNetworkId: safetyWrapper(getNetworkId),
  getTransaction: safetyWrapper(getTransaction),
  getTransactionCount: safetyWrapper(getTransactionCount),
  getTransactionReceipt: safetyWrapper(getTransactionReceipt),
  sendEther,
};
