require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

//Route imports
const userRoutes = require('./server/routes/user');
const postRoutes = require('./server/routes/post');
const categoryRoutes = require('./server/routes/category');
const commentRoutes = require('./server/routes/comment');



mongoose.connect(process.env.dbURL)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(error => console.error('MongoDB connection error:', error));

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public', 'index.html')));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

//Route handlers
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/category', categoryRoutes);
app.use('/comment', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});