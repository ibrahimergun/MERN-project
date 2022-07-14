const { validationResult } = require('express-validator');

const httpError = require('../models/http-error');
const uuid = require('uuid');

const DUMMY_USERS = [
  {
    id: 'u2',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
  {
    id: 'u4',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
  {
    id: 'u3',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};
const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new httpError('Invalid inputs passed, please check your data.', 422);
  }

  const { name, email, password } = req.body;

  const hasName = DUMMY_USERS.find((prevValue) => prevValue.email === email);
  if (hasName) {
    throw new httpError('Could not create user, email is already exists.', 422);
  }

  const createUser = {
    id: uuid.v4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createUser);
  res.status(201).json({ user: createUser });
};

const login = (req, res, next) => {
  
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new httpError('Invalid inputs passed, please check your data.(Input value is not valid)', 422);
  }

  const { email, password } = req.body;

  const validity = DUMMY_USERS.find((e) => e.email === email);

  if (!validity || validity.password !== password) {
    throw new httpError(
      'Could not identify user, credentials seem to be wrong.',
      401,
    );
  }

  res.json({ message: 'Logged In' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
