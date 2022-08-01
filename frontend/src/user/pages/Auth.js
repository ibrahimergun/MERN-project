import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hook/http-hook';

import './Auth.css';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hook/form-hook';
import Card from '../../shared/components/UIElements/Card';
import LoginContext from '../../shared/context/Login-Context';
import ImageUpload from '../../shared/components/FormElements/imageUpload';

const Auth = () => {
  let history = useHistory();
  const { sendRequest, errorHandler, loading, errorMessage } = useHttpClient();

  const { login } = useContext(LoginContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false,
  );

  const switchHandler = () => {
    if (!isLoginMode) {
      setData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid,
      );
    } else {
      setData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      await sendRequest(
        'http://localhost:5000/api/users/login',
        'POST',
        {
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        },
        // {
        //   'content-type': 'application/json',
        // },
      )
        .then(succesfullResponse)
        .catch(error);

      function succesfullResponse(responseData) {
        login(responseData.userId , responseData.token);
        history.push('/');
      }
      function error(error) {}
    } else {
      const formData = new FormData();
      formData.append('name', formState.inputs.name.value);
      formData.append('email', formState.inputs.email.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('image', formState.inputs.image.value);

      await sendRequest(
        'http://localhost:5000/api/users/signup',
        'POST',
        formData,
      )
        .then(succesfullResponse)
        .catch(error);
      function succesfullResponse(responseData) {
        login(responseData.userId,  responseData.token);
        history.push('/');
      }
      function error(error) {}
    }
  };
  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={errorHandler} />
      <Card className='authentication'>
        {loading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={formSubmitHandler}>
          {!isLoginMode && (
            <Input
              id='name'
              element='input'
              type='name'
              label='Your Name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a valid Name'
              onInput={inputHandler}
              value=''
            />
          )}
          {!isLoginMode && (
            <ImageUpload center id='image' onInput={inputHandler} />
          )}
          <Input
            id='email'
            element='input'
            type='Email'
            label='Email'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid Email.'
            onInput={inputHandler}
            value=''
          />
          <Input
            onInput={inputHandler}
            id='password'
            element='input'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid password (min. 6 characters).'
            value=''
          />

          <React.Fragment>
            <Button to='/' inverse>
              CANCEL
            </Button>
            <Button
              type='submit'
              onClick={formSubmitHandler}
              danger
              disabled={!formState.isValid}
            >
              {isLoginMode ? 'Login' : 'SIGNUP'}
            </Button>
          </React.Fragment>
        </form>
        <Button onClick={switchHandler} inverse>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};
export default Auth;
