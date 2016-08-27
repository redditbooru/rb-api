const db = require('./src/db');
const Post = require('./src/models/post');

Post.findOne().then(post => {
  console.log(post.get('id'));
});