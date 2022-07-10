/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
  Vibration,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import EncryptedStorage from 'react-native-encrypted-storage';

import {hp, wp} from '../config/dpTopx';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  createVirtualAccount,
  depositMoneyToWallet,
  getVirtualAccount,
  getWalletBalance,
} from '../redux/actions/wallet';
import CompleteCardPayment from '../components/CompleteCardPayment';
import AccountNumber from '../components/AccountNumber';
import MomoAgent from '../components/MomoAgent';
import AlternatePayment from '../components/AlternatePayment';
import AirtimePaymentFunding from '../components/AirtimePaymentFunding';
import OverLayModel from '../components/OverLayModel';
import {StackActions} from '@react-navigation/native';
import {USER_LOGOUT} from '../redux/constants/auth';

export default function AddTypePin({navigation}) {
  useEffect(() => {}, []);

  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [init, setInit] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [wrongPin, setWrongPin] = useState(false);

  const payment_status = useSelector(state => state.wallet.payment_status);

  useEffect(() => {
    setLoading(true);
    getUserPin();
  }, []);

  useEffect(() => {
    if (amount.length === 4 && pin.length < 1) {
      handleCreatePin();
    }
    if (amount.length === 4 && pin.length > 1) {
      setLoading(true);
      authenticatePin();
    }
  }, [amount]);

  async function removeUserToken() {
    try {
      await EncryptedStorage.removeItem('user_session');
      await EncryptedStorage.removeItem('userPin');
      // Congrats! You've just removed your first value!
    } catch (error) {
      // There was an error on the native side
    }

    dispatch({type: USER_LOGOUT});
  }

  async function getUserPin() {
    try {
      const userPin = await EncryptedStorage.getItem('userPin');
      if (userPin !== null) {
        setPin(userPin);
        setLoading(false);
      }
      // retrieve a pin user saved pin
    } catch (error) {
      // There was an error on the native side
      setLoading(false);
    }

    setLoading(false);
  }

  async function setUserPin(value) {
    try {
      await EncryptedStorage.setItem('userPin', value);
      setPin(value);
      return true;
      // retrieve a pin user saved pin
    } catch (error) {
      return false;
      // There was an error on the native side
    }
  }

  const handleLogout = () => {
    Alert.alert('Alert', 'Are you sure you want to log-out', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => removeUserToken()},
    ]);
  };

  const handleForgotPin = () => {
    Alert.alert(
      'Alert',
      "forgot your PIN? Don't worry after you log-out you pin will be reset note that you have to use your password",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Log-out', onPress: () => removeUserToken()},
      ],
    );
  };

  const handleCreatePin = async () => {
    const result = await setUserPin(amount);
    if (result) {
      setLoading(false);
      Alert.alert('Success', `You have successfully set ${amount} as your PIN`, [
        {
          text: 'OK',
          onPress: () => navigation.dispatch(StackActions.replace('Home')),
        },
      ]);
    }
  };

  const authenticatePin = async () => {
    await getUserPin();
    if (amount === pin) {
      setLoading(false);
      navigation.dispatch(StackActions.replace('Home'));
      return;
    }

    Vibration.vibrate(200);
    setAmount('');
    setWrongPin(true);
    setLoading(false);
  };

  const handleNumericInput = value => {
    if (amount.length === 4) {
      return;
    }
    if (amount === 0) {
      setAmount(value);

      return;
    }
    const newAmount = amount + value;
    setAmount(newAmount);
  };

  const handleDeletButton = () => {
    if (amount.length === 1) {
      setAmount('');
      return;
    }
    const newAmount = amount.slice(0, amount.length - 1);
    setAmount(newAmount);
  };

  return (
    <View style={styles.container}>
      <>
        {isLoading && (
          <OverLayModel>
            <ActivityIndicator color={colors.textWhite} size={'large'} />
          </OverLayModel>
        )}
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
            fontSize: hp(16),
            marginTop: hp(280),
            marginBottom: hp(20),
          }}>
          {pin !== '' ? 'Enter your PIN' : 'Create your PIN'}
        </Text>
        <View style={styles.textInputWrapper}>
          <View
            style={[
              styles.dotInput,
              amount.length >= 1 && {backgroundColor: colors.primary},
            ]}
          />
          <View
            style={[
              styles.dotInput,
              amount.length >= 2 && {backgroundColor: colors.primary},
            ]}
          />
          <View
            style={[
              styles.dotInput,
              amount.length >= 3 && {backgroundColor: colors.primary},
            ]}
          />
          <View
            style={[
              styles.dotInput,
              amount.length >= 4 && {backgroundColor: colors.primary},
            ]}
          />
        </View>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
            fontSize: hp(14),
            color: 'red',
            marginTop: hp(10),
            marginBottom: hp(50),
          }}>
          {wrongPin ? 'Incorrect Pin please try again' : ''}
        </Text>

        <View style={styles.numericInputWrapper}>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('1')}>
            <Text style={styles.numberText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('2')}>
            <Text style={styles.numberText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('3')}>
            <Text style={styles.numberText}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numericInputWrapper}>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('4')}>
            <Text style={styles.numberText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('5')}>
            <Text style={styles.numberText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('6')}>
            <Text style={styles.numberText}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numericInputWrapper}>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('7')}>
            <Text style={styles.numberText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('8')}>
            <Text style={styles.numberText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('9')}>
            <Text style={styles.numberText}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numericInputWrapper}>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={handleLogout}>
            <Feather name="log-out" size={30} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => handleNumericInput('0')}>
            <Text style={styles.numberText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={handleDeletButton}>
            <Feather name="delete" size={hp(30)} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.shareReceiptButton]}
          onPress={() => handleForgotPin()}>
          <Text style={styles.shareReceiptText}>Forgot PIN?</Text>
        </TouchableOpacity>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
  },
  balanceContainerWrapper: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    marginTop: hp(7),
    height: hp(100),
    width: wp(370),
    backgroundColor: colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  balanceTextWrapper: {
    width: wp(150),
    height: hp(60),
  },
  balanceTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    color: colors.textLight,
  },
  balanceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    color: colors.textWhite,
  },
  paymentTypeWrapper: {
    marginTop: hp(10),
    flexDirection: 'row',
    width: '100%',
    height: hp(90),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  PaymentMethodItemWrapper: {
    width: wp(70),
    marginRight: wp(10),
    height: '70%',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
  },
  paymentMethodType: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp(12),
    color: colors.primary,
  },
  paymentMethodFee: {
    fontFamily: 'Poppins-Bold',
    marginTop: 4,
  },
  usingCard: {
    width: wp(170),
    height: hp(83),
    borderWidth: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary,
  },
  usingCardText: {
    fontFamily: 'Poppins-Light',
    fontSize: hp(15),
  },
  usingBank: {
    width: wp(170),
    height: hp(83),
    borderWidth: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary,
  },
  usingBankTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(20),
    color: colors.primary,
  },
  usingBankSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(10),
  },
  textNote: {
    marginTop: hp(19),
    fontFamily: 'Poppins-Regular',
    fontSize: hp(14),
    paddingHorizontal: 25,
    textAlign: 'center',
  },
  textInputWrapper: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(40),
    textAlign: 'center',
    color: colors.primary,
    minWidth: 150,
  },
  nairaSign: {
    color: colors.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(40),
  },
  amountText: {
    marginHorizontal: 10,
    color: colors.primary,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(60),
  },
  processingFee: {
    fontFamily: 'Poppins-Light',
    color: colors.textLight,
    fontSize: hp(20),
    textAlign: 'center',
    marginBottom: hp(5),
  },
  numericInputWrapper: {
    width: '100%',
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberContainer: {
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  numberText: {
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    fontSize: hp(30),
  },
  shareReceiptButton: {
    marginTop: hp(10),
    width: wp(300),
    height: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },

  shareReceiptText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: colors.secondary,
    fontSize: hp(18),
  },

  dotInput: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: wp(10),
  },
});
