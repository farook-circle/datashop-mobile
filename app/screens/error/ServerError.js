import React from 'react';
import {Box, Image, Text} from 'native-base';

export const ServerErrorScreen = () => {
  return (
    <Box
      bgColor={'white'}
      flex={1}
      safeArea
      alignItems={'center'}
      px={'6'}
      justifyContent={'center'}>
      <Image
        source={require('../../../assets/illustrations/under_maintenance.png')}
        alt={'maintenance'}
        size={'2xl'}
      />
      <Text fontSize={'xl'} fontWeight={'semibold'} my={'2'}>
        Sorry! it's not you. It's us
      </Text>
      <Text fontSize={'md'} textAlign={'center'}>
        We are experiencing an internal server problem. Don't panic we are
        working on it
      </Text>
    </Box>
  );
};
