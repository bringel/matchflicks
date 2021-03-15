import React from 'react';
import { GestureResponderEvent, Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import { tailwind } from '../tailwind';

interface Props {
  children: string | React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const Button = (props: Props) => {
  return (
    <Pressable
      style={[tailwind('flex justify-center items-center rounded-md  py-2 px-4'), props.buttonStyle]}
      onPress={props.onPress}>
      {typeof props.children === 'string' ? (
        <Text style={[tailwind('text-base'), props.textStyle]}>{props.children}</Text>
      ) : (
        props.children
      )}
    </Pressable>
  );
};
