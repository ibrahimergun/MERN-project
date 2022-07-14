import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';

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

const Auth = () => {
  
  let history = useHistory();

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
        },
        false,
      );
    }
    console.log(formState);
    setIsLoginMode((prevMode) => !prevMode);
  };

  const formSubmitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      console.log('Loging...');
      console.log(formState.inputs);
      login();
      history.push('/');
    },
    [formState.inputs, history, login],
  );

  return (
    <Card className='authentication'>
      <h2>Login Required</h2>
      <hr />
      <form className='place-form' onSubmit={formSubmitHandler}>
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
          validators={[VALIDATOR_MINLENGTH(8)]}
          errorText='Please enter a valid password (min. 8 characters).'
          value=''
        />

        <React.Fragment>
          <Button to='/' inverse>
            CANCEL
          </Button>
          <Button
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
  );
};
export default Auth;
