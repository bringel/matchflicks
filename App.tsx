import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { AuthenticationContextProvider, useAuthenticationContext } from './firebase/AuthenticationContext';
import { Login } from './screens/Login/Login';
import { Signup } from './screens/Login/Signup';
import { getColor, tailwind } from './tailwind';

enableScreens();

const UnauthenticatedStack = createNativeStackNavigator();

const UnauthenticatedApp = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <UnauthenticatedStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <UnauthenticatedStack.Screen name="Login" component={Login} />
        <UnauthenticatedStack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: true,
            headerTitle: 'Sign Up',
            headerStyle: { backgroundColor: getColor('grey-800') },
            headerTintColor: getColor('indigo-500'),
            headerTitleStyle: { color: getColor('indigo-500') }
          }}
        />
      </UnauthenticatedStack.Navigator>
    </>
  );
};

const AuthenticatedApp = () => {
  return null;
};

const App = () => {
  const authContext = useAuthenticationContext();

  return authContext.initializing ? (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={tailwind('flex-1 bg-grey-800')} />
    </>
  ) : authContext.user === null ? (
    <UnauthenticatedApp />
  ) : (
    <AuthenticatedApp />
  );
};

const WrappedApp = () => {
  return (
    <NavigationContainer>
      <AuthenticationContextProvider>
        <App />
      </AuthenticationContextProvider>
    </NavigationContainer>
  );
};

export default WrappedApp;
