const bodyParser = require('body-parser');
const express = require('express');

const config = require('../config');

const app = express();
app.use(bodyParser.json());

// Bootstrap the database and memcached connections
require('./db');
require('./cache');

// Load up the routes
[
  'posts'
].forEach(route => {
  route = require(`./routes/${route}`);
  route(app);
});

// Start the server
app.listen(config.port, (err) => {
  if (!err) {
    console.log(`Listening on port ${config.port}`);
  }
});