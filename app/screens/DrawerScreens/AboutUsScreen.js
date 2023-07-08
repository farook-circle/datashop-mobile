import {Box} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import {hp} from '../../config/dpTopx';

export default function AboutUsScreen({navigation, route}) {
  return (
    <Box flex={1} justifyContent={'center'} alignItems={'center'}>
      <Text style={{textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: hp(16)}}>
        Information not available at the moment
      </Text>
    </Box>
  );
}
