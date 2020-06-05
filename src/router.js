import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as Users from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';
import signS3 from './services/s3';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// your routes will go here
apiRouter.route('/posts')
  .post(requireAuth, Posts.createPost)
  .get((req, res) => { Posts.getPosts(req, res); });
apiRouter.route('/posts/:id')
  .get((req, res) => { Posts.getPost(req, res); })
  .put(requireAuth, Posts.updatePost)
  .delete(requireAuth, Posts.deletePost);
apiRouter.post('/signin', requireSignin, Users.signin);
apiRouter.post('/signup', Users.signup);
apiRouter.get('/sign-s3', signS3);

export default apiRouter;
