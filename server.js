const http = require('http');
const express = require('express');
const io = require('socket.io');

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const socket = io(server);

const WORDS = [
  'word', 'letter', 'number', 'person', 'pen', 'class', 'people',
  'sound', 'water', 'side', 'place', 'man', 'men', 'woman', 'women', 'boy',
  'girl', 'year', 'day', 'week', 'month', 'name', 'sentence', 'line', 'air',
  'land', 'home', 'hand', 'house', 'picture', 'animal', 'mother', 'father',
  'brother', 'sister', 'world', 'head', 'page', 'country', 'question',
  'answer', 'school', 'plant', 'food', 'sun', 'state', 'eye', 'city', 'tree',
  'farm', 'story', 'sea', 'night', 'day', 'life', 'north', 'south', 'east',
  'west', 'child', 'children', 'example', 'paper', 'music', 'river', 'car',
  'foot', 'feet', 'book', 'science', 'room', 'friend', 'idea', 'fish',
  'mountain', 'horse', 'watch', 'color', 'face', 'wood', 'list', 'bird',
  'body', 'dog', 'family', 'song', 'door', 'product', 'wind', 'ship', 'area',
  'rock', 'order', 'fire', 'problem', 'piece', 'top', 'bottom', 'king',
  'space',
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

let users = new Map(); // Hold mapping of client connections and their roles
let word = randomWord();

socket.on('connection', (client) => {
  users.set(client, users.size === 0 ? 'drawer' : 'guesser');
  client.emit('role', users.get(client));
  socket.emit('user count', users.size);
  if (users.get(client) === 'drawer') {
    client.emit('word', word);
  }

  client.on('disconnect', () => {
    if (users.get(client) === 'drawer') { // Reset game if drawer leaves
      users = new Map();
      word = randomWord();
      socket.emit('reset', 'Drawer left the game!');
    }
    users.delete(client);
    socket.emit('user count', users.size);
  });

  client.on('draw', (position) => {
    client.broadcast.emit('draw', position);
  });

  client.on('guess', (guess) => {
    client.broadcast.emit('guess', guess);
  });
});

server.listen(process.env.PORT || 8080);
