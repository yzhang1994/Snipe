const express = require('express');

const { deployContract } = require('../helpers/targetWeb3.js');
const { setInitialBalance, setMultipleInitialBalances, getHolderBalance } = require('../helpers/targetContracts.js');

const targetRouter = express.Router();


targetRouter.route('/create-token')
  .post(async (req, res) => {
    // console.log(req.body);
    try {
      const { name, symbol, decimals, totalSupply: supply, address: parentAddress } = req.body;
      const address = await deployContract([name, symbol, decimals, supply, parentAddress]);
      console.log('new contract address', address);
      return res.status(200).send({ address });
    } catch (e) {
      return res.status(500).send({ error: 'MigrateToken cannot be created' });
    }
  });

targetRouter.route('/set-balance')
  .post((req, res) => {
    // console.log(req.body);
    try {
      const { address: contractAddress, balances } = req.body;
      Object.keys(balances).forEach((holder) => {
        setInitialBalance(contractAddress, holder, balances[holder]);
      });
      return res.status(200).send('balance set');
    } catch (e) {
      return res.status(500).send({ error: 'Could not set balances' });
    }
  });

targetRouter.route('/get-balance')
  .post(async (req, res) => {
    console.log(req.body);
    try {
      const { contractAddress, holder } = req.body;
      const value = await getHolderBalance(contractAddress, holder);
      return res.status(200).send(value);
    } catch (e) {
      return res.status(500).send({ error: 'could not retrieve balance ' });
    }
  });

targetRouter.route('/set-all-balances')
  .post((req, res) => {
    // console.log(req.body);
    try {
      const { address: contractAddress, balances } = req.body;
      console.log(contractAddress);
      setMultipleInitialBalances(contractAddress, balances);
      return res.status(200).send('Balance request received');
    } catch (e) {
      return res.status(500).send({ error: 'Balance request error' });
    }
  });


module.exports = targetRouter;
