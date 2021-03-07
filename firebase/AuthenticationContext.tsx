import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { useContext, useEffect, useReducer } from 'react';

interface AuthenticationContextValue {
  initializing: boolean;

  user: FirebaseAuthTypes.User | null;
}

export const AuthenticationContext = React.createContext<AuthenticationContextValue | null>(null);

export const useAuthenticationContext = () => {
  const value = useContext(AuthenticationContext);

  if (value === null) {
    throw new Error('useAuthenticationContext must be called within an <AuthenticationContext.Provider>');
  }

  return value;
};

type LoggedInAction = {
  type: 'loggedIn';
  user: FirebaseAuthTypes.User;
};

type LoggedOutAction = {
  type: 'loggedOut';
};

type Actions = LoggedInAction | LoggedOutAction;

function reducer(state: AuthenticationContextValue, action: Actions): AuthenticationContextValue {
  switch (action.type) {
    case 'loggedIn': {
      return {
        initializing: false,
        user: action.user
      };
    }
    case 'loggedOut': {
      return {
        initializing: false,
        user: null
      };
    }
    default:
      return state;
  }
}

type Props = {
  children: React.ReactNode;
};

export const AuthenticationContextProvider = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    initializing: true,
    user: null
  });

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user !== null) {
        dispatch({ type: 'loggedIn', user: user });
      } else {
        dispatch({ type: 'loggedOut' });
      }
    });

    return unsubscribe;
  }, []);

  return <AuthenticationContext.Provider value={state}>{props.children}</AuthenticationContext.Provider>;
};
