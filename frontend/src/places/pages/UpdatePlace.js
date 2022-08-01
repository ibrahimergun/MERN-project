import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hook/form-hook';
import Card from '../../shared/components/UIElements/Card';
import LoginContext from '../../shared/context/Login-Context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hook/http-hook';

import './PlaceForm.css';

const UpdatePlace = () => {
  const history = useHistory();
  const auth = useContext(LoginContext);

  const { sendRequest, errorHandler, loading, errorMessage } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();

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

  const placeId = useParams().PlaceId;

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/places/' + placeId,
        );
        setLoadedPlace(responseData);
        setData(
          {
            title: {
              value: responseData.title,
              isValid: true,
            },
            description: {
              value: responseData.description,
              isValid: true,
            },
          },
          true,
        );
      } catch (error) {}
    };
    fetchPlace();
  }, [placeId, sendRequest, setData]);

  const updateSubmitHandler = async (event) => {
    event.preventDefault();
    await sendRequest(
      'http://localhost:5000/api/places/' + placeId,
      'PATCH',
      {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      },
      {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + auth.token,
      },
    )
      .then(successfulResponse)
      .catch(error);

    function successfulResponse(response) {
      history.push('/' + auth.uid + '/places');
    }
    function error(error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !errorMessage) {
    return (
      <div className='center'>
        <Card>
          <h1> Place not found...</h1>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={errorHandler} />
      {!loading && loadedPlace && (
        <form className='place-form' onSubmit={updateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            value={loadedPlace.title}
            valid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (min. 5 characters).'
            onInput={inputHandler}
            value={loadedPlace.description}
            valid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};
export default UpdatePlace;
