require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 6789;

app.listen(PORT, () => {
  console.log(`[hashgraph/data-migration-service] server listening on port ${PORT}`);
});
