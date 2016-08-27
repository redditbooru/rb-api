const db = require('./src/db');
const Post = require('./src/models/post');

Post.findOne({
  where: {
    sourceId: {
      $not: null
    }
  }
}).then(post => {
  console.log(post.get('nsfw'));
  return post.getSource();
}).then(source => {
  console.log(source.get('name'));
  process.exit();
});