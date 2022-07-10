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
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import Input from '../components/Input';
import Button from '../components/Button';
import {withdrawCollaborator} from '../redux/actions/collaborator';

export default function Withdraw({navigation}) {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const user = useSelector(state => state.auth.user);
  const balance = useSelector(state => state.wallet.wallet_balance);

  useEffect(() => {
    Number(amount) < 100 ? setDisableButton(true) : setDisableButton(false);
  }, [amount]);

  const handleValidateWithdraw = () => {
    if (Number(balance) < Number(amount)) {
      return alert('Your balance is too low');
    }

    Alert.alert(
      'alert',
      `You are about to withdraw \u20A6${Number(
        amount,
      )} from your wallet\nthis will be your wallet balance after withdraw \u20A6${
        Number(balance) - Number(amount)
      }`,

      [{text: 'Cancel'}, {text: 'Proceed', onPress: handleWithdraw}],
    );
  };

  const handleWithdraw = () => {
    setWithdrawLoading(true);
    setDisableButton(true);
    dispatch(withdrawCollaborator({amount}, handleWithdrawResponse));
  };

  const handleWithdrawResponse = (res_data, res_status) => {
    if (res_status < 300) {
      setWithdrawLoading(false);
      setDisableButton(false);
      alert(
        `you have successfully request a withdrawal of \u20A6${amount} from you wallet you request will be process shortly`,
      );
      navigation.navigate('Home');
      return;
    }

    if (res_status > 300 && res_status < 1000) {
      setWithdrawLoading(false);
      setDisableButton(false);
      alert('Something went wrong please try again later');
      return;
    }

    setWithdrawLoading(false);
    setDisableButton(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              name="chevron-left"
              size={hp(35)}
              color={colors.textBlack}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Withdraw</Text>
          <Text>{'  '}</Text>
        </View>
        <View style={styles.headerUnderLine} />
      </SafeAreaView>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.headerText}>{'Withdraw \nfrom your wallet'}</Text>
        <Text style={styles.amountLabel}>Amount</Text>
        <View style={{justifyContent: 'center'}}>
          <Text
            style={{
              position: 'absolute',
              marginLeft: 10,
              fontFamily: 'Poppins-Regular',
              fontSize: hp(16),
            }}>
            {'\u20A6'}
          </Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Amount"
            keyboardType={'numeric'}
            value={amount}
            onChangeText={text => setAmount(text)}
          />
        </View>

        <Text style={styles.noteText}>Minimum Withdraw {'\u20A6'}100</Text>
      </View>
      <TouchableOpacity
        onPress={handleValidateWithdraw}
        disabled={disableButton}
        style={[
          styles.buttonStyle,
          disableButton && {backgroundColor: colors.textLight},
        ]}>
        {withdrawLoading ? (
          <ActivityIndicator size={'large'} color={colors.primary} />
        ) : (
          <Text style={styles.buttonText}>Request</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 25,
    justifyContent: 'flex-end',
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  buttonStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: hp(8),
    marginBottom: hp(20),
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textWhite,
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp(26),
    color: colors.primary,
  },
  amountLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(14),
    color: colors.textLight,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: wp(28),
  },
  noteText: {
    marginTop: 20,
    fontFamily: 'Poppins-Medium',
    width: '100%',
    textAlign: 'center',
  },
});
