import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { tailwind } from '../../tailwind';

type Props = {};

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
          <Button onPress={() => {}} buttonStyle={tailwind('bg-indigo-500')} textStyle={tailwind('text-white')}>
            Login
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
