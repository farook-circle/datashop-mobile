import {Box, Button, HStack} from 'native-base';
import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../config/dpTopx';

export default function HeaderBackButton({
  title,
  onBackButtonPress,
  rightComponent,
}) {
  return (
    <HStack alignItems={'center'} justifyContent={'space-between'}>
      <TouchableOpacity onPress={onBackButtonPress}>
        <Feather name="chevron-left" size={hp(30)} color={'black'} />
      </TouchableOpacity>
      <Box position={'absolute'} zIndex={-1} width={'100%'} alignItems={'center'}>
        <Text style={{fontFamily: 'Poppins-Regular'}}>{title}</Text>
      </Box>
      {rightComponent}
    </HStack>
  );
}
