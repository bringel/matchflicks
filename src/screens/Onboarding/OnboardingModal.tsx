import React from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { getColor } from '../../tailwind';
import { Genres } from './Genres';

const Stack = createNativeStackNavigator();

type Props = {};

export const OnboardingModal = (props: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Genres}
        name="Genres"
        options={({ navigation }) => {
          return {
            title: '',
            headerLeft: () => (
              <Button
                title="Skip"
                onPress={() => {
                  navigation.navigate('Main');
                }}
                color={getColor('indigo-500')}
              />
            ),
            headerRight: () => <Button title="Next" onPress={() => {}} color={getColor('indigo-500')} />
          };
        }}
      />
    </Stack.Navigator>
  );
};
