const Sequelize = require('sequelize');

const db = require('../db').db;
const Source = require('./sources');

const Post = db.define('posts', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    field: 'post_id'
  }
});

Post.hasOne(Source);

module.exports = Post;