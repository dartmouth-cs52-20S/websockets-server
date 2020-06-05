import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field

const PostSchema = new Schema({
  title: String,
  coverUrl: String,
  content: String,
  tags: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

const PostModel = mongoose.model('Post', PostSchema);
// create PostModel class from schema


export default PostModel;
