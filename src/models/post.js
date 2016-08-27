const Sequelize = require('sequelize');

const db = require('../db').db;
const Source = require('./source');
const User = require('./user');

const Post = db.define('posts', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    field: 'post_id'
  },

  sourceId: {
    type: Sequelize.INTEGER,
    field: 'source_id'
  },

  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },

  externalId: {
    type: Sequelize.STRING(25),
    field: 'post_external_id'
  },

  dateCreated: {
    type: Sequelize.INTEGER,
    field: 'post_date'
  },

  dateUpdated: {
    type: Sequelize.INTEGER,
    field: 'post_updated'
  },

  title: {
    type: Sequelize.STRING(255),
    field: 'post_title'
  },

  link: {
    type: Sequelize.STRING(255),
    field: 'post_link'
  },

  keywords: {
    type: Sequelize.STRING(255),
    field: 'post_keywords'
  },

  score: {
    type: Sequelize.INTEGER,
    field: 'post_score'
  },

  visible: {
    type: Sequelize.BOOLEAN,
    field: 'post_visible'
  },

  nsfw: {
    type: Sequelize.BOOLEAN,
    field: 'post_nsfw'
  }
});

// Add foreign relationships
Post.belongsTo(Source, {
  foreignKey: 'source_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = Post;