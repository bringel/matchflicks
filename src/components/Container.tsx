import React from 'react';
import { SafeAreaView } from 'react-native';

import { tailwind } from '../tailwind';

type Props = {
  children: React.ReactNode;
};

export const Container = (props: Props) => {
  return <SafeAreaView style={tailwind('flex-1 bg-grey-800')}>{props.children}</SafeAreaView>;
};
