const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const io = socketIO(server); // eslint-disable-line no-unused-vars

server.listen(process.env.PORT || 8080);
