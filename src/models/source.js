const Sequelize = require('sequelize');

const db = require('../db').db;

module.exports = db.define('sources', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    field: 'source_id'
  },
  name: {
    type: Sequelize.STRING(50),
    field: 'source_name'
  },
  type: {
    type: Sequelize.STRING(20),
    field: 'source_type'
  }
});