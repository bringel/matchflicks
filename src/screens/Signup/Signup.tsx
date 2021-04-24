import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useMachine } from '@xstate/react';
import { Formik } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';
import { assign, createMachine } from 'xstate';
import * as yup from 'yup';

import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { tailwind } from '../../tailwind';

interface SignupContext {
  errorCode: string | null;
}

const machine = createMachine<SignupContext>({
  initial: 'idle',
  context: {
    errorCode: null
  },
  states: {
    idle: {
      on: {
        submit: {
          target: 'submitting'
        }
      }
    },
    submitting: {
      invoke: {
        src: (context, event) => {
          return auth().createUserWithEmailAndPassword(event.payload.email, event.payload.password);
        },
        onDone: {
          target: 'created'
        },
        onError: {
          target: 'error',
          actions: assign({
            errorCode: (context, event) => event.data.code
          })
        }
      }
    },
    error: {
      on: {
        submit: {
          target: 'submitting',
          actions: assign<SignupContext>({
            errorCode: null
          })
        }
      }
    },
    created: {
      type: 'final'
    }
  }
});

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

export const Signup = (props: Props) => {
  const [state, send] = useMachine(machine);

  return (
    <View style={tailwind('mt-6 mx-10')}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schema}
        onSubmit={values => {
          send({ type: 'submit', payload: values });
        }}>
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
            {state.context.errorCode === null ? (
              <View style={{ height: 40 }} />
            ) : (
              <View style={tailwind('w-full border rounded-sm border-orange-800 bg-orange-100 py-2 px-3')}>
                <Text style={tailwind('text-orange-800 text-base font-semibold')}>
                  {getErrorMessage(state.context.errorCode)}
                </Text>
              </View>
            )}
            <Button
              onPress={handleSubmit}
              buttonStyle={tailwind('bg-indigo-500 mt-2')}
              textStyle={tailwind('text-grey-100')}
              disabled={!isValid || state.matches('submitting')}>
              Sign Up
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};
