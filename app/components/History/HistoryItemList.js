/* eslint-disable react-native/no-inline-styles */
import {Avatar, Badge, Box, HStack, Pressable, VStack} from 'native-base';
import React from 'react';
import {Text, StyleSheet} from 'react-native';
import colors from '../../../assets/colors/colors';
import {hp} from '../../config/dpTopx';
import Feather from 'react-native-vector-icons/Feather';
import {formatCurrency} from '../../utils';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TRANSACTIONS = {
  DATA_PURCHASE: 'DATA_PURCHASE',
  AIRTIME_PURCHASE: 'AIRTIME_PURCHASE',
  ELECTRICITY_PURCHASE: 'ELECTRICITY_PURCHASE',
  CABLE_PURCHASE: 'CABLE_PURCHASE',
  WALLET_TRANSFER: 'WALLET_TRANSFER',
  EXAM_PURCHASE: 'EXAM_PURCHASE',
  AUTOMATED_FUNDING: 'AUTOMATED_FUNDING',
  MANUAL_DEPOSIT: 'MANUAL_DEPOSIT',
};

export default function HistoryItemList({item, onPress}) {
  const getType = transaction_type => {
    if (!transaction_type) {
      return '';
    }

    return transaction_type.split('_')[0];
  };

  const getDefaultIcon = transaction_type => {
    switch (transaction_type) {
      case TRANSACTIONS.AUTOMATED_FUNDING:
        return (
          <MaterialCommunityIcons
            name={'bank-transfer'}
            color={'white'}
            size={hp(25)}
          />
        );
      case TRANSACTIONS.AIRTIME_PURCHASE:
        return <Feather name={'smartphone'} color={'white'} size={hp(25)} />;
      case TRANSACTIONS.DATA_PURCHASE:
        return <Feather name={'globe'} color={'white'} size={hp(25)} />;
      default:
        return <Feather name="box" color={'white'} size={hp(25)} />;
    }
  };

  return (
    <Pressable onPress={onPress}>
      {({isPressed, isHovered, isFocused}) => (
        <HStack
          mx={'4'}
          rounded={'lg'}
          bgColor={'gray.50'}
          borderWidth={1}
          borderColor={'black'}
          space={'2'}
          alignItems={'center'}
          justifyContent={'space-between'}
          p={'2'}>
          <Avatar
            size={hp(40)}
            bgColor={'primary.500'}
            source={{uri: item?.image}}>
            {getDefaultIcon(item?.transaction_type)}
          </Avatar>
          <VStack flex={1} space={1}>
            <Text style={styles.nameStyle}>{item?.name}</Text>
            <Text style={styles.type}>{getType(item?.transaction_type)}</Text>
          </VStack>
          <VStack alignItems={'flex-end'} space={1}>
            <Text style={styles.amountStyle}>
              {formatCurrency(item.amount)}
            </Text>
            <Text
              style={{
                color:
                  item.status.toLowerCase() === 'pending'
                    ? 'orange'
                    : item.status.toLowerCase() === 'failed'
                    ? 'red'
                    : 'green',
                fontSize: hp(10),
              }}>
              {item.status.toUpperCase()}
            </Text>
          </VStack>
        </HStack>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nameStyle: {
    fontSize: hp(14),
    fontFamily: 'Poppins-Semibold',
    color: 'black',
  },
  timeStyle: {
    fontFamily: 'Poppins-Regular',
    color: colors.textLight,
  },
  type: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(12),
    color: colors.textBlack,
  },
  amountStyle: {
    fontFamily: 'Poppins-Semibold',
    color: 'black',
    fontSize: hp(14),
  },
});
