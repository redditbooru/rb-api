const Sequelize = require('sequelize');

const db = require('../db').db;

module.exports = db.define('users', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    field: 'user_id'
  },

  name: {
    type: Sequelize.STRING(20),
    field: 'user_name'
  },

  redditId: {
    type: Sequelize.STRING(12),
    field: 'user_reddit_id'
  }
});