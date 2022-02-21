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

import colors from '../../assets/colors/colors';
import {signUp} from '../redux/actions/auth';

export default function RegistrationScreen({navigation}) {
  const dispatch = useDispatch();

  const [eyePassword, setEyePassword] = useState(false);
  const [eyePasswordAgain, setEyePasswordAgain] = useState(false);
  const buttonStatus = useSelector(state => state.auth.isLoading);

  /* registration form */
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_again, setPasswordAgain] = useState('');

  const handlePhoneNumber = e => {
    if (Number(e) || e === '' || e === '0') {
      setPhone(e);
    }
  };

  const phoneNumberCheckUp = () => {
    if (phone.length > 1 && phone.length < 11) {
      alert(
        `please input the right phone number number that you put is ${phone.length} and phone number has to 11`,
      );
      return false;
    }
    if (phone.length < 1) {
      alert('phone should not be empty');
      return false;
    }

    if (phone.match(/0(9|8|7)(0|1)\d{8}/g) == null) {
      alert('phone number format is wrong check and try again');
      return false;
    }

    return true;
  };

  const emailCheckUp = () => {
    if (email.length < 1) {
      alert('email cannot be empty');
    }
    if (email.match(/[A-Za-z0-9\.]+@([a-z]+).com/g) == null) {
      alert('please check your email');
      return false;
    }
    return true;
  };

  const passwordCheckup = () => {
    if (password.length < 4 || password_again < 4) {
      alert('Password cannot be empty or less than 4 for your own protection');
      return false;
    }
    if (password !== password_again) {
      alert('password are not the same');
      return false;
    }
    return true;
  };
  const handleRegister = () => {
    if (first_name.length < 2 && last_name.length < 2) {
      alert('First name and last cannot be emppty or less than 2 characters');
      return;
    }
    if (!phoneNumberCheckUp()) {
      return;
    }
    if (!emailCheckUp()) {
      return;
    }
    if (!passwordCheckup()) {
      return;
    }

    const ErrorOccur = status => {
      alert(status);
    };
    const userData = {
      username: phone,
      email,
      first_name,
      last_name,
      password,
    };
    dispatch(signUp(userData, ErrorOccur));
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
        <View style={styles.textInputWrapper}>
          <View style={styles.fullNameWrapper}>
            <TextInput
              onChangeText={e => setFirstName(e)}
              value={first_name}
              placeholder="First Name"
              style={[styles.textInput, {width: 150}]}
              maxLength={30}
            />
            <TextInput
              onChangeText={e => setLastName(e)}
              value={last_name}
              placeholder="Last Name"
              style={[styles.textInput, {width: 150}]}
              maxLength={30}
            />
          </View>
          <TextInput
            onChangeText={e => handlePhoneNumber(e)}
            value={phone}
            keyboardType={'number-pad'}
            placeholder="Phone"
            style={styles.textInput}
            maxLength={11}
          />
          <TextInput
            onChangeText={e => setEmail(e)}
            value={email}
            placeholder="Email"
            style={styles.textInput}
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
                size={24}
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
          <View style={styles.passwordWrapper}>
            <TextInput
              onChangeText={e => setPasswordAgain(e)}
              value={password_again}
              secureTextEntry={eyePasswordAgain ? false : true}
              placeholder="Re-type Password"
              style={styles.textInputPassword}
            />
            {eyePasswordAgain ? (
              <Feather
                name="eye"
                size={24}
                color={'green'}
                onPress={() => setEyePasswordAgain(!eyePasswordAgain)}
                style={styles.eyeIcon}
              />
            ) : (
              <Feather
                name="eye-off"
                size={24}
                onPress={() => setEyePasswordAgain(!eyePasswordAgain)}
                color={colors.textLight}
                style={styles.eyeIcon}
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
            onPress={handleRegister}>
            {buttonStatus ? (
              <ActivityIndicator size={'large'} color={colors.primary} />
            ) : (
              <Text style={styles.registerText}>Register</Text>
            )}
          </TouchableOpacity>
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 64,
  },
  logoImage: {margin: 5},
  logoTitle: {
    color: colors.textBlack,
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
  },

  introTitle: {
    marginTop: 45,
    color: colors.textBlack,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    textAlign: 'center',
  },
  introSubtitle: {
    marginTop: 19,
    color: colors.textBlack,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    textAlign: 'center',
  },
  textInputWrapper: {
    width: 310,
    height: 300,
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  fullNameWrapper: {
    width: 310,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    borderWidth: 2,
    borderColor: colors.textLight,
    width: 310,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  passwordWrapper: {
    width: 310,
    height: 50,
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
    marginTop: 20,
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
    marginTop: 15,
    fontFamily: 'Poppins-Light',
    fontSize: 14,
  },
  textLoginLink: {
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
});
