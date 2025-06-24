/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {Wave as LoadingAnimation} from 'react-native-animated-spinkit';

import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import {hp, wp} from '../../config/dpTopx';
import {
  Button,
  FormControl,
  Input,
  VStack,
  IconButton,
  HStack,
  useTheme,
} from 'native-base';
import {Formik} from 'formik';
import * as validation from '../../utils/validations';

import colors from '../../../assets/colors/colors';
import {completeUserAuth, signUp} from '../../redux/actions/auth';
import {PasswordRequirementCheck} from '../../components/PasswordRequirementCheck';
import {checkUserExist, registerUser, userVerificaiton} from '../../api';


const userCheckInit = {
  phone: '',
  otp: '',
  full_name: '',
  email: '',
};

export const RegistrationScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.auth);
  const themeColors = useTheme().colors;

  // ---- States for OTP / phone flow ----
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpPending, setOtpPending] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checkUser, setCheckUser] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInput = useRef(null);
  const [currentStep, setCurrentStep] = useState(0); // 0=enter phone, 1=enter personal info

  // Countdown effect for “resend OTP” cooldown
  useEffect(() => {
    let timer = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  // Handle the “Continue” / “Submit OTP” / “Submit Registration” logic
  const handleRegister = async data => {
    // Step 0: The user taps “Continue” with their phone number
    if (!checkUser) {
      // Validate phone before sending OTP
      if (!phoneInput.current?.isValidNumber(phoneNumber)) {
        Alert.alert('Please enter a valid phone number.');
        return;
      }

      setLoading(true);
      const checkUserResponse = await checkUserExist(phoneNumber);
      if (checkUserResponse.ok) {
        setUserExists(Boolean(checkUserResponse.data?.user_exist));

        // Request OTP code
        const requestOtp = await userVerificaiton.requestCode(phoneNumber);
        if (requestOtp.ok) {
          setOtpPending(true);
          setResendCooldown(60);
        } else {
          // Even if OTP request fails, we still show OTP input
          setOtpPending(true);

          Alert.alert(
            requestOtp.data?.detail ||
              'Something went wrong sending OTP. Please try again.',
          );
          setResendCooldown(60);
        }

        setCheckUser(true);
      } else {
        Alert.alert(
          checkUserResponse.data?.detail ||
            'Unable to check user status. Try again.',
        );
      }
      setLoading(false);
      return;
    }

    // Step 1: OTP is pending, so this is “Submit OTP”
    if (otpPending) {
      setLoading(true);
      const verifyCodeResponse = await userVerificaiton.verifyCode({
        code: data.otp,
        phone_number: phoneNumber,
      });
      if (verifyCodeResponse.ok) {
        setOtpVerified(true);
        setOtpPending(false);
        setOtp('');

        // If user already existed, log them in immediately
        if (userExists) {
          dispatch(completeUserAuth(verifyCodeResponse.data));
        } else {
          // New user: show the “enter full name + email” step
          setCurrentStep(1);
        }
      } else {
        Alert.alert(
          verifyCodeResponse.data?.detail || 'Invalid OTP. Please try again.',
        );
      }
      setLoading(false);
      return;
    }

    // Step 2: New user is filling out name/email to finish registration
    if (currentStep === 1 && otpVerified && !userExists) {
      setLoading(true);

      // Prepare payload for registration
      const [first_name, last_name] = data.full_name?.split(' ');
      const payload = {
        first_name,
        last_name,
        email: data.email,
        phone_number: phoneNumber,
      };

      const registerRequest = await registerUser(payload);
      if (registerRequest.ok) {
        dispatch(completeUserAuth(registerRequest.data));
      } else {
        Alert.alert(
          registerRequest.data?.detail ||
            'Something went wrong while creating your account. Please try again.',
        );
      }

      // Reset state after registration
      setLoading(false);
    }
  };

  // “Resend OTP” button handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    if (!phoneInput.current?.isValidNumber(phoneNumber)) {
      Alert.alert('Please enter a valid phone number before resending OTP.');
      return;
    }
    setLoading(true);
    const requestOtp = await userVerificaiton.requestCode(phoneNumber);
    if (requestOtp.ok) {
      setResendCooldown(60);
      Alert.alert('A new OTP has been sent.');
    } else {
      Alert.alert(
        requestOtp.data?.detail ||
          'Something went wrong while resending OTP. Please try again.',
      );
    }
    setLoading(false);
  };

  // Reset all state if user changes their phone
  const handleResetState = () => {
    setCurrentStep(0);
    setOtpPending(false);
    setOtpVerified(false);
    setLoading(false);
    setOtp('');
    setResendCooldown(0);
    setCheckUser(false);
    setUserExists(false);
  };

  // The “title” and “subtitle” change depending on where we are:
  const renderHeaderText = () => {
    if (!checkUser) {
      // Before we know if the phone belongs to an existing user
      return {
        title: 'Welcome!',
        subtitle: 'Enter your phone number to continue.',
      };
    }

    if (checkUser && otpPending) {
      // After OTP is sent but not verified
      return userExists
        ? {
            title: 'Welcome back!',
            subtitle: 'Enter the OTP sent to your phone to log in.',
          }
        : {
            title: 'Almost there!',
            subtitle: 'Enter the OTP sent to your phone to verify.',
          };
    }

    if (otpVerified && currentStep === 1) {
      // New user is on step 2 (fill name/email)
      return {
        title: 'Create your account',
        subtitle:
          'Set up your name and email address to complete registration.',
      };
    }

    // Fallback (should not really happen)
    return {title: '', subtitle: ''};
  };

  const {title, subtitle} = renderHeaderText();

  return (
    <ImageBackground
      blurRadius={8}
      source={require('../../../assets/images/datashopbg.png')}
      style={styles.container}>
      <HStack px="2">
        <IconButton
          rounded={'full'}
          onPress={() => navigation.goBack()}
          icon={<Feather name={'arrow-left'} size={20} color={'white'} />}
        />
      </HStack>

      <View
        style={{
          flex: 1,
          padding: 10,
          borderRadius: 10,
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            paddingHorizontal: 15,
            paddingVertical: 20,
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          {/* === HEADER / CONTEXT === */}
          <View style={{marginBottom: hp(10)}}>
            <Text
              style={{
                fontSize: hp(24),
                fontWeight: 'bold',
                color: colors.textBlack,
              }}>
              {title}
            </Text>
            <Text style={{fontSize: hp(14), color: 'gray', marginTop: hp(2)}}>
              {subtitle}
            </Text>
          </View>

          {/* === FORM START === */}
          <Formik
            initialValues={userCheckInit}
            onSubmit={form => handleRegister(form)}>
            {({
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <VStack space={'4'}>
                {/* ============== STEP 0: PHONE INPUT ============== */}

                <FormControl
                  isInvalid={
                    !phoneInput.current?.isValidNumber(values.phone) &&
                    touched.phone
                  }>
                  <VStack space={'1'}>
                    <PhoneInput
                      ref={phoneInput}
                      defaultValue={values.phone}
                      defaultCode="NG"
                      layout="first"
                      onChangeText={text => {
                        setFieldValue('phone', text);
                        setPhoneNumber(text);
                        handleResetState();
                        setFieldValue('otp', '');
                      }}
                      onChangeFormattedText={text => {
                        setFormattedValue(text);
                      }}
                      withDarkTheme
                      containerStyle={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: otpVerified
                          ? themeColors.green[500]
                          : themeColors.gray[200],
                        width: '100%',
                      }}
                      textContainerStyle={{borderRadius: 10}}
                      textInputStyle={{
                        fontSize: hp(14),
                        color: themeColors.textBlack,
                        paddingVertical: 0,
                      }}
                      codeTextStyle={{
                        fontSize: hp(14),
                        color: themeColors.textBlack,
                      }}
                      placeholder="Enter your phone number"
                      placeholderTextColor="gray"
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      autoCapitalize="none"
                      maxLength={11}
                      onBlur={handleBlur('phone')}
                    />
                    {otpVerified && (
                      <HStack
                        alignItems={'center'}
                        justifyContent={'flex-end'}
                        space={'2'}>
                        <Text
                          style={{
                            color: themeColors.green[500],
                            fontSize: 12,
                          }}>
                          Verified
                        </Text>
                      </HStack>
                    )}
                  </VStack>

                  <FormControl.ErrorMessage
                    leftIcon={<Feather name="info" size={10} />}>
                    {'Please enter a valid phone number'}
                  </FormControl.ErrorMessage>
                </FormControl>

                {/* ============== STEP 1: OTP INPUT ============== */}
                {otpPending && currentStep === 0 && (
                  <VStack space={'2'}>
                    <FormControl>
                      <FormControl.Label>OTP</FormControl.Label>
                      <Input
                        placeholder="Enter OTP"
                        value={values.otp}
                        onBlur={handleBlur('otp')}
                        onChangeText={handleChange('otp')}
                        keyboardType="numeric"
                      />
                    </FormControl>

                    <HStack alignItems="center" space="2">
                      <Button
                        variant="unstyled"
                        onPress={handleResendOtp}
                        disabled={resendCooldown > 0 || loading}>
                        {resendCooldown > 0
                          ? `Resend OTP in ${resendCooldown}s`
                          : 'Resend OTP'}
                      </Button>
                    </HStack>
                  </VStack>
                )}

                {/* ============== STEP 2: NEW USER INFO ============== */}
                {currentStep === 1 && otpVerified && !userExists && (
                  <>
                    <FormControl
                      isInvalid={errors.full_name && touched.full_name}>
                      <FormControl.Label>Full name</FormControl.Label>
                      <Input
                        placeholder="Full name"
                        value={values.full_name}
                        onBlur={handleBlur('full_name')}
                        onChangeText={handleChange('full_name')}
                        autoCapitalize={'words'}
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<Feather name="info" size={10} />}>
                        {errors.full_name}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.email && touched.email}>
                      <FormControl.Label>Email address</FormControl.Label>
                      <Input
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

                    {values.password?.length > 0 && (
                      <>
                        <PasswordRequirementCheck password={values.password} />
                      </>
                    )}
                  </>
                )}

                {/* ============== ACTION BUTTON ============== */}
                <Button
                  mt={'2'}
                  size={'lg'}
                  py={'3'}
                  disabled={loading}
                  onPress={handleSubmit}>
                  {!loading ? (
                    // Change text depending on step + userExists
                    <>
                      {currentStep === 0
                        ? 'Continue'
                        : currentStep === 1 && otpPending
                        ? 'Submit OTP'
                        : 'Create Account'}
                    </>
                  ) : (
                    <LoadingAnimation size={20} color={'#FFF'} />
                  )}
                </Button>
              </VStack>
            )}
          </Formik>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
  },
  switchText: {
    fontSize: hp(13),
    color: 'gray',
  },
  switchLink: {
    fontSize: hp(13),
    color: colors.primary,
    fontWeight: '600',
  },
});
