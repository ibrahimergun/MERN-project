const express = require('express');
const { check } = require('express-validator');
const usersControllers = require('../controllers/user-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
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
