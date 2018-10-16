import { abi } from '../contracts/ERC20.json';
import { playbackContract } from './eventWatcher';


const getTokenTransfers = async (address, initialBlock) => {
  try {
    const events = await playbackContract({ abi, address }, initialBlock, 'latest');
    return events.flat();
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = {
  getTokenTransfers,
};
