import Note from '../models/note';

export const getNotes = () => {
  return Note.find({}).then((notes) => {
    return notes.reduce((result, item) => {
      result[item.id] = item;
      return result;
    }, {});
  });
};

export const deleteNote = (id) => {
  // to quote Prof. Cormen: left as an exercise to the reader
  // remember to return the mongoose function you use rather than just delete
  return Note.findOne({ _id: id }).then((note) => {
    return Note.remove({ _id: note._id });
  });
};

export const createNote = (fields) => {
  const note = new Note();
  Object.keys(fields).forEach((k) => {
    note[k] = fields[k];
  });
  return note.save();
};

export const updateNote = (id, fields) => {
  return Note.findById(id)
    .then((note) => {
      // check out this classy way of updating only the fields necessary
      Object.keys(fields).forEach((k) => {
        note[k] = fields[k];
      });
      return note.save();
    });
};
