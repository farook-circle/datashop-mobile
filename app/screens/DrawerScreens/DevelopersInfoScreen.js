import {Box} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import {hp} from '../../config/dpTopx';

export const DevelopersInfoScreen = ({navigation, route}) => {
  return (
    <Box flex={1} justifyContent={'center'} bgColor={'primary.500'}>
      <Text
        selectable={true}
        style={{
          paddingHorizontal: 20,
          fontFamily: 'Poppins-Regular',
          fontSize: hp(16),
          color: 'white',
        }}>
        Developed by FarookCircle
      </Text>
      <Text
        selectable={true}
        style={{
          paddingHorizontal: 20,
          fontFamily: 'Poppins-Regular',
          fontSize: hp(16),
          color: 'white',
        }}>
        6, Shamaki Street, Tudun Wada, Gombe, Nigeria Email:
        support@farookcircle.com
      </Text>
    </Box>
  );
};
