import { useField } from 'formik';
import React from 'react';
import { TextInput as NativeTextInput, StyleProp, Text, TextInputProps, TextStyle } from 'react-native';

import { tailwind } from '../tailwind';

interface Props extends TextInputProps {
  name: string;
  label: string;
  style?: StyleProp<TextStyle>;
}

export const TextInput = (props: Props) => {
  const { name, label, style, ...rest } = props;

  const [field, meta] = useField(name);

  return (
    <>
      <Text style={tailwind('text-grey-100 text-sm')}>{label}</Text>
      <NativeTextInput
        onChangeText={field.onChange(name)}
        onBlur={field.onBlur(name)}
        value={field.value}
        {...rest}
        style={[tailwind('border-b border-grey-100 bg-grey-700 mt-1 mb-2 text-base text-grey-100 p-1'), style]}
      />
    </>
  );
};
