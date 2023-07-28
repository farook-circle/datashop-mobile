import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IconButton, HStack, Box} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../config/dpTopx';

export default function Header({onBackButtonPress, title}) {
  return (
    <HStack alignItems={'center'}>
      <IconButton
        icon={<Feather name={'arrow-left'} size={hp(25)} color={'black'} />}
        rounded={'full'}
        onPress={onBackButtonPress}
      />

      <Box
        position={'absolute'}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'center'}>
        <Text style={styles.headerTitle}>{title}</Text>
      </Box>
    </HStack>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(18),
  },
});
