import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceForm.css';
import LoginContext from '../../shared/context/Login-Context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Input from '../../shared/components/FormElements/Input';
import { useHttpClient } from '../../shared/hook/http-hook';
import Button from '../../shared/components/FormElements/Button.js';
import { useForm } from '../../shared/hook/form-hook';

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';

const NewPlace = () => {
  const { uid } = useContext(LoginContext);

  const { sendRequest, errorHandler, loading, errorMessage } = useHttpClient();
  const history = useHistory();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    false,
  );

  const submitHandler = async (event) => {
    event.preventDefault();

    await sendRequest(
      'http://localhost:5000/api/places/',
      'POST',
      {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
        creator: uid,
      },
      {
        'content-type': 'application/json',
      },
    )
      .then(successfulResponse)
      .catch(error);

    function successfulResponse(response) {
      history.push('/');
    }
    function error(error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={errorHandler} />
      <form className='place-form' onSubmit={submitHandler}>
        {loading && <LoadingSpinner asOverlay />}
        <Input
          id='title'
          onInput={inputHandler}
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title'
        />
        <Input
          onInput={inputHandler}
          id='description'
          element='textarea'
          type='text'
          label='description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid description(at least 5 characters)'
        />
        <Input
          onInput={inputHandler}
          id='address'
          element='input'
          type='text'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid address'
        />
        <Button type='submit' disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </React.Fragment>
  );
};
export default NewPlace;
