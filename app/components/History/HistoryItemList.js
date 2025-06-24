/* eslint-disable react-native/no-inline-styles */
import {Avatar, Button, HStack, useTheme} from 'native-base';
import React from 'react';
import {Text, StyleSheet, Image, TouchableOpacity, View} from 'react-native';
import colors from '../../../assets/colors/colors';
import {hp} from '../../config/dpTopx';
import Feather from 'react-native-vector-icons/Feather';
import {formatCurrency} from '../../utils';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment-timezone';

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
  const color = useTheme().colors;

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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#f2f2f2',
          marginHorizontal: hp(10),
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: hp(10),
          padding: hp(10),
        }}>
        {item?.image ? (
          <Image
            source={{uri: item?.image || undefined}}
            style={{
              width: hp(40),
              height: hp(40),
              backgroundColor: 'blue',
              borderRadius: hp(20),
            }}
            resizeMode="cover"
            defaultSource={require('../../../assets/images/logo_new.png')}
          />
        ) : (
          <Image
            source={require('../../../assets/images/logo_new.png')}
            style={{
              width: hp(40),
              height: hp(40),
              backgroundColor: 'blue',
              borderRadius: hp(20),
            }}
            resizeMode="cover"
          />
        )}

        <View style={{flex: 1, marginHorizontal: hp(7)}}>
          <Text style={styles.nameStyle}>
            {'DATA'} | {item.quantity}
          </Text>
          <Text style={styles.amountStyle}>{item?.customer}</Text>
        </View>

        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.amountStyle}>
            {moment(new Date()).calendar()}
          </Text>

          <HStack alignItems={'center'} space={'2'}>
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
            {item?.status.toLowerCase() === 'pending' && (
              <Button
                variant={'outline'}
                px={'2'}
                py={0.4}
                size={'xs'}
                leftIcon={
                  <Feather name="x" color={color.red[500]} size={10} />
                }>
                Cancel
              </Button>
            )}
            {item?.status.toLowerCase() === 'failed' && (
              <Button
                variant={'outline'}
                px={'2'}
                py={0.4}
                size={'xs'}
                leftIcon={
                  <Feather name="arrow-up" color={color.red[500]} size={10} />
                }>
                Retry
              </Button>
            )}
          </HStack>
        </View>
      </View>
    </TouchableOpacity>
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
