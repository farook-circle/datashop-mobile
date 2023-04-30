import {Box} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import { hp } from '../../config/dpTopx';

export default function DevelopersInfoScreen({navigation, route}) {
  return (
    <Box flex={1} justifyContent={'center'} alignItems={'center'}>
      <Text style={{fontFamily: 'Poppins-Regular', fontSize: hp(16)}}>
        I will ask the dev guyz their names when they wake up from sleep come back later
      </Text>
    </Box>
  );
}
