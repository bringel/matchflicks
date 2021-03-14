import React, { useCallback, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { tailwind } from '../../tailwind';

type Props = {};

export const Signup = (props: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(() => {}, []);

  return (
    <SafeAreaView style={tailwind('flex-1 bg-grey-800')}>
      <View style={tailwind('mt-6 mx-10')}>
        <Text style={tailwind('text-grey-100 text-base')}>Email</Text>
        <TextInput
          textContentType="username"
          keyboardType="email-address"
          style={tailwind('w-full')}
          onChangeText={t => {
            setUsername(t);
          }}
        />
        <Text style={tailwind('text-grey-100 text-base')}>Password</Text>
        <TextInput
          textContentType="password"
          secureTextEntry
          style={tailwind('w-full')}
          onChangeText={t => {
            setPassword(t);
          }}
        />
        <Button onPress={handleSubmit} buttonStyle={tailwind('bg-indigo-500 mt-2')} textStyle={tailwind('text-white')}>
          Sign Up
        </Button>
      </View>
    </SafeAreaView>
  );
};
