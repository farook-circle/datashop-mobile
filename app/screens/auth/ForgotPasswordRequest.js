/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../../../assets/colors/colors';
import {hp} from '../../config/dpTopx';
import {requestUserPasswordReset} from '../../api/auth.api';
import {Button, FormControl, Input} from 'native-base';

export const ForgotPasswordRequest = ({navigation}) => {
  const [phone_number, setPhoneNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleResetUserPassword = async () => {
    // validate phone phone number
    if (!phone_number || phone_number.length < 11) {
      Alert.alert('Warning', 'Please type a valid account phone number');
      return;
    }

    setLoading(true);

    const request = await requestUserPasswordReset({phone_number});
    if (request.ok) {
      navigation.navigate('ForgotPasswordConfirm', {
        data: request.data,
      });
      setLoading(false);
      return;
    }

    Alert.alert(
      request.data ? request.data.reason : 'Unable to complete your request',
    );
    setLoading(false);
  };

  return (
    <>
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
            <Text style={styles.headerTitleText}>Forgot Password</Text>
            <Text>{'  '}</Text>
          </View>
        </SafeAreaView>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={styles.titleText}>{`Forgot\nPassword?`}</Text>
          <Text style={styles.subTitleText}>
            Fill in your phone Number below to get the password reset code
          </Text>
          <FormControl isInvalid={phone_number.length < 11} mt={'4'}>
            <FormControl.Label>Your account phone number</FormControl.Label>
            <Input
              size={'lg'}
              py={'3'}
              placeholder={'Phone Number'}
              value={phone_number}
              onChangeText={text => setPhoneNumber(text)}
              keyboardType="decimal-pad"
            />
            <FormControl.ErrorMessage
              leftIcon={<Feather name={'info'} color={'red'} />}>
              {phone_number.length < 11 && 'Please type a valid phone number'}
            </FormControl.ErrorMessage>
          </FormControl>
        </View>

        <Button
          size={'lg'}
          py={'3'}
          mb={'6'}
          onPress={handleResetUserPassword}
          isLoading={loading}>
          Reset Password
        </Button>
      </View>
    </>
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
