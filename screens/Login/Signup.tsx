import auth from '@react-native-firebase/auth';
import { useMachine } from '@xstate/react';
import { Formik } from 'formik';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { assign, createMachine } from 'xstate';
import * as yup from 'yup';

import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { tailwind } from '../../tailwind';

interface SignupContext {
  errorCode: string | null;
  errorMessage: string | null;
}

const machine = createMachine<SignupContext>({
  initial: 'idle',
  context: {
    errorCode: null,
    errorMessage: null
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
            errorCode: (context, event) => event.data.code,
            errorMessage: (context, event) => event.data.nativeErrorMessage
          })
        }
      }
    },
    error: {
      on: {
        submit: {
          target: 'submitting',
          actions: assign<SignupContext>({
            errorCode: '',
            errorMessage: ''
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

type Values = yup.InferType<typeof schema>;

type Props = {};

export const Signup = (props: Props) => {
  const [state, send] = useMachine(machine);

  const handleSubmitButton = (values: Values) => {
    send({ type: 'submit', payload: values });
  };

  return (
    <SafeAreaView style={tailwind('flex-1 bg-grey-800')}>
      <View style={tailwind('mt-6 mx-10')}>
        <Formik initialValues={{ email: '', password: '' }} validationSchema={schema} onSubmit={handleSubmitButton}>
          {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
            <>
              <Text style={tailwind('text-grey-100 text-base')}>Email</Text>
              <TextInput
                textContentType="emailAddress"
                keyboardType="email-address"
                style={tailwind('w-full')}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                autoCapitalize={'none'}
              />
              <Text style={tailwind('text-grey-100 text-base')}>Password</Text>
              <TextInput
                textContentType="password"
                secureTextEntry
                style={tailwind('w-full')}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <Text style={tailwind('w-full text-base mt-2')}>&nbsp;</Text>
              <Button
                onPress={handleSubmit}
                buttonStyle={tailwind('bg-indigo-500 mt-2')}
                textStyle={tailwind('text-white')}
                disabled={!isValid || state.matches('submitting')}>
                Sign Up
              </Button>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};
