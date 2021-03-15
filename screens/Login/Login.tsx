import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { tailwind } from '../../tailwind';

type Props = {
  navigation: NativeStackNavigationProp<any, 'Login'>;
};

export const Login = (props: Props) => {
  return (
    <SafeAreaView style={tailwind('flex-1 bg-grey-800')}>
      <View style={tailwind('flex flex-col mt-10')}>
        <Text style={tailwind('text-indigo-500 text-3xl self-center')}>Matchflicks</Text>
        <View style={tailwind('mt-6 mx-10')}>
          <Text style={tailwind('text-grey-100 text-base')}>Email</Text>
          <TextInput textContentType="username" keyboardType="email-address" style={tailwind('w-full')} />
          <Text style={tailwind('text-grey-100 text-base')}>Password</Text>
          <TextInput textContentType="password" secureTextEntry style={tailwind('w-full')} />
          <Button onPress={() => {}} buttonStyle={tailwind('bg-indigo-500 mt-2')} textStyle={tailwind('text-white')}>
            Login
          </Button>
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
