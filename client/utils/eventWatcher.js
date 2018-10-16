const { getContractInstance } = require('./web3');

const __getEventListFromContractAbi = (abi) => {
  const eventList = [];
  abi.forEach((construct) => {
    if (construct.type === 'event') eventList.push(construct.name);
  });
  return eventList;
};

const playbackContract = (contract, from, to) => {
  const { address, initialBlock, events, abi  } = contract;
  const contractEvents = events || __getEventListFromContractAbi(abi);

  const contractInstance = getContractInstance(address, abi);

  const fromBlock = from || initialBlock;     // default to download from initial deployment
  const toBlock = to || 'latest';             // default to download till the latest block

  const promises = [];
  contractEvents.forEach((evt) => {
    promises.push(contractInstance.getPastEvents(evt, { fromBlock, toBlock }));
  });

  return Promise.all(promises);
};

module.exports = {
  playbackContract,
};
