import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../assets/colors/colors';
import {hp, wp} from '../config/dpTopx';
import {deleteVirtualAccount} from '../redux/actions/wallet';
import Clipboard from '@react-native-clipboard/clipboard';

export default function AccountNumber({details}) {
  useEffect(() => {});
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const account = useSelector(state => state.wallet.account);
  const createNewVirtualAccount = () => {
    dispatch(deleteVirtualAccount());
  };

  const copyToClipboard = () => {
    Clipboard.setString(account.account_number);
    alert('Copied');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.noteTitleText}>
        Make A transfer to the account below. your wallet will be credited
        instantly.
      </Text>
      <Text style={styles.fullName}>
        Name: {user.first_name} {user.last_name}
      </Text>
      <Text style={styles.bankName}>Bank: {account.bank_name}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // backgroundColor: 'red',
        }}>
        <Text style={[styles.accountNumber, {margin: 0}]}>Account: </Text>
        <TouchableOpacity onPress={copyToClipboard}>
          <Text
            style={{
              color: colors.primary,
              fontFamily: 'Poppins-Bold',
              fontSize: hp(18),
            }}>
            {account.account_number}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={copyToClipboard}>
          <Text style={{marginLeft: 20, alignItems: 'center'}}>
            {' '}
            <Feather name="arrow-left" size={20} color={'red'} /> Click to copy
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.amount}>
        Amount: {account.amount} {'\u20A6'}
      </Text>
      <Text style={styles.expire}>
        {' '}
        This is a Virtual Account and will expire after 1 hour.
      </Text>
      <Text style={styles.footerNote}>
        NOTE: You are required to send the EXACT amount.
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins-Bold',
          paddingHorizontal: 25,
          marginTop: hp(10),
          fontSize: hp(17),
          color: 'green',
        }}>
        {'\u20A6'}50 charges applied
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  noteTitleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    paddingHorizontal: 25,
    marginBottom: hp(10),
  },
  fullName: {
    color: colors.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(18),
    paddingHorizontal: 25,
  },
  bankName: {
    color: colors.primary,

    fontFamily: 'Poppins-Bold',
    fontSize: hp(18),
    paddingHorizontal: 25,
  },
  accountNumber: {
    color: colors.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(18),
    paddingLeft: 25,
  },
  amount: {
    color: colors.primary,

    fontFamily: 'Poppins-Bold',
    fontSize: hp(18),
    paddingHorizontal: 25,
  },
  expire: {
    color: colors.secondary,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(18),
    paddingHorizontal: 25,
  },
  footerNote: {
    marginTop: hp(20),
    fontFamily: 'Poppins-Bold',
    fontSize: hp(18),
    color: 'red',
    paddingHorizontal: 25,
  },
  shareReceiptButton: {
    marginTop: hp(20),
    width: wp(370),
    height: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  shareReceiptText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: colors.textWhite,
    fontSize: hp(18),
  },
});
