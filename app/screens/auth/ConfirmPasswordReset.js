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
} from 'react-native';
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {Button} from 'native-base';

import colors from '../../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../../config/dpTopx';
import {confirmUserPasswordReset} from '../../api/auth.api';

export const ConfirmPasswordReset = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const data = route.params.data;

  const [otp, setOtp] = React.useState('');

  const handleConfirmUserPassword = async () => {
    // validate phone phone number
    if (!otp || otp.length < 5) {
      Alert.alert(
        'Warning',
        'A Valid OTP length is around 5 please check and try again',
      );
      return;
    }

    setLoading(true);

    const payload = {
      token: data && data.token,
      code: otp,
    };

    // send user password reset
    const request = await confirmUserPasswordReset(payload);
    if (request.ok) {
      navigation.navigate('ForgotPasswordComplete', {
        data: payload,
      });
      setLoading(false);
      return;
    }

    alert(
      request.data ? request.data.message : 'Unable to complete your request',
    );
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              name="chevron-left"
              size={hp(25)}
              color={colors.textBlack}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Forgot Password Confirm</Text>
          <Text>{'  '}</Text>
        </View>
      </SafeAreaView>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.titleText}>{`OTP\nCODE?`}</Text>
        <Text style={styles.subTitleText}>
          We have sent you an email with your otp reset code
        </Text>
        <Text style={styles.emailLabel}>Your OTP Code:</Text>
        <TextInput
          value={otp}
          placeholder="OTP Code"
          style={styles.emailInput}
          onChangeText={text => setOtp(text)}
          keyboardType="decimal-pad"
        />
      </View>
      <Button mb={'4'} onPress={handleConfirmUserPassword} isLoading={loading}>
        Continue
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 25,
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
    fontSize: hp(14),
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    fontSize: hp(25),
  },
  subTitleText: {
    fontFamily: 'Poppins-Regular',
    color: colors.textBlack,
    fontSize: hp(16),
  },
  emailLabel: {
    marginTop: hp(10),
    fontFamily: 'Poppins-Regular',
    color: colors.textLight,
    fontSize: hp(14),
  },
  emailInput: {
    fontFamily: 'Poppins-Regular',
    color: colors.textBlack,
    fontSize: hp(14),
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonStyle: {
    paddingVertical: hp(7),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    color: colors.textWhite,
    fontSize: hp(14),
  },
});
