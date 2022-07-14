import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };

    case 'SET_DATA':
      return {
        ...state,
        inputs: action.inputs,
        isValid: action.isValid,
      };

    default:
      return state;
  }
};

export const useForm = (initialFormInputs, InitialFormValidity) => {
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputs: initialFormInputs,
    isValid: InitialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatchFormState({
      type: 'INPUT_CHANGE',
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  const setData = useCallback((inputs, isValid) => {
    dispatchFormState({
      type: 'SET_DATA',
      inputs: inputs,
      isValid: isValid,
    });
  }, []);

  return [formState, inputHandler, setData];
};
