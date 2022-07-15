const express = require('express');
const bodyParser = require('body-parser');
const httpError = require('./models/http-error');
const mongoose = require('mongoose');

const placesRoute = require('./routes/places');
const usersRoute = require('./routes/users');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoute);

app.use('/api/users', usersRoute);

app.use((req, res, next) => {
  
  const error = new httpError('Could not found this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  //optional

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown occured' });
});

//app.use('/users', usersRoute);

mongoose
  .connect('mongodb+srv://ibrahim:Ibrahim19.@cluster0.1chw7.mongodb.net/Places?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
