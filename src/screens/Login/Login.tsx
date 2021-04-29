import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Formik } from 'formik';
import React, { useEffect, useReducer } from 'react';
import { Image, Text, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import * as yup from 'yup';

import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { tailwind } from '../../tailwind';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required()
});

interface State {
  value: 'idle' | 'submitting' | 'error' | 'playServicesMissing';
  errorCode: null | string;
}

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

type Actions =
  | { type: 'startSubmit' }
  | { type: 'finishSubmit' }
  | { type: 'loginError'; errorCode: string | null }
  | { type: 'playServicesMissingError' }
  | { type: 'loginCancelled' };

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'startSubmit': {
      return {
        ...state,
        value: 'submitting'
      };
    }
    case 'finishSubmit': {
      return {
        ...state,
        value: 'idle'
      };
    }
    case 'loginError': {
      return {
        value: 'error',
        errorCode: action.errorCode
      };
    }
    case 'playServicesMissingError': {
      return {
        ...state,
        value: 'playServicesMissing'
      };
    }
    case 'loginCancelled': {
      return {
        ...state,
        value: 'idle'
      };
    }
    default:
      return state;
  }
}

export const Login = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    value: 'idle',
    errorCode: null
  });

  const logInWithEmail = (values: yup.TypeOf<typeof schema>) => {
    dispatch({ type: 'startSubmit' });
    return auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        dispatch({ type: 'finishSubmit' });
      })
      .catch(error => {
        dispatch({ type: 'loginError', errorCode: error.code });
      });
  };

  const logInWithApple = () => {
    return appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
      })
      .then(response => {
        if (response.identityToken === null) {
          throw new Error('Apple Sign-In failed - no identity token returned');
        }

        const { identityToken, nonce } = response;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        return auth().signInWithCredential(appleCredential);
      });
  };

  const logInWithGoogle = () => {
    return GoogleSignin.signIn()
      .then(user => {
        const cred = auth.GoogleAuthProvider.credential(user.idToken);
        return auth().signInWithCredential(cred);
      })
      .catch(error => {
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          dispatch({ type: 'playServicesMissingError' });
        } else if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          dispatch({ type: 'loginCancelled' });
        } else {
          dispatch({ type: 'loginError', errorCode: null });
        }
      });
  };

  useEffect(() => {
    if (state.value === 'playServicesMissing') {
      GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }
  }, [state.value]);

  return (
    <View style={tailwind('flex flex-col mt-10')}>
      <Text style={tailwind('text-indigo-500 text-3xl self-center')}>Matchflicks</Text>
      <View style={tailwind('mt-6 mx-10')}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={schema}
          validateOnMount
          onSubmit={logInWithEmail}>
          {({ handleSubmit, isValid }) => (
            <>
              <TextInput
                name="email"
                label="Email"
                textContentType="username"
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
                buttonStyle={[tailwind('bg-indigo-500 mt-2')]}
                textStyle={tailwind('text-grey-100')}
                disabled={!isValid || state.value === 'submitting'}>
                Login
              </Button>
              {appleAuth.isSupported ? (
                <AppleButton
                  buttonStyle={AppleButton.Style.WHITE}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={[tailwind('w-full mt-2'), { height: 48 }]}
                  cornerRadius={2}
                  onPress={logInWithApple}
                />
              ) : null}
              <Button onPress={logInWithGoogle} buttonStyle={tailwind('mt-2 bg-white w-full flex flex-row')}>
                <Image
                  source={require('../../images/g-logo.png')}
                  style={[tailwind('mr-2'), { height: 20, width: 20 }]}
                />
                <Text style={tailwind('font-semibold')}>Sign in with Google</Text>
              </Button>
            </>
          )}
        </Formik>
        <Text style={tailwind('mt-4 self-center text-grey-100 text-base')}>— or —</Text>
        <Text
          style={tailwind('self-center text-indigo-500 text-lg')}
          onPress={() => {
            props.navigation.push('Signup', {});
          }}>
          Signup
        </Text>
      </View>
    </View>
  );
};
