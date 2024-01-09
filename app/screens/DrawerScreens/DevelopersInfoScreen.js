import {Box, HStack, IconButton, Text} from 'native-base';
import React from 'react';
import {MainLayout} from '../../components';
import {hp} from '../../config/dpTopx';
import Feather from 'react-native-vector-icons/Feather';

export const DevelopersInfoScreen = ({navigation, route}) => {
  return (
    <Box safeArea bgColor={'primary.500'} flex={1} px={'4'}>
      <HStack>
        <IconButton
          onPress={() => navigation.goBack()}
          icon={<Feather size={25} color={'white'} name={'chevron-left'} />}
        />
      </HStack>
      <Box flex={1} justifyContent={'center'} bgColor={'primary.500'}>
        <Text
          selectable={true}
          style={{
            paddingHorizontal: 20,
            fontFamily: 'Poppins-Regular',
            fontSize: hp(16),
            color: 'white',
          }}>
          Developed by Farook Circle
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
    </Box>
  );
};
