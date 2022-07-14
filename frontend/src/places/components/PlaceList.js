import React from 'react';

import Card from '../../shared/components/UIElements/Card.js';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button.js';
import './PlaceList.css';

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <div>
            <h1>No places to show. Maybe create one?</h1>
          </div>
          <Button to='/places/new'>share Place</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className='place-list'>
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorID={place.creatorID}
          coordinates={place.coordinates}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
