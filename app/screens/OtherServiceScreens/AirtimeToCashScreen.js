import {Box, Button} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import { hp } from '../../config/dpTopx';

export default function AirtimeToCashScreen({navigation}) {
  return (
    <Box flex={1} safeArea justifyContent={'center'} alignItems={'center'} p={'4'}>
      <Text style={{textAlign: 'center', fontFamily: 'Poppins-Regular', color: 'black', fontSize: hp(14)}}>
        Service coming soon. However, you can always contact our customer care
        to convert your airtime to cash manually.
      </Text>
      <Button mt={'4'} onPress={() => navigation.goBack()} >go back</Button>
    </Box>
  );
}
