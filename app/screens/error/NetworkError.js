import React from 'react';
import {Box, Image, Text} from 'native-base';

export const NetworkErrorScreen = () => {
  return (
    <Box
      bgColor={'white'}
      flex={1}
      safeArea
      alignItems={'center'}
      px={'6'}
      justifyContent={'center'}>
      <Image
        source={require('../../../assets/illustrations/network_issue.png')}
        alt={'maintenance'}
        size={'2xl'}
      />
      <Text fontSize={'xl'} fontWeight={'semibold'} my={'2'}>
        No Internet Connection!
      </Text>
      <Text fontSize={'md'} textAlign={'center'}>
        Please check you internet connection and try again
      </Text>
    </Box>
  );
};
