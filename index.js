const db = require('./src/db');
const Post = require('./src/models/post');

require('./src/models/post-image');

Post.findOne({
  where: {
    sourceId: {
      $not: null
    }
  }
}).then(post => {
  return post.getImages();
}).then(images => {
  images.forEach(image => {
    console.log(image.get('url'));
  });
  process.exit();
});