import {Box} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import { hp } from '../../config/dpTopx';

export default function TalkToUsScreen({navigation, route}) {
  return (
    <Box flex={1} justifyContent={'center'} alignItems={'center'}>
    <Text style={{fontFamily: 'Poppins-Regular', fontSize: hp(16)}}>
      Communication channel will be here soon just hang on
    </Text>
  </Box>
  );
}
