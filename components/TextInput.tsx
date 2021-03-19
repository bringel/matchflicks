import React from 'react';
import { TextInput as NativeTextInput, StyleProp, TextInputProps, TextStyle } from 'react-native';

import { tailwind } from '../tailwind';

interface Props extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

export const TextInput = (props: Props) => {
  const { style, ...rest } = props;
  return (
    <NativeTextInput
      {...rest}
      style={[tailwind('border rounded-sm border-grey-100 mb-2 text-base text-grey-100 p-1'), style]}
    />
  );
};
