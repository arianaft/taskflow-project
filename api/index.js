const serverless = require('serverless-http');
const app = require('../server/src/index.js');

module.exports = serverless(app);