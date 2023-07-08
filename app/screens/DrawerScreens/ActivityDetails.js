import {Box} from 'native-base';
import React from 'react';
import {Text, Dimensions} from 'react-native';
import {hp, wp} from '../../config/dpTopx';

import HeaderBackButton from '../../components/HeaderBackButton';

export default function ActivityDetails({navigation, route}) {
  return (
    <Box flex={1} safeArea px={'4'} pt={'4'}>
      <HeaderBackButton
        title={'Activity overview'}
        onBackButtonPress={() => navigation.goBack()}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: hp(16),
          marginTop: hp(10)
        }}>
        Not enough data to generate your activity
      </Text>
    </Box>
  );
}
