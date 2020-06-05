import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// create a PostSchema with a title field

const UserSchema = new Schema({
  username: { type: String, unique: true, lowercase: true },
  email: { type: String },
  password: { type: String },
}, {
  toObject: {
    virtuals: true,
    // transform: (doc, ret) => {
    //   delete ret.password;
    // },
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
    },
  },
  timestamps: true,
});

UserSchema.pre('save', function beforeyYourModelSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it

  // only hash the password if it has been modified (or is new)
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  // when done run the **next** callback with no arguments
  // call next with an error if you encounter one
  return next();
});

//  note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  const user = this;
  // return callback(null, comparisonResult) for success
  // or callback(error) in the error case
  bcrypt.compare(candidatePassword, user.password, callback);
};

const UserModel = mongoose.model('User', UserSchema);
// create PostModel class from schema


export default UserModel;
