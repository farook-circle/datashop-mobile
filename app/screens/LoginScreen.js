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
import {signIn} from '../redux/actions/auth';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {hp} from '../config/dpTopx';

export default function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const [eyePassword, setEyePassword] = useState(false);
  const buttonStatus = useSelector(state => state.auth.isLoading);

  /* sign in form */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlePhoneNumber = e => {
    if (Number(e) || e === '' || e === '0') {
      setUsername(e);
    }
  };
  const checkUsername = () => {
    if (username.length > 1 && username.length < 11) {
      alert(
        `please input the right phone number number that you put is ${username.length} and phone number has to 11`,
      );
      return false;
    }
    if (username.length < 1) {
      alert('phone should not be empty');
      return false;
    }

    if (username.match(/0(9|8|7)(0|1)\d{8}/g) == null) {
      alert('phone number format is wrong check and try again');
      return false;
    }

    return true;
  };
  const checkPassword = () => {
    if (password === '') {
      alert('password cannot be empty');
      return false;
    }
    return true;
  };

  const ErrorOccur = status => {
    alert(status);
  };
  const logIn = () => {
    if (!checkUsername()) {
      return;
    }
    if (!checkPassword()) {
      return;
    }

    dispatch(signIn({username, password}, ErrorOccur));
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
        {/* illustrate Image */}
        <Image
          source={require('../../assets/images/mobile_login.png')}
          style={styles.illustratedImage}
        />
        {/* Welcome onboard message and subtitle */}
        <Text style={styles.introTitle}>Welcome Back!</Text>

        {/* Registration Form and button wrapper */}
        <View style={styles.textInputWrapper}>
          <TextInput
            placeholder="Phone Number"
            style={styles.textInput}
            onChangeText={e => handlePhoneNumber(e)}
            keyboardType={'numeric'}
            maxLength={11}
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              onChangeText={e => setPassword(e)}
              value={password}
              secureTextEntry={eyePassword ? false : true}
              placeholder="Password"
              style={styles.textInputPassword}
            />
            {eyePassword ? (
              <Feather
                name="eye"
                size={hp(24)}
                color={'green'}
                style={styles.eyeIcon}
                onPress={() => setEyePassword(!eyePassword)}
              />
            ) : (
              <Feather
                name="eye-off"
                size={24}
                color={colors.textLight}
                style={styles.eyeIcon}
                onPress={() => setEyePassword(!eyePassword)}
              />
            )}
          </View>
        </View>

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={[
              styles.registerButton,
              buttonStatus
                ? {
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: colors.primary,
                  }
                : '',
            ]}
            onPress={logIn}>
            {buttonStatus ? (
              <ActivityIndicator size={'large'} color={colors.primary} />
            ) : (
              <Text style={styles.registerText}>Login</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.textLogin}>
            Don't have an acount?{' '}
            <Text
              style={styles.textLoginLink}
              onPress={() => navigation.navigate('Register')}>
              Register.
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 109,
    paddingHorizontal: 64,
  },
  logoImage: {margin: 5},
  logoTitle: {
    color: colors.textBlack,
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
  },
  illustratedImage: {
    marginTop: 45,
    alignSelf: 'center',
    width: 231,
    height: 199,
  },

  introTitle: {
    marginTop: 30,
    color: colors.textBlack,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    paddingHorizontal: 60,
  },
  textInputWrapper: {
    width: 310,
    height: 150,
    // backgroundColor: 'red',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textInput: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    borderWidth: 2,
    // borderColor: colors.textLight,
    width: 310,
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  passwordWrapper: {
    width: 310,
    height: 60,
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
    fontSize: 16,
    height: 60,
    paddingHorizontal: 30,
    flex: 1,
  },
  eyeIcon: {
    paddingRight: 20,
  },
  buttonsWrapper: {
    width: 310,
    height: 101,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },

  registerText: {
    color: colors.textWhite,
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  registerButton: {
    width: 310,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
  },

  textLogin: {
    alignSelf: 'flex-start',
    marginTop: 14,
    fontFamily: 'Poppins-Light',
    fontSize: 14,
  },
  textLoginLink: {
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
});
