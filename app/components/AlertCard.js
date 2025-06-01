import {Avatar, Box, HStack, Pressable, VStack} from 'native-base';
import {StyleSheet, Text} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../config/dpTopx';
import moment from 'moment-timezone';

export default function AlertCard({
  title,
  body,
  priority,
  updatedAt,
  createdAt,
  onRemove,
  onExpand,
}) {
  return (
    <Pressable onPress={onExpand}>
      <VStack
        bgColor={
          priority === 'medium'
            ? 'yellow.500'
            : priority === 'low'
            ? 'green.500'
            : 'black'
        }
        p={'6'}
        space={'4'}
        rounded={'xl'}
        my={2}>
        <HStack justifyContent={'space-between'}>
          <HStack space={'2'} alignItems={'center'}>
            <Avatar size={'sm'}>
              <Feather name="user" size={hp(20)} />
            </Avatar>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: hp(16),
                color: 'white',
              }}>
              {title}
            </Text>
          </HStack>
          <Pressable>
            <Feather name={'x-circle'} color={'blue'} size={hp(25)} />
          </Pressable>
        </HStack>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: hp(14),
            color: 'white',
          }}>
          {body}
        </Text>
        <Text style={{color: 'white', fontFamily: 'Poppins-Medium', fontSize: hp(12)}}>
          {moment(updatedAt || createdAt)
            .tz('Africa/Nairobi')
            .format('DD MMM YYYY, h:mm A')}
        </Text>
      </VStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Poppins-Medium',
  },
});
