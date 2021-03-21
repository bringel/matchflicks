import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { useMachine } from '@xstate/react';
import { Formik } from 'formik';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import { assign, createMachine } from 'xstate';
import * as yup from 'yup';

import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { tailwind } from '../../tailwind';

interface LoginContext {
  errorCode: string | null;
}

const machine = createMachine<LoginContext>({
  initial: 'idle',
  context: {
    errorCode: null
  },
  states: {
    idle: {
      on: {
        submit: {
          target: 'submitting'
        },
        loginWithGoogle: {
          target: 'loggingInWithGoogle'
        }
      }
    },
    submitting: {
      invoke: {
        src: (context, event) => {
          return auth().signInWithEmailAndPassword(event.payload.email, event.payload.password);
        },
        onDone: {
          target: 'loggedIn'
        },
        onError: {
          target: 'error',
          actions: assign({
            errorCode: (context, event) => event.data.code
          })
        }
      }
    },
    loggingInWithGoogle: {
      invoke: {
        src: (context, event) => {
          return GoogleSignin.signIn().then(user => {
            const cred = auth.GoogleAuthProvider.credential(user.idToken);
            return auth().signInWithCredential(cred);
          });
        },
        onDone: {
          target: 'loggedIn'
        },
        onError: [
          {
            target: 'idle',
            cond: (context, event) => event.data.code === statusCodes.SIGN_IN_CANCELLED
          },
          {
            target: 'playServicesMissing',
            cond: (context, event) => event.data.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
          }
        ]
      }
    },
    error: {
      on: {
        submit: {
          target: 'submitting',
          actions: assign<LoginContext>({
            errorCode: null
          })
        },
        loginWithGoogle: {
          target: 'loggingInWithGoogle'
        }
      }
    },
    playServicesMissing: {
      entry: () => {
        GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }
    },
    loggedIn: {
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
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/user-not-found':
      return 'No account for this email address.';
    case 'auth/user-disabled':
      return 'This user account is disabled.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return '';
  }
}

type Props = {
  navigation: NativeStackNavigationProp<any, 'Login'>;
};

export const Login = (props: Props) => {
  const [state, send] = useMachine(machine);

  return (
    <SafeAreaView style={tailwind('flex-1 bg-grey-800')}>
      <View style={tailwind('flex flex-col mt-10')}>
        <Text style={tailwind('text-indigo-500 text-3xl self-center')}>Matchflicks</Text>
        <View style={tailwind('mt-6 mx-10')}>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={schema}
            onSubmit={values => {
              send({ type: 'submit', payload: values });
            }}>
            {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
              <>
                <Text style={tailwind('text-grey-100 text-base')}>Email</Text>
                <TextInput
                  textContentType="username"
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
                  textStyle={tailwind('text-white')}
                  disabled={!isValid || state.matches('submitting')}>
                  Login
                </Button>
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Wide}
                  style={tailwind('w-full mt-2')}
                  onPress={() => {
                    send('loginWithGoogle');
                  }}
                />
              </>
            )}
          </Formik>
          <Text style={tailwind('mt-4 self-center text-white text-base')}>— or —</Text>
          <Text
            style={tailwind('self-center text-indigo-500 text-lg')}
            onPress={() => {
              props.navigation.push('Signup', {});
            }}>
            Signup
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
