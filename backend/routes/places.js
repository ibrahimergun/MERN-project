const express = require('express');
const { check } = require('express-validator');
const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/:pid', placesControllers.getUserById);

router.get('/users/:uid', placesControllers.getUserByUserId);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
    check('creator').not().isEmpty(),
  ],
  placesControllers.postUserByUserId,
);

router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  placesControllers.updatePlaceById,
);

router.delete('/:pid', placesControllers.deletePlaceId);

module.exports = router;
