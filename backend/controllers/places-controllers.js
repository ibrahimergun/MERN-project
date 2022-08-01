const httpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');
const mongoose = require('mongoose');
const fs = require('fs');

const Place = require('../models/place');
const User = require('../models/user');

const getUserById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new httpError('Something went wrong, could not find a place', 500),
    );
  }

  if (place.length === 0) {
    return next(
      new httpError('Could not find a place for the provided Id', 404),
    );
  }
  res.json(place.toObject({ getters: true }));
};

const getUserByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userPlace;
  // let populateUserPlace, userPlace1;

  try {
    userPlace = await Place.find({ creator: userId });
    // populateUserPlace = await User.findById(userId).populate('places');
  } catch (err) {
    return next(
      new httpError('Could not find a place for the provided User Id', 500),
    );
  }

  if (userPlace.length === 0) {
    return next(
      new httpError('Could not find a place for the provided user Id', 404),
    );
  }
  res.json({
    userPlace: userPlace.map((place) => place.toObject({ getters: true })),
    // userPlace1: populateUserPlace.places.map((place) =>
    //   place.toObject({ getters: true }),
    // ),
  });
};

const postUserByUserId = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new httpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    imageUrl: req.file.path,
    address,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new httpError(
      'Creating place failed, please try again later',
      500,
    );
    return next(error);
  }

  if (!user) {
    const error = new httpError('Could not find user for provided id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new httpError(
      'Creating place failed, please try again.',
      500,
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new httpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;
  let updatedPlace;

  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    return next(
      new httpError('Could not find a place for the provided Id', 500),
    );
  }

  //findbyidandupdate function can be use.

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    const error = new httpError(
      'Updating place failed, please try again.',
      500,
    );
    return next(error);
  }

  if (updatedPlace.creator.toString() !== req.userData.userId) {
    return next(new httpError('You are not allowed to edit this place.', 401));
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlaceId = async (req, res, next) => {
  const placeId = req.params.pid;
  let removedPlace, place;

  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new httpError(
      'Something went wrong, please try again later',
      500,
    );
    return next(error);
  }

  if (!place) {
    const error = new httpError('Could not find place for provided id', 404);
    return next(error);
  }
  const imagePath = place.imageUrl;


  if (place.creator.id.toString() !== req.userData.userId) {
    return next(
      new httpError('You are not allowed to delete this place.', 403),
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    removedPlace = await Place.findById(placeId).deleteMany({ session: sess });
    await place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new httpError('Could not delete.Something went wrong', 500);
    return next(error);
  }

  //Unlink equalto Delete or Remove
  fs.unlink(imagePath, (error) => {});

  res
    .status(200)
    .json({ message: 'Deleted place.', removedData: removedPlace });
};

exports.getUserById = getUserById;
exports.getUserByUserId = getUserByUserId;
exports.postUserByUserId = postUserByUserId;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceId = deletePlaceId;
