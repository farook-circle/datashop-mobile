import {View, Text, StyleSheet, StatusBar, Platform, Image} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector, useDispatch} from 'react-redux';
import {hp, wp} from '../../config/dpTopx';
import {Button, FormControl, Input, VStack, Pressable} from 'native-base';
import {Formik} from 'formik';
import * as validation from '../../utils/validations';

import colors from '../../../assets/colors/colors';
import {signUp} from '../../redux/actions/auth';
import {MainLayout} from '../../components';

// Utility function to calculate password strength
const calculatePasswordStrength = password => {
  let strength = 0;
  if (password.length >= 8) {
    strength += 1;
  } // Minimum length
  if (/[A-Z]/.test(password)) {
    strength += 1;
  } // Uppercase letter
  if (/[a-z]/.test(password)) {
    strength += 1;
  } // Lowercase letter
  if (/[0-9]/.test(password)) {
    strength += 1;
  } // Number
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
  } // Special character
  return strength;
};

const registerInitialValue = {
  full_name: '',
  phone: '',
  email: '',
  password: '',
  confirm_password: '', // Added for retype password
  referral_code: '',
};

export const RegistrationScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [eyePassword, setEyePassword] = useState(false);
  const [eyeConfirmPassword, setEyeConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // Password strength state
  const {isLoading} = useSelector(state => state.auth);

  const handleRegister = data => {
    const [first_name, last_name] = data.full_name.split(' ');

    const payload = {
      first_name,
      last_name,
      email: data.email,
      username: data.phone,
      password: data.password,
    };

    if (data.referral_code) {
      payload.referral_code = data.referral_code;
    }

    dispatch(signUp(payload, ErrorOccur));
  };

  const ErrorOccur = status => {
    alert(status);
  };

  return (
    <MainLayout
      style={styles.container}
      titleHeader={'Register'}
      showHeader={true}>
      <KeyboardAwareScrollView>
        <View style={styles.headerWrapper}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoTitle}>datashop.</Text>
        </View>

        <Text style={styles.introTitle}>Welcome Onboard!</Text>
        <Text style={styles.introSubtitle}>
          Fill in the form below to become an agent and start selling for your
          customer.
        </Text>

        <Formik
          validationSchema={validation.signUpValidationSchema}
          initialValues={registerInitialValue}
          onSubmit={form => handleRegister(form)}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <VStack px={'4'} space={'2'}>
              <FormControl isInvalid={errors.full_name && touched.full_name}>
                <FormControl.Label>Full name</FormControl.Label>
                <Input
                  size={'lg'}
                  py={'3'}
                  placeholder="Full name"
                  value={values.full_name}
                  onBlur={handleBlur('full_name')}
                  onChangeText={handleChange('full_name')}
                />
                <FormControl.ErrorMessage
                  leftIcon={<Feather name="info" size={10} />}>
                  {errors.full_name}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.phone && touched.phone}>
                <FormControl.Label>Phone number</FormControl.Label>
                <Input
                  size={'lg'}
                  py={'3'}
                  placeholder="Phone"
                  value={values.phone}
                  onBlur={handleBlur('phone')}
                  onChangeText={text => {
                    if (text.length > 11) {
                      return;
                    }
                    setFieldValue('phone', text);
                  }}
                  keyboardType={'decimal-pad'}
                />
                <FormControl.ErrorMessage
                  leftIcon={<Feather name="info" size={10} />}>
                  {errors.phone}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.email && touched.email}>
                <FormControl.Label>Email address</FormControl.Label>
                <Input
                  size={'lg'}
                  py={'3'}
                  placeholder="Email address"
                  value={values.email}
                  onBlur={handleBlur('email')}
                  onChangeText={handleChange('email')}
                  autoCapitalize={'none'}
                />
                <FormControl.ErrorMessage
                  leftIcon={<Feather name="info" size={10} />}>
                  {errors.email}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl>
                <FormControl.Label>Referral Code (Optional)</FormControl.Label>
                <Input
                  size={'lg'}
                  py={'3'}
                  placeholder="Referral Code"
                  keyboardType="decimal-pad"
                  value={values.referral_code}
                  onBlur={handleBlur('referral_code')}
                  onChangeText={text => {
                    if (text.length > 11) {
                      return;
                    }
                    setFieldValue('referral_code', text);
                  }}
                />
              </FormControl>

              {/* Password Input */}
              <FormControl isInvalid={errors.password && touched.password}>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  size={'lg'}
                  py={'3'}
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur('password')}
                  onChangeText={text => {
                    setFieldValue('password', text);
                    setPasswordStrength(calculatePasswordStrength(text));
                  }}
                  autoCapitalize={'none'}
                  secureTextEntry={!eyePassword}
                  InputRightElement={
                    <Pressable
                      onPress={() => setEyePassword(!eyePassword)}
                      pr={'2'}>
                      <Feather
                        name={eyePassword ? 'eye' : 'eye-off'}
                        color={'gray'}
                        size={hp(20)}
                      />
                    </Pressable>
                  }
                />
                <FormControl.ErrorMessage
                  leftIcon={<Feather name="info" size={10} />}>
                  {errors.password}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Password Strength Indicator */}
              <View style={styles.passwordStrengthWrapper}>
                <Text>Password Strength:</Text>
                <Text
                  style={[
                    styles.passwordStrengthText,
                    {
                      color:
                        passwordStrength < 3
                          ? 'red'
                          : passwordStrength === 3
                          ? 'orange'
                          : 'green',
                    },
                  ]}>
                  {passwordStrength < 3
                    ? 'Weak'
                    : passwordStrength === 3
                    ? 'Medium'
                    : 'Strong'}
                </Text>
              </View>

              {/* Retype Password Input */}
              <FormControl
                isInvalid={errors.confirm_password && touched.confirm_password}>
                <FormControl.Label>Retype Password</FormControl.Label>
                <Input
                  size={'lg'}
                  py={'3'}
                  placeholder="Retype Password"
                  value={values.confirm_password}
                  onBlur={handleBlur('confirm_password')}
                  onChangeText={handleChange('confirm_password')}
                  autoCapitalize={'none'}
                  secureTextEntry={!eyeConfirmPassword}
                  InputRightElement={
                    <Pressable
                      onPress={() => setEyeConfirmPassword(!eyeConfirmPassword)}
                      pr={'2'}>
                      <Feather
                        name={eyeConfirmPassword ? 'eye' : 'eye-off'}
                        color={'gray'}
                        size={hp(20)}
                      />
                    </Pressable>
                  }
                />
                <FormControl.ErrorMessage
                  leftIcon={<Feather name="info" size={10} />}>
                  {errors.confirm_password}
                </FormControl.ErrorMessage>
              </FormControl>

              <Button
                mt={'2'}
                size={'lg'}
                py={'3'}
                isLoading={isLoading}
                onPress={handleSubmit}>
                Register
              </Button>
            </VStack>
          )}
        </Formik>

        <View style={styles.buttonsWrapper}>
          <Text style={styles.textLogin}>
            Already have an account?{' '}
            <Text
              style={styles.textLoginLink}
              onPress={() => navigation.navigate('Login')}>
              Login.
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(20),
    paddingHorizontal: wp(14),
  },
  logoImage: {margin: 5, height: hp(30), width: hp(30)},
  logoTitle: {
    color: colors.textBlack,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(20),
  },
  introTitle: {
    marginTop: hp(15),
    color: colors.textBlack,
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    paddingHorizontal: wp(15),
  },
  introSubtitle: {
    marginTop: hp(2),
    color: 'gray',
    fontFamily: 'Poppins-Regular',
    fontSize: hp(13),
    paddingHorizontal: wp(15),
    marginBottom: hp(10),
  },
  passwordStrengthWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(5),
  },
  passwordStrengthText: {
    fontSize: hp(14),
    fontWeight: 'bold',
  },
  buttonsWrapper: {
    width: wp(310),
    height: hp(101),
    marginTop: hp(5),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textLogin: {
    width: '100%',
    textAlign: 'center',
    marginTop: hp(15),
    fontFamily: 'Poppins-Light',
    fontSize: hp(14),
  },
  textLoginLink: {
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
});
