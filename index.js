const db = require('./src/db');
const Posts = require('./src/models/posts');

Posts.findOne().then(post => {
  console.log(post.get('id'));
});