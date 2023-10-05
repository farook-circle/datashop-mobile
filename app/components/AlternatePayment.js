import {View, Text as NText, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {paymentAccountDetails} from '../redux/actions/wallet';

const Text = props => (
  <NText {...props} selectable={true}>
    {props.children}
  </NText>
);

export default function AlternatePayment() {
  useEffect(() => {
    dispatch(paymentAccountDetails());
  }, []);

  const dispatch = useDispatch();
  const account_details = useSelector(state => state.wallet.payment_method);

  return (
    <View style={styles.container}>
      <View style={styles.accountInfoWrapper}>
        <Text style={styles.bankNameText}>
          Bank Name:{' '}
          {account_details !== undefined ? account_details.bank_name : ''}{' '}
        </Text>
        <Text style={styles.accountNumberText}>
          Account Number:{' '}
          {account_details !== undefined ? account_details.account_number : ''}
        </Text>
        <Text style={styles.accountNumberName}>
          Account Name:{' '}
          {account_details !== undefined ? account_details.account_name : ''}
        </Text>
      </View>
      <View style={styles.instructionWrapper}>
        <Text style={styles.instructionText}>
          Instruction:
          <Text style={styles.instructionTitleText}>
            {' '}
            {account_details !== undefined ? account_details.instruction : ''}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  accountInfoWrapper: {
    marginTop: hp('5.9'),
    width: wp('90%'),
    borderWidth: 2,
    padding: hp('2.5'),
    borderRadius: 10,
    borderColor: colors.textLight,
  },
  bankNameText: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp('2.08'),
  },
  accountNumberText: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp('2.08'),
  },
  accountNumberName: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp('2.08'),
  },
  instructionWrapper: {
    marginTop: hp('5.8'),
    width: wp('90%'),
  },
  instructionText: {
    color: colors.primary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp('2.5'),
  },
});
