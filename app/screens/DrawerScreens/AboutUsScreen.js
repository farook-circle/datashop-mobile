import {Box} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import {hp} from '../../config/dpTopx';

export default function AboutUsScreen({navigation, route}) {
  return (
    <Box flex={1} justifyContent={'center'} alignItems={'center'}>
      <Text style={{textAlign: 'center', fontFamily: 'Poppins-Regular', fontSize: hp(16)}}>
        Nothing to see here, You can blame that on Umar Farouk
      </Text>
    </Box>
  );
}
