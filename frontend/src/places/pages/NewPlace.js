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
import ImageUpload from '../../shared/components/FormElements/imageUpload';

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';

const NewPlace = () => {
  const { token } = useContext(LoginContext);

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
      image: {
        value: null,
        isValid: false,
      },
    },
    false,
  );
  
  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', formState.inputs.title.value);
    formData.append('description', formState.inputs.description.value);
    formData.append('address', formState.inputs.address.value);
    formData.append('image', formState.inputs.image.value);
    //formData.append('creator', uid);

    await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places/', 'POST', formData, {
      Authorization: 'Bearer ' + token, // with token split
      //Authorization: token, // without token split
    })
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
        <ImageUpload center id='image' onInput={inputHandler} />
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
