import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { AuthenticationContextProvider, useAuthenticationContext } from './firebase/AuthenticationContext';
import { Login } from './screens/Login/Login';
import { tailwind } from './tailwind';

const UnauthenticatedApp = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Login />
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
    <AuthenticationContextProvider>
      <App />
    </AuthenticationContextProvider>
  );
};

export default WrappedApp;
