const { validationResult } = require('express-validator');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

  const { name, email, password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new httpError(
      'Signing up failed, please try again later.',
      500,
    );
    return next(error);
  }

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
    password: hashedPassword,
    places: [],
    imageUrl: req.file.path,
  });

  try {
    await createUser.save();
  } catch (err) {
    const error = new httpError('Creating user failed, please try again.', 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createUser.id, email: createUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' },
    );
  } catch (err) {
    const error = new httpError('Sign Up failed, please try again later', 500);
    next(error);
  }
  res
    .status(201)
    .json({ userId: createUser.id, email: createUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  //console.log(req);

  if (!errors.isEmpty()) {
    return next(
      new httpError(
        'Invalid inputs passed, please check your data.(Input value is not valid)',
        422,
      ),
    );
  }

  let hasLoginUser;
  try {
    hasLoginUser = await user.findOne({ email: email });
  } catch (err) {
    return next(new httpError('Please try again later', 500));
  }
  if (!hasLoginUser) {
    const error = new httpError(
      'Could not find the user, you must firsty Signup.',
      422,
    );
    return next(error);
  }

  const validity = await user.findOne({ email: email });

  const checkResult = await bcrypt.compare(password, validity.password);

  if (!checkResult) {
    const error = new httpError(
      'Signing in failed, invalid credentials. (P)',
      500,
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: hasLoginUser.id, email: hasLoginUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' },
    );
  } catch (err) {
    const error = new httpError('Sign Up failed, please try again later', 500);
    next(error);
  }

  res.status(201).json({
    email: hasLoginUser.email,
    token: token,
    userId: hasLoginUser.id,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
