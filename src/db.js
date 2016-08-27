const Singleton = require('molecule-singleton');

module.exports = Singleton({
  __construct() {
    const Sequelize = require('sequelize');
    const config = require('../config');
  }
});