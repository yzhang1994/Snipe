const { getContractInstance } = require('./web3');

// const __getEventListFromContractAbi = (abi) => {
//   const eventList = [];
//   abi.forEach((construct) => {
//     if (construct.type === 'event') eventList.push(construct.name);
//   });
//   return eventList;
// };

const playbackContract = (contract, from, to) => {
  const { address, initialBlock, abi, event  } = contract;
  const contractInstance = getContractInstance(address, abi);

  const fromBlock = from || initialBlock;     // default to download from initial deployment
  const toBlock = to || 'latest';             // default to download till the latest block

  return contractInstance.getPastEvents(event, { fromBlock, toBlock });
};

module.exports = {
  playbackContract,
};
