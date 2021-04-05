import classnames from 'classnames';
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
      style={({ pressed }) => [
        tailwind('flex justify-center items-center rounded-sm py-3 px-4 border-black border-opacity-25'),
        props.buttonStyle,
        tailwind(
          classnames({
            'bg-grey-500': props.disabled,
            'border-b-4': props.disabled || !pressed,
            'mt-3': !props.disabled && pressed
          })
        )
      ]}
      onPress={props.disabled ? undefined : props.onPress}>
      {typeof props.children === 'string' ? (
        <Text
          style={[
            tailwind('text-base font-semibold'),
            props.textStyle,
            tailwind(classnames({ 'text-grey-300': props.disabled }))
          ]}>
          {props.children}
        </Text>
      ) : (
        props.children
      )}
    </Pressable>
  );
};
