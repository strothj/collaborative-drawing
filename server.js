const http = require('http');
const express = require('express');
const io = require('socket.io');

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const socket = io(server); // eslint-disable-line no-unused-vars
socket.on('connection', (client) => {
  client.on('draw', (position) => {
    client.broadcast.emit('draw', position);
  });
});

server.listen(process.env.PORT || 8080);
