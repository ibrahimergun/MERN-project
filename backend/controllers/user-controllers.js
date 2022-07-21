const { validationResult } = require('express-validator');
const user = require('../models/user');

const httpError = require('../models/http-error');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await user.find({}, '-password');
  } catch (err) {
    return next(
      new httpError('Something went wrong, could not find a users', 500),
    );
  }
  if (users.length === 0) {
    return next(new httpError('Could not find the any user', 404));
  }
  res.json({ users: users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new httpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  const { name, email, password} = req.body;

  const hasEmail = await user.findOne({ email: email });

  if (hasEmail) {
    const error = new httpError(
      'Could not create user, email is already exists.',
      422,
    );
    return next(error);
  }

  const createUser = new user({
    name,
    email,
    password,
    places: [],
    imageUrl: 'https://picsum.photos/501/302',
  });

  try {
    await createUser.save();
  } catch (err) {
    const error = new httpError('Creating user failed, please try again.', 500);
    return next(error);
  }
  res.status(201).json({ user: createUser });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new httpError(
        'Invalid inputs passed, please check your data.(Input value is not valid)',
        422,
      ),
    );
  }

  let checkUserEmail;
  try {
    checkUserEmail = await user.findOne({ email: email });
  } catch (err) {
    return next(new httpError('Please try again later', 500));
  }
  if (!checkUserEmail) {
    const error = new httpError(
      'Could not find the user, you must firsty Signup.',
      422,
    );
    return next(error);
  }

  const validity =await user.findOne({ email: email });

  if (!validity || validity.password !== password) {
    return next(
      new httpError(
        'Could not identify user, credentials seem to be wrong.',
        401,
      ),
    );
  }

  res.json({ message: 'Logged In' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
