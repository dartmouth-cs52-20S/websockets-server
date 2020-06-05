import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import UserModel from '../models/user_model';


dotenv.config({ silent: true });
// and then the secret is usable this way:
// process.env.AUTH_SECRET

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const signin = (req, res, next) => {
  UserModel.findOne({ username: req.body.username }, (err, user) => {
    if (user) {
      user.comparePassword(req.body.password, (err, result) => {
        if (err) res.status(422).send('Cannot access passwords.');
        else if (result) {
          // if the password is correct
          res.send({ token: tokenForUser(user), username: user.username });
        } else {
          res.status(422).send('Incorrect password!');
        }
      });
    } else res.status(422).send('User doesn\'t exist!');
  });
};

export const signup = (req, res, next) => {
  const { username, email, password } = req.body;
  const isEmpty = !username || !email || !password;

  if (isEmpty) {
    res.status(422).send('You must provide email and password');
  } else {
    UserModel.findOne({ username })
      .then((user) => {
        if (user) {
          res.status(422).send('Username already exists!');
        } else {
          const newUser = new UserModel();
          newUser.username = username;
          newUser.email = email;
          newUser.password = password;
          newUser.save((err, savedUser) => {
            if (err) res.status(422).send('User creation failed!');
            else {
              res.send({ token: tokenForUser(savedUser) });
            }
          });
        }
      });
  }
  // 🚀 TODO:
  // here you should do a mongo query to find if a user already exists with this email.
  // if user exists then return an error. If not, use the User model to create a new user.
  // Save the new User object
  // this is similar to how you created a Post
  // and then return a token same as you did in in signin
};
