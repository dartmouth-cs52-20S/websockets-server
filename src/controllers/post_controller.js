import PostModel from '../models/post_model';

export const createPost = (req, res) => {
  const post = new PostModel();
  post.coverUrl = req.body.coverUrl;
  post.title = req.body.title;
  post.content = req.body.content;
  post.tags = req.body.tags;
  post.author = req.user;
  // console.log(post);
  // res.send('post should be created and returned');
  post.save()
    .then(() => {
      res.json({ message: 'Post created!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
export const getPosts = (req, res) => {
  PostModel.find()
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
export const getPost = (req, res) => {
  PostModel.findOne({ _id: req.params.id }).populate('author').exec((err, rc) => {
    if (err) res.json({ message: 'Post not found!' });
    const {
      coverUrl, content, title, tags,
    } = rc;
    res.json({
      coverUrl, content, title, tags, author: rc.author.username,
    });
  });
};
export const deletePost = (req, res) => {
  PostModel.findOne({ _id: req.params.id }, (err, post) => {
    if (err) res.status(422).send('Post not found!');
    else if (post) {
      // eslint-disable-next-line eqeqeq
      if (post.author == req.user.id) {
        PostModel.remove({ _id: req.params.id })
          .then(() => {
            res.json({ message: 'Post deleted!' });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      } else res.status(422).send('You are not allowed to delete posts from someone else.');
    }
    // else res.status(422).send('Post not found!');
  });
};
export const updatePost = (req, res) => {
  PostModel.findOne({ _id: req.params.id })
    .then((post) => {
      // eslint-disable-next-line
      if (post.author == req.user.id) {
        post.coverUrl = req.body.coverUrl;
        post.title = req.body.title;
        post.content = req.body.content;
        post.tags = req.body.tags;
        post.save()
          .then(() => {
            res.json({ message: 'Post updated!' });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      } else res.status(422).send('You are not allowed to update posts created by someone else.');
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
