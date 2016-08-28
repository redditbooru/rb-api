const Sequelize = require('sequelize');

const db = require('../db').db;

module.exports = db.define('service-tokens', {
  id: {
    primaryKey: true,
    type: Sequelize.CHAR(8),
    field: 'token_id'
  },

  secret: {
    type: Sequelize.CHAR(36),
    field: 'token_secret'
  }
});