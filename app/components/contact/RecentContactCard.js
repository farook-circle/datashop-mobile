/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {HStack, Avatar, VStack, Pressable} from 'native-base';
import {hp, wp} from '../../config/dpTopx';

export default function RecentContactCard({contact, onRecentClick}) {
  return (
    <Pressable onPress={() => onRecentClick(contact.recipient_number)}>
      <VStack
        borderWidth={1}
        padding={2}
        alignItems={'center'}
        space={'2'}
        borderColor={'gray.300'}
        width={wp(100)}
        height={hp(100)}
        margin={hp(3)}
        rounded={'lg'}>
        <Avatar
          size={'md'}
          bgColor={'white'}
          source={{
            uri: contact.brand_logo,
          }}
        />

        <Text
          style={{
            fontSize: hp(10),
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
          }}>
          {contact.name || contact.recipient_number}
        </Text>
      </VStack>
    </Pressable>
  );
}
