import 'react-native-gesture-handler';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView, StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { AuthenticationContextProvider, useAuthenticationContext } from './firebase/AuthenticationContext';
import { Login } from './screens/Login/Login';
import { OnboardingModal } from './screens/Onboarding/OnboardingModal';
import { Signup } from './screens/Signup/Signup';
import { UserTab } from './screens/UserTab/UserTab';
import { getColor, tailwind } from './tailwind';

enableScreens();

GoogleSignin.configure({
  webClientId: '479366644790-a4463vom1bpe4onn6kq6qop4avofruc8.apps.googleusercontent.com'
});

const navigationTheme = {
  dark: true,
  colors: {
    primary: getColor('indigo-500'),
    background: getColor('grey-800'),
    card: getColor('grey-800'),
    text: getColor('indigo-500'),
    border: getColor('indigo-900'),
    notification: getColor('indigo-500')
  }
};

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
            headerTitle: 'Sign Up'
          }}
        />
      </UnauthenticatedStack.Navigator>
    </>
  );
};

const RootStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const MainTabs = (props: { navigation: StackNavigationProp<any, 'Main'> }) => {
  // const authContext = useAuthenticationContext();
  // if (authContext.userSettings === null) {
  //   props.navigation.push('Onboarding');
  // }

  // return (
  //   <Tabs.Navigator>
  //     <Tabs.Screen name="User" component={View} />
  //   </Tabs.Navigator>
  // );
  return <View />;
};

const AuthenticatedApp = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <RootStack.Navigator mode="modal">
        <RootStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <RootStack.Screen
          name="Onboarding"
          component={OnboardingModal}
          options={{ headerLeft: () => null, title: '' }}
        />
      </RootStack.Navigator>
    </>
  );
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
    <NavigationContainer theme={navigationTheme}>
      <AuthenticationContextProvider>
        <App />
      </AuthenticationContextProvider>
    </NavigationContainer>
  );
};

export default WrappedApp;
