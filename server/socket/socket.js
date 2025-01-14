const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://marine-pro.vercel.app', // Your production domain
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Origin:', origin); // Log the origin of the request
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Not allowed by CORS:', origin); // Log the disallowed origin
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('userConnected', ({ userId }) => {
    onlineUsers[userId] = socket.id;
    io.emit('updateUserStatus', { userId, status: 'online' });
    io.emit('onlineUsers', Object.keys(onlineUsers));  // Emit the list of currently online users
    console.log(`User ${userId} is now online`);
  });

  socket.on('disconnect', () => {
    const userId = Object.keys(onlineUsers).find(id => onlineUsers[id] === socket.id);
    if (userId) {
      delete onlineUsers[userId];
      io.emit('updateUserStatus', { userId, status: 'offline' });
      io.emit('onlineUsers', Object.keys(onlineUsers));  // Emit the updated list of currently online users
      console.log(`User ${userId} is now offline`);
    }
    console.log('A user disconnected', socket.id);
  });

  socket.on('chat message', ({ chatId, message }) => {
    console.log(`Message received for chat ${chatId}:`, message);
    io.to(chatId).emit('chat message', { chatId, message });
  });
});

module.exports = { app, server, io };
