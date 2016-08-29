const auth = require('../auth');
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

function createPost(req, res) {
  const data = req.body;
  data.dateUpdated = Math.floor(Date.now() / 1000);
  Post.build(data).save().then(post => {
    res.json(post.toJSON());
  }).catch(err => {
    res.status(500).send();
  });
}

function updatePost(req, res) {

}

module.exports = function(app) {
  // Public endpoints
  app.get('/posts', getPosts);

  // Authenticated
  app.post('/post', auth.full, createPost);
  app.put('/post/:id', auth.full, updatePost);
};