const express = require('express');

const { deployContract } = require('../helpers/targetWeb3.js');
const { setInitialBalance } = require('../helpers/targetContracts.js');

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
      return res.status(500).send({ error: 'MigrateToken cannot be created' });
    }
  });


module.exports = targetRouter;
