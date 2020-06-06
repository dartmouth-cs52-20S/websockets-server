/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
// at top - websockets
import socketio from 'socket.io';
import http from 'http';
// debounce
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';

import * as Notes from './controllers/note_controller';

// add server and io initialization after app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// additional init stuff should go before hitting the routing

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// additional init stuff should go before hitting the routing
// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/posts';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
// change app.listen to server.listen
server.listen(port);

console.log(`listening on: ${port}`);


// at the bottom of server.js
// lets register a connection listener
io.on('connection', (socket) => {
  /*
    Now, it turns out that in particular we want to do different things depending on whether we are the viewer dragging around a note, or if we are another browser that is just seeing the note being dragged around.
      We want to throttle broadcasting notes out to all other browsers (where throttle means: send at a constant decent rate). They don’t need the precision of getting every single update, but they should get a smooth constant rate of updates.
      For the client that is initiating the dragging however, we want to debounce. Basically we don’t want delayed updates coming in and causing jitter. But there are different cases here as well:
        for dragging we want heavy debouncing
        for updating our text box, we want no debouncing at all
   */
  // add these at the top of your: io.on('connection' section
  let emitToSelf = (notes) => {
    socket.emit('notes', notes);
  };
  emitToSelf = debounce(emitToSelf, 200);

  let emitToOthers = (notes) => {
    socket.broadcast.emit('notes', notes);
  };
  emitToOthers = throttle(emitToOthers, 25);

  const pushNotesSmoothed = () => {
    Notes.getNotes().then((result) => {
      emitToSelf(result);
      emitToOthers(result);
    });
  };

  // on first connection emit notes
  Notes.getNotes().then((result) => {
    socket.emit('notes', result);
  });

  // pushes notes to everybody
  const pushNotes = () => {
    Notes.getNotes().then((result) => {
      // broadcasts to all sockets including ourselves
      io.sockets.emit('notes', result);
    });
  };

  // creates notes and
  socket.on('createNote', (fields) => {
    Notes.createNote(fields).then((result) => {
      console.log(fields);
      pushNotes();
    }).catch((error) => {
      console.log(error);
      socket.emit('error', 'create failed');
    });
  });

  // update notes
  socket.on('updateNote', (id, fields) => {
    Notes.updateNote(id, fields).then((result) => {
      // pushNotes();
      if (fields.content) {
        pushNotes();
      } else {
        pushNotesSmoothed();
      }
    }).catch((error) => {
      console.log(error);
      socket.emit('error', 'update failed');
    });
  });
  // on deleteNote do what is needful
  socket.on('deleteNote', (id) => {
    console.log('Got a delete call!');
    Notes.deleteNote(id).then((result) => {
      console.log('finished delete');
      pushNotes();
    }).catch((error) => {
      console.log(error);
      socket.emit('error', 'delete failed');
    });
  });
});
