/* eslint-disable react-native/no-inline-styles */
import {Box} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import {hp} from '../../config/dpTopx';

export const AboutUsScreen = ({navigation, route}) => {
  return (
    <Box
      flex={1}
      justifyContent={'center'}
      bgColor={'primary.500'}
      alignItems={'center'}>
      <Text
        selectable={true}
        style={{
          paddingHorizontal: 20,
          fontFamily: 'Poppins-Regular',
          fontSize: hp(16),
          color: 'white',
        }}>
        DATASHOP is a digital VTU Platform owned and managed by FarookCircle.
        Contact us to learn more
      </Text>
    </Box>
  );
};
