const express = require('express');
const dotenv = require('dotenv');
const { app, server } = require('./socket/socket'); 
const passport = require('passport');
const cors = require('cors');

dotenv.config();

const allowedOrigins = [
  'http://localhost:3000',
  'https://marine-pro.vercel.app', // Your production domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

// Use express.json() to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRouter = require('./routes/api');

const port = process.env.PORT || 3001;

app.use(passport.initialize());
require('./config/passport');

app.use('/api', apiRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
