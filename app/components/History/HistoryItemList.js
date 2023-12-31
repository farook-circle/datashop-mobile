/* eslint-disable react-native/no-inline-styles */
import {Avatar, Badge, Box, HStack, Pressable, VStack} from 'native-base';
import React from 'react';
import {Text, StyleSheet} from 'react-native';
import colors from '../../../assets/colors/colors';
import {hp} from '../../config/dpTopx';
import Feather from 'react-native-vector-icons/Feather';

export default function HistoryItemList({
  avatar,
  name,
  time,
  amount,
  status,
  onPress,
}) {
  return (
    <Pressable onPress={onPress}>
      {({isPressed, isHovered, isFocused}) => (
        <HStack
          px={'4'}
          bgColor={isPressed ? 'gray.200' : 'transparent'}
          space={'2'}
          alignItems={'center'}
          justifyContent={'space-between'}
          p={'2'}>
          <Avatar bgColor={'primary.500'} size={'sm'} source={{uri: avatar}}>
            <Feather name="box" color={'white'} size={hp(20)} />
          </Avatar>
          <VStack flex={1}>
            <Text style={styles.nameStyle}>{name}</Text>
            <Text>{time}</Text>
          </VStack>
          <VStack alignItems={'flex-end'}>
            <Text style={styles.amountStyle}>{amount}</Text>
            <Text
              style={{
                color:
                  status.toLowerCase() === 'pending'
                    ? 'orange'
                    : status.toLowerCase() === 'failed'
                    ? 'red'
                    : 'green',
                fontSize: hp(12),
              }}>
              {status.toUpperCase()}
            </Text>
          </VStack>
        </HStack>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nameStyle: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
  },
  timeStyle: {
    fontFamily: 'Poppins-Regular',
    color: colors.textLight,
  },
  amountStyle: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
  },
});
