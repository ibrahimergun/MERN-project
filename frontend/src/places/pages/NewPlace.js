import React, { useCallback } from 'react';

import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button.js';
import { useForm } from '../../shared/hook/form-hook';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';

const NewPlace = () => {
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

  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      console.log(formState.inputs);
    },
    [formState.inputs],
  );

  return (
    <form className='place-form' onSubmit={submitHandler}>
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
  );
};
export default NewPlace;
