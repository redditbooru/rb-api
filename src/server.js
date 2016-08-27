const express = require('express');

const config = require('../config');

const app = express();

// Bootstrap the database connection
require('./db');

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