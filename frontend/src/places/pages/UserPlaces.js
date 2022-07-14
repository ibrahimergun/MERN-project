import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_DATAS = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://picsum.photos/500/300',
    address: 'Kale Mah. 1. Meram Sok. No:12/2 Corum/Merkez 19100',
    // coordinates: {
    //   lat: 40.7484405,
    //   lng: -73.9878584,
    // },
    creatorID: 'u1',
  },
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://picsum.photos/501/300',
    address: '20 W 34th St, New York, NY 10001',
    // coordinates: {
    //   lat: 40.7484405,
    //   lng: -73.9878584,
    // },
    creatorID: 'u2',
  },
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://picsum.photos/501/301',
    address: '20 W 34th St, New York, NY 10001',
    // coordinates: {
    //   lat: 40.7484405,
    //   lng: -73.9878584,
    // },
    creatorID: 'u2',
  },
];

const UserPlaces = () => {
  
  const UserId = useParams().UserId;

  const filteredPlaces = DUMMY_DATAS.filter(
    (place) => place.creatorID === UserId,
  );

  return <PlaceList items={filteredPlaces} />;
};

export default UserPlaces;
