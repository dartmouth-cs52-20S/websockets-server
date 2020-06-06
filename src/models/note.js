import mongoose, { Schema } from 'mongoose';

const NoteSchema = new Schema({
  title: String,
  content: String,
  isEditing: Number,
  x: Number,
  y: Number,
  zIndex: Number,
  text: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

const NoteModel = mongoose.model('Post', NoteSchema);
// create PostModel class from schema


export default NoteModel;
