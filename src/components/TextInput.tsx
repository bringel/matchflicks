import React from 'react';
import { TextInput as NativeTextInput, StyleProp, Text, TextInputProps, TextStyle } from 'react-native';

import { tailwind } from '../tailwind';

interface Props extends TextInputProps {
  label: string;
  style?: StyleProp<TextStyle>;
}

export const TextInput = (props: Props) => {
  const { label, style, ...rest } = props;
  return (
    <>
      <Text style={tailwind('text-grey-100 text-sm')}>{label}</Text>
      <NativeTextInput
        {...rest}
        style={[tailwind('border-b border-grey-100 bg-grey-700 mt-1 mb-2 text-base text-grey-100 p-1'), style]}
      />
    </>
  );
};
