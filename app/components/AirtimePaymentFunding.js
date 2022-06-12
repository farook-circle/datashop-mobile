import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAirtimeFundingInstruction,
  paymentAccountDetails,
} from '../redux/actions/wallet';

export default function AirtimePaymentFunding() {
  useEffect(() => {
    dispatch(getAirtimeFundingInstruction());
  }, []);

  const dispatch = useDispatch();
  const airtime = useSelector(state => state.wallet.airtime_instruction);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {airtime !== null && airtime.instruction}
      </Text>
      {!airtime && (
        <Text style={styles.error}>Service not available At the moment</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  instruction: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: colors.primary,
  },
  error: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: colors.secondary,
  },
});
