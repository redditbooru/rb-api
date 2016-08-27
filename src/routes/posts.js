const Post = require('../models/post');

function getPosts(req, res) {
  Post.findAll({
    limit: 10,
    order: [
      [ 'dateCreated', 'DESC' ]
    ]
  }).then(posts => {
    res.json(posts.map(post => post.toJSON()));
  });
}

module.exports = function(app) {
  // Public endpoints
  app.get('/posts', getPosts);
};