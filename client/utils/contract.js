import { getContractInstance } from './web3';
// import { abi as registryAbi } from '../../build/contracts/FileRegistry.json';
import { abi as registryAbi, address as registryAddress } from '../contract.json';

const gasCushion = 1.2;
const safeGasLimit = 2e5;


const registerFile = async (_fileHash, _ethWallet, callback) => {
  const registryInstance = getContractInstance(registryAddress, registryAbi);
  const gas = await registryInstance.methods
    .registerFile(_fileHash)
    .estimateGas({ from: _ethWallet })
    .catch(console.error);
  return registryInstance.methods
    .registerFile(_fileHash)
    .send({
      from: _ethWallet,
      gas: gas ? Math.floor(gas * gasCushion) : safeGasLimit,
    }, callback);
};

const getFileByIndex = async (_index) => {
  const registryInstance = getContractInstance(registryAddress, registryAbi);
  return registryInstance.methods.getFile(_index).call();
};

const getFiles = async (_start, _end) => {
  let index = _start;
  let breakLoop = false;
  const output = [];

  while (!breakLoop && index <= _end) {
    try {
      const fileObj = await getFileByIndex(index);
      if (fileObj.fileHash === '') throw new Error('File does not exist.');
      output.push(fileObj);
      index += 1;
    } catch (e) {
      breakLoop = true;
    }
  }
  return output;
};


module.exports = {
  getFiles,
  registerFile,
};
