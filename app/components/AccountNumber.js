import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../assets/colors/colors';
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
        Please Make Bank Transfer to this Account Your wallet will automatically
        get funded when the transaction is completed
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
        Please know this Account Will Expire in 1 hour
      </Text>
      <Text style={styles.footerNote}>
        Please Make sure you send the exact amount and know that processing fee
        will be applied.
      </Text>
      {/* <TouchableOpacity style={styles.shareReceiptButton}>
        <Text style={styles.shareReceiptText}>VERIFY DEPOSIT</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.shareReceiptButton}
        onPress={createNewVirtualAccount}>
        <Text style={styles.shareReceiptText}>CREATE NEW DEPOSIT</Text>
      </TouchableOpacity>
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
    fontFamily: 'Poppins-light',
    fontSize: 16,
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
