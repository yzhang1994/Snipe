import { abi as tokenAbi } from '../contracts/ERC20.json';
import { getContractInstance, getPrivateContractInstance } from './web3';
import { playbackContract } from './eventWatcher';

const basicGasLimit = 3e5;

const convertBigNum = (num) => {
  const str = num.toString();
  if (!str.includes('e+')) return str;
  const arr = str.split('e+');
  const digits = arr[0].toString();
  let endian = parseFloat(arr[1], 10);

  const numArr = digits.split('.');
  let base = numArr[0].toString();
  const decimals = numArr[1] || '';
  endian -= decimals.length;
  base += decimals;
  for (let i = 0; i < endian; i += 1) base += '0';
  return base;
};

const getEvents = async (address, initialBlock, finalBlock) => {
  try {
    const events = await playbackContract({
      abi: tokenAbi,
      address,
      event: 'Transfer',
    }, initialBlock, finalBlock);
    return events;
  } catch (e) {
    return null;
  }
};

const tokenConstantPromise = async (_address, _constant) => {
  const tokenInstance = getContractInstance(_address, tokenAbi);
  const amount = await tokenInstance.methods[_constant].call().call();
  return amount;
};

// balanceOf(address who) public view returns (uint256);
const tokenBalanceOfPromise = async (_token, _owner) => {
  const tokenInstance = getContractInstance(_token, tokenAbi);
  const amount = await tokenInstance.methods.balanceOf(_owner).call();
  return Number(amount);
};

// balanceOf(address who) public view returns (uint256);
const privateTokenBalanceOfPromise = async (_token, _owner) => {
  const tokenInstance = getPrivateContractInstance(_token, tokenAbi);
  const amount = await tokenInstance.methods.balanceOf(_owner).call();
  return Number(amount);
};

// allowance(address owner, address spender) public view returns (uint256);
const tokenAllowancePromise = async (_token, _owner, _spender) => {
  const tokenInstance = getContractInstance(_token, tokenAbi);
  const amount = await tokenInstance.methods.allowance(_owner, _spender).call();
  return Number(amount);
};

// transfer(address to, uint256 value) public returns (bool);
const tokenTransferPromise = async (_token, _sender, _recipient, _amount, callback) => {
  const tokenInstance = getContractInstance(_token, tokenAbi);
  const receipt = await tokenInstance.methods.transfer(_recipient, _amount).send({
    from: _sender,
    gas: basicGasLimit,
  }, callback);
  return receipt;
};

// approve(address spender, uint256 value) public returns (bool);
const tokenApprovePromise = async (_token, _owner, _spender, _amount) => {
  const tokenInstance = getContractInstance(_token, tokenAbi);
  const receipt = await tokenInstance.methods.approve(_spender, _amount).send({
    from: _owner,
    gas: basicGasLimit,
  });
  return receipt;
};

// approve(address spender, uint256 value) public returns (bool);
const tokenFaucetPromise = async (_token, _owner, callback) => {
  const tokenInstance = getContractInstance(_token, tokenAbi);
  const receipt = await tokenInstance.methods.faucet().send({
    from: _owner,
    gas: basicGasLimit,
  }, callback);
  return receipt;
};


module.exports = {
  privateTokenBalanceOfPromise,
  convertBigNum,
  getEvents,
  tokenAllowancePromise,
  tokenApprovePromise,
  tokenBalanceOfPromise,
  tokenFaucetPromise,
  tokenConstantPromise,
  tokenTransferPromise,
};
