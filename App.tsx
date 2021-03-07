import React from 'react';
import { StatusBar } from 'react-native';
import { Login } from './screens/Login/Login';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Login />
    </>
  );
};

export default App;
