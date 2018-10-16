require('dotenv').config();

const app = require('./app');
const targetApp = require('./targetApp');

const PORT = process.env.PORT || 6789;
const ETHPORT = process.env.ETHPORT || 8001;

app.listen(PORT, () => {
  console.log(`[hashgraph/data-migration-service] server listening on port ${PORT}`);
});

targetApp.listen(ETHPORT, () => {
  console.log(`[hashgraph/target-blockchain-app] server listening on port ${ETHPORT}`);
});