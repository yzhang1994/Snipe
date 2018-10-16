const express = require('express');

const { deployContract } = require('../helpers/targetWeb3.js');
const { setInitialBalance, setMultipleInitialBalances } = require('../helpers/targetContracts.js');

const targetRouter = express.Router();


targetRouter.route('/create-token')
  .post(async (req, res) => {
    console.log(req.body);
    try {
      const { name, symbol, decimals, supply, parentAddress } = req.body;
      const address = await deployContract([name, symbol, decimals, supply, parentAddress]);
      return res.status(200).send(address);
    } catch (e) {
      return res.status(500).send({ error: 'MigrateToken cannot be created' });
    }
  });

targetRouter.route('/set-balance')
  .post((req, res) => {
    console.log(req.body);
    try {
      const { contractAddress, holder, value } = req.body;
      setInitialBalance(contractAddress, holder, value);
      return res.status(200).send(`update: ${holder} ${value}`);
    } catch (e) {
      return res.status(500).send({ error: 'Could not set balances' });
    }
  });

targetRouter.route('/set-all-balances')
  .post((req, res) => {
    console.log(req.body);
    try {
      const { contractAddress, values } = req.body;
      setMultipleInitialBalances(contractAddress, values);
      return res.status(200).send('Balance request received');
    } catch (e) {
      return res.status(500).send({ error: 'Balance request error' });
    }
  });


module.exports = targetRouter;
