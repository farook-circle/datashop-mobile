import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../assets/colors/colors';
import {hp, wp} from '../config/dpTopx';
import {deleteVirtualAccount} from '../redux/actions/wallet';

export default function AccountNumber({details}) {
  useEffect(() => {});
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const account = useSelector(state => state.wallet.account);
  const createNewVirtualAccount = () => {
    dispatch(deleteVirtualAccount());
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
      <Text style={styles.accountNumber}>
        Account: {account.account_number}
      </Text>
      <Text style={styles.amount}>
        Amount: {account.amount} {'\u20A6'}
      </Text>
      <Text style={styles.expire}>
        {' '}
        This is a Virtual Account, and will expire expire after 1 hour.
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
    fontSize: 16,
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  fullName: {
    color: colors.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    paddingHorizontal: 25,
  },
  bankName: {
    color: colors.primary,

    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    paddingHorizontal: 25,
  },
  accountNumber: {
    color: colors.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    paddingHorizontal: 25,
  },
  amount: {
    color: colors.primary,

    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    paddingHorizontal: 25,
  },
  expire: {
    color: colors.secondary,
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    paddingHorizontal: 25,
  },
  footerNote: {
    marginTop: 20,
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: 'red',
    paddingHorizontal: 25,
  },
  shareReceiptButton: {
    marginTop: 20,
    width: 370,
    height: 50,
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
    fontSize: 18,
  },
});
