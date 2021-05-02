import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { useContext, useEffect, useMemo, useReducer } from 'react';

import { MovieGenre, WatchProvider } from '../types/tmdb';
import { useFirestoreDocument } from './useFirestoreDocument';

export interface UserSettings {
  favoriteGenres: Array<MovieGenre>;
  watchProviders: Array<WatchProvider>;
}

interface AuthenticationContextValue {
  initializing: boolean;
  user: FirebaseAuthTypes.User | null;
  userSettings: UserSettings | null;
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

type State = {
  initializing: boolean;
  user: FirebaseAuthTypes.User | null;
};

function reducer(state: State, action: Actions): State {
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

  const [userSettingsData] = useFirestoreDocument<UserSettings>('users', state.user?.uid);

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

  const value = useMemo(
    () => ({
      initializing: state.initializing,
      user: state.user,
      userSettings: userSettingsData
    }),
    [state, userSettingsData]
  );

  return <AuthenticationContext.Provider value={value}>{props.children}</AuthenticationContext.Provider>;
};
