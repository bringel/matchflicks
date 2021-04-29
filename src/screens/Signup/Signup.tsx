import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Formik } from 'formik';
import React, { useReducer } from 'react';
import { Text, View } from 'react-native';
import * as yup from 'yup';

import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { tailwind } from '../../tailwind';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required()
});

function getErrorMessage(errorCode: string) {
  switch (errorCode) {
    case 'auth/weak-password':
      return 'The password you entered is not strong enough. Please pick a stronger password.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.\nPlease log in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return '';
  }
}

type Props = {};

type State = {
  value: 'idle' | 'submitting' | 'error';
  errorCode: string | null;
};

type Actions = { type: 'startSubmitting' } | { type: 'finishSubmitting' } | { type: 'signupError'; errorCode: string };

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'startSubmitting': {
      return {
        ...state,
        value: 'submitting'
      };
    }
    case 'finishSubmitting': {
      return {
        ...state,
        value: 'idle'
      };
    }
    case 'signupError': {
      return {
        value: 'error',
        errorCode: action.errorCode
      };
    }
    default:
      return state;
  }
}

export const Signup = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    value: 'idle',
    errorCode: null
  });

  const submit = (values: yup.TypeOf<typeof schema>) => {
    dispatch({ type: 'startSubmitting' });
    return auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        dispatch({ type: 'finishSubmitting' });
      })
      .catch(error => {
        dispatch({ type: 'signupError', errorCode: error.code });
      });
  };

  return (
    <View style={tailwind('mt-6 mx-10')}>
      <Formik initialValues={{ email: '', password: '' }} validationSchema={schema} onSubmit={submit}>
        {({ handleSubmit, isValid }) => (
          <>
            <TextInput
              name="email"
              label="Email"
              textContentType="emailAddress"
              keyboardType="email-address"
              style={tailwind('w-full')}
              autoCapitalize={'none'}
            />
            <TextInput
              name="password"
              label="Password"
              textContentType="password"
              secureTextEntry
              style={tailwind('w-full')}
            />
            {state.errorCode === null ? (
              <View style={{ height: 40 }} />
            ) : (
              <View style={tailwind('w-full border rounded-sm border-orange-800 bg-orange-100 py-2 px-3')}>
                <Text style={tailwind('text-orange-800 text-base font-semibold')}>
                  {getErrorMessage(state.errorCode)}
                </Text>
              </View>
            )}
            <Button
              onPress={handleSubmit}
              buttonStyle={tailwind('bg-indigo-500 mt-2')}
              textStyle={tailwind('text-grey-100')}
              disabled={!isValid || state.value === 'submitting'}>
              Sign Up
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};
