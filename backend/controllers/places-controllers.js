const httpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');

let DUMMY_DATAS = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://picsum.photos/500/300',
    address: 'Kale Mah. 1. Meram Sok. No:12/2 Corum/Merkez 19100',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://picsum.photos/501/300',
    address: '20 W 34th St, New York, NY 10001',
    coordinates: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u3',
  },
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://picsum.photos/501/301',
    address: '20 W 34th St, New York, NY 10001',
    coordinates: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u2',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://picsum.photos/501/300',
    address: '20 W 34th St, New York, NY 10001',
    coordinates: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u2',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://picsum.photos/501/301',
    address: '20 W 34th St, New York, NY 10001',
    coordinates: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u3',
  },
];

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
  try {
    userPlace = await Place.find({ creator: userId });
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
  });
};

const postUserByUserId = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new httpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  const { title, description, address, creator } = req.body;

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
    imageUrl: 'https://picsum.photos/501/300',
    address,
    creator,
  });

  try {
    await createdPlace.save();
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
    throw new httpError('Invalid inputs passed, please check your data.', 422);
  }

  const placeId = req.params.pid;
  const { title, description, address } = req.body;
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
  updatedPlace.address = address;

  try {
    await updatedPlace.save();
  } catch (err) {
    const error = new httpError(
      'Updating place failed, please try again.',
      500,
    );
    return next(error);
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlaceId = (req, res, next) => {
  const placeId = req.params.pid;

  if (!DUMMY_DATAS.find((p) => p.id === placeId)) {
    throw new httpError('Could not find a place for that id.', 404);
  }

  DUMMY_DATAS = DUMMY_DATAS.filter((prevValues) => prevValues.id !== placeId);

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getUserById = getUserById;
exports.getUserByUserId = getUserByUserId;
exports.postUserByUserId = postUserByUserId;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceId = deletePlaceId;
