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
import Feather from 'react-native-vector-icons/Feather';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector, useDispatch} from 'react-redux';
import {hp, dp, wp} from '../config/dpTopx';
import {Button, FormControl, Input, VStack, Pressable} from 'native-base';
import {Formik} from 'formik';
import * as validation from '../utils/validations';

import colors from '../../assets/colors/colors';
import {signUp} from '../redux/actions/auth';

const registerInitialValue = {
  full_name: '',
  phone: '',
  email: '',
  password: '',
  password_again: '',
};

export default function RegistrationScreen({navigation}) {
  const dispatch = useDispatch();

  const [eyePassword, setEyePassword] = useState(false);
  const [eyePasswordAgain, setEyePasswordAgain] = useState(false);

  const {isLoading} = useSelector(state => state.auth);

  /* registration form */
  
  const handleRegister = (data) => {
    
    navigation.navigate('VerifyEmail', {email: data.email});
    return;

    const [first_name, last_name ] = data.full_name.split(' ');

    const payload = {
      first_name,
      last_name,
      email: data.email,
      username: data.phone,
      password: data.password
    }

    dispatch(signUp(payload, ErrorOccur));
  };

  const ErrorOccur = status => {
    alert(status);
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
        {/* Header Logo*/}
        <View style={styles.headerWrapper}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoTitle}>datashop.</Text>
        </View>

        {/* Welcome onboard message and subtitle */}
        <Text style={styles.introTitle}>Welcome Onboard!</Text>
        <Text style={styles.introSubtitle}>
          Fill in the form below to become an agent and start selling for your
          costumer
        </Text>

        {/* Registration Form and button wrapper */}

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
            setFieldValue
          }) => (
            <VStack px={'4'} space={'2'}>
              <FormControl>
                <FormControl.Label>Full name</FormControl.Label>
                <Input
                  placeholder="Full name"
                  value={values.full_name}
                  onBlur={handleBlur('full_name')}
                  onChangeText={handleChange('full_name')}
                />
                {errors.full_name && touched.full_name && (
                  <Text style={{color: 'red'}}>{errors.full_name}</Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Phone number</FormControl.Label>
                <Input
                  placeholder="Phone"
                  value={values.phone}
                  onBlur={handleBlur('phone')}
                  onChangeText={text => {
                    if(text.length > 11 ) {
                      return;
                    }
                    setFieldValue("phone", text)}
                  }
                  keyboardType={'decimal-pad'}
                />
                {errors.phone && touched.phone && (
                  <Text style={{color: 'red'}}>{errors.phone}</Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Email address</FormControl.Label>
                <Input
                  placeholder="Email address"
                  value={values.email}
                  onBlur={handleBlur('email')}
                  onChangeText={handleChange('email')}
                  autoCapitalize={'none'}
                />
                {errors.email && touched.email && (
                  <Text style={{color: 'red'}}>{errors.email}</Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                  autoCapitalize={'none'}
                  secureTextEntry={!eyePassword}
                  InputRightElement={
                    <Pressable onPress={() => setEyePassword(!eyePassword)} pr={'2'}>
                      <Feather
                        name={eyePassword ? 'eye' : 'eye-off'}
                        color={'gray'}
                        size={hp(20)}
                      />
                    </Pressable>
                  }
                />
                {errors.password && touched.password && (
                  <Text style={{color: 'red'}}>{errors.password}</Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Retype password</FormControl.Label>
                <Input
                  placeholder="Retype password"
                  value={values.password_again}
                  onBlur={handleBlur('password_again')}
                  onChangeText={handleChange('password_again')}
                  secureTextEntry={!eyePasswordAgain}
                  autoCapitalize={'none'}
                  InputRightElement={
                    <Pressable onPress={() => setEyePasswordAgain(!eyePasswordAgain)} pr={'2'}>
                      <Feather
                        name={eyePasswordAgain ? 'eye' : 'eye-off'}
                        color={'gray'}
                        size={hp(20)}
                      />
                    </Pressable>
                  }
                />
                {errors.password_again && touched.password_again && (
                  <Text style={{color: 'red'}}>{errors.password_again}</Text>
                )}
              </FormControl>
              <Button isLoading={isLoading} onPress={handleSubmit}>Register</Button>
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
    </SafeAreaView>
  );
}

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
    marginTop: hp(20),
    paddingHorizontal: 64,
  },
  logoImage: {margin: 5},
  logoTitle: {
    color: colors.textBlack,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(36),
  },

  introTitle: {
    marginTop: hp(25),
    color: colors.textBlack,
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    textAlign: 'center',
  },
  introSubtitle: {
    marginTop: hp(10),
    color: colors.textBlack,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(13),
    textAlign: 'center',
  },
  textInputWrapper: {
    width: wp(310),
    height: hp(300),
    marginTop: hp(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  fullNameWrapper: {
    width: wp(310),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: hp(14),
    borderWidth: 2,
    borderColor: colors.textLight,
    width: wp(310),
    height: hp(50),
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  passwordWrapper: {
    width: wp(310),
    height: hp(50),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textLight,
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
    marginTop: hp(20),
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
    borderRadius: 20,
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
