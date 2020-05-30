// This exists solely to prevent a circular reference
const Post = require('./post');
const Image = require('./image');

Post.belongsToMany(Image, {
  through: 'post_images',
  as: 'Images',
  foreignKey: 'post_id'
});

Image.belongsToMany(Post, {
  through: 'post_images',
  as: 'Posts',
  foreignKey: 'image_id'
});