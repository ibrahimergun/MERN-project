const express = require('express');
const bodyParser = require('body-parser');
const httpError = require('./models/http-error');

const placesRoute = require('./routes/places');
const usersRoute = require('./routes/users');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoute);

app.use('/api/users', usersRoute);

app.use((req, res, next) => {
  console.log('3');
  const error = new httpError('Could not found this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  //optional
  console.log('4');
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown occured' });
});

//app.use('/users', usersRoute);

app.listen(5000);
