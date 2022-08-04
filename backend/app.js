const express = require('express');
const bodyParser = require('body-parser');
const httpError = require('./models/http-error');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const placesRoute = require('./routes/places');
const usersRoute = require('./routes/users');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads' , 'images')));

//For CORS Error
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

//For Place Route
app.use('/api/places', placesRoute);

//For User Route
app.use('/api/users', usersRoute);

//For any error
app.use((req, res, next) => {
  const error = new httpError('Could not found this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  
  if (req.file) {
    fs.unlink(req.file.path, (err) => {});
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown occured' });
});

//app.use('/users', usersRoute);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1chw7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    //console.log(err);
  });
