/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Feather from 'react-native-vector-icons/Feather';
import {signIn} from '../../redux/actions/auth';
import {MainLayout} from '../../components';

import colors from '../../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {hp, wp} from '../../config/dpTopx';
import {
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Pressable,
  VStack,
  useTheme,
} from 'native-base';
import {Formik} from 'formik';
import * as yup from 'yup';

const loginValidation = yup.object().shape({
  username: yup
    .string()
    .matches(/0(9|8|7)(0|1)(\d){8}\b/, 'Enter a valid phone number')
    .required('Phone number is required'),
  password: yup.string().required('Password is required'),
});

export const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [eyePassword, setEyePassword] = useState(false);
  const buttonStatus = useSelector(state => state.auth.isLoading);
  const {colors} = useTheme();

  const ErrorOccur = status => {
    alert(status);
  };
  const logIn = payload => {
    dispatch(signIn(payload, ErrorOccur));
  };

  return (
    <MainLayout showHeader={true}>
      <KeyboardAwareScrollView>
        {/* Header Logo*/}
        <View style={styles.headerWrapper}>
          {/* <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoTitle}>datashop.</Text> */}
        </View>
        {/* illustrate Image */}
        <Image
          source={require('../../../assets/images/mobile_login.png')}
          style={styles.illustratedImage}
        />

        {/* Registration Form and button wrapper */}
        <Formik
          validationSchema={loginValidation}
          initialValues={{username: '', password: ''}}
          onSubmit={form => logIn(form)}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <VStack flex={1} px={'6'} space={'2'}>
              <FormControl isInvalid={touched.username && errors.username}>
                <FormControl.Label>Phone Number</FormControl.Label>
                <Input
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  InputLeftElement={
                    <Box pl={'3'}>
                      <Feather name={'user'} size={20} color={'black'} />
                    </Box>
                  }
                  size={'lg'}
                  py={'3'}
                  placeholder="Phone Number"
                />
                <FormControl.ErrorMessage
                  leftIcon={<Feather name="info" size={10} />}>
                  {errors.username}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={touched.password && errors.password}>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  InputLeftElement={
                    <Box pl={'3'}>
                      <Feather name={'lock'} size={20} color={'black'} />
                    </Box>
                  }
                  InputRightElement={
                    <IconButton
                      onPress={() => setEyePassword(!eyePassword)}
                      pr={'3'}
                      icon={
                        <Feather
                          name={eyePassword ? 'eye' : 'eye-off'}
                          color={eyePassword ? colors.primary[500] : 'gray'}
                          size={20}
                        />
                      }
                    />
                  }
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={eyePassword ? false : true}
                  size={'lg'}
                  py={'3'}
                  placeholder="Password"
                />
                <FormControl.ErrorMessage
                  leftIcon={<Feather name="info" size={10} />}>
                  {errors.password}
                </FormControl.ErrorMessage>
              </FormControl>

              <HStack justifyContent={'flex-end'}>
                <Button
                  size={'lg'}
                  onPress={() => navigation.navigate('ForgotPasswordRequest')}
                  variant={'ghost'}>
                  Forgot Password?
                </Button>
              </HStack>

              <VStack space={'3'}>
                <Button
                  isLoading={buttonStatus}
                  onPress={handleSubmit}
                  size={'lg'}
                  py={'3'}
                  rounded={'xl'}>
                  Login
                </Button>
                <HStack
                  space={'1'}
                  alignItems={'center'}
                  justifyContent={'center'}>
                  <Text style={[styles.textLoginLink, {color: 'black'}]}>
                    Don't have an account?
                  </Text>
                  <Pressable onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.textLoginLink}>Register</Text>
                  </Pressable>
                </HStack>
              </VStack>
            </VStack>
          )}
        </Formik>
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
    height: hp(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(50),
    paddingHorizontal: 64,
  },
  logoImage: {margin: 5},
  logoTitle: {
    color: colors.textBlack,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(36),
  },
  illustratedImage: {
    marginTop: hp(5),
    alignSelf: 'center',
    width: wp(231),
    height: hp(199),
  },

  introTitle: {
    marginTop: hp(30),
    color: colors.textBlack,
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    paddingHorizontal: 60,
  },
  textInputWrapper: {
    width: wp(310),
    height: hp(150),
    // backgroundColor: 'red',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textInput: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    borderWidth: 2,
    // borderColor: colors.textLight,
    width: wp(310),
    height: hp(60),
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  passwordWrapper: {
    width: wp(310),
    height: hp(60),
    borderRadius: 10,
    borderWidth: 2,
    // borderColor: colors.textLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputPassword: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    height: hp(60),
    paddingHorizontal: 30,
    flex: 1,
  },
  eyeIcon: {
    paddingRight: 20,
  },
  buttonsWrapper: {
    width: wp(310),
    height: hp(101),
    marginTop: hp(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },

  registerText: {
    color: colors.textWhite,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
  },
  registerButton: {
    width: wp(310),
    height: hp(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  textLogin: {
    width: '100%',
    textAlign: 'center',
    marginTop: hp(14),
    fontFamily: 'Poppins-Light',
    fontSize: hp(14),
  },
  textLoginLink: {
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
});
