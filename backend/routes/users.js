const express = require('express');
const { check } = require('express-validator');
const usersControllers = require('../controllers/user-controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 5 }),
  ],
  usersControllers.signup,
);

router.post(
  '/login',
  [check('email').isEmail(), check('password').not().isEmpty()],
  usersControllers.login,
);

module.exports = router;
