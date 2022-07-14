import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hook/form-hook';
import Card from '../../shared/components/UIElements/Card';
import './PlaceForm.css';

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
];

const UpdatePlace = () => {
  const [formState, inputHandler, setData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false,
  );
  const [loading, setLoading] = useState(true);
  const placeId = useParams().PlaceId;
  const placeData = DUMMY_DATAS.find((place) => place.id === placeId);

  useEffect(() => {
    if (placeData) {
      setData(
        {
          title: {
            value: placeData.title,
            isValid: true,
          },
          description: {
            value: placeData.description,
            isValid: true,
          },
        },
        true,
      );
    }
    setLoading(false);
  }, [placeData, setData]);

  const updateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (loading) {
    return (
      <div className='center'>
        <h2> Loading...</h2>
      </div>
    );
  }

  if (!placeData) {
    return (
      <div className='center'>
        <Card>
          <h1> Place not found...</h1>
        </Card>
      </div>
    );
  }
  return (
    <form className='place-form' onSubmit={updateSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title.'
        onInput={inputHandler}
        value={formState.inputs.title.value}
        valid={formState.inputs.title.isValid}
      />
      <Input
        id='description'
        element='textarea'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid description (min. 5 characters).'
        onInput={inputHandler}
        value={formState.inputs.description.value}
        valid={formState.inputs.description.isValid}
      />
      <Button type='submit' disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};
export default UpdatePlace;
