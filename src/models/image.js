const Sequelize = require('sequelize');

const db = require('../db').db;
const Post = require('./post');

const Image = db.define('images', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    field: 'image_id'
  },

  url: {
    type: Sequelize.STRING(512),
    field: 'image_url'
  }
});

module.exports = Image;