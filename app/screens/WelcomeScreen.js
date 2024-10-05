import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {hp, dp, wp} from '../config/dpTopx.js';
import colors from '../../assets/colors/colors';
import {useSelector} from 'react-redux';

import {Button, VStack} from 'native-base';
import {ROUTES} from '../lib/routes.js';

export const WelcomeScreen = ({navigation}) => {
  const handleOpenLiveChat = () => {
    navigation.navigate(ROUTES.LIVE_CHAT_SCREEN);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      {/* illustrate Image */}
      <Image
        source={require('../../assets/images/company_logo.jpeg')}
        style={styles.connectedWorldCanva}
      />

      <View style={styles.headerWrapper}>
        <Text style={styles.logoTitle}>datashop.</Text>
      </View>

      {/* Intro title */}
      <Text style={styles.introTitle}>your number one datashop</Text>

      {/* Register and Login Button */}
      <VStack px={'6'} space={'4'} mt={hp(40)}>
        <Button
          onPress={() => navigation.navigate('Register')}
          rounded={'xl'}
          size={'lg'}
          py={'3'}>
          Create account
        </Button>
        <Button
          onPress={() => navigation.navigate('Login')}
          variant={'outline'}
          rounded={'xl'}
          size={'lg'}
          py={'3'}>
          Login
        </Button>
      </VStack>

      {/*Information text */}
      <Text style={styles.infoText}>
        by signing up you accept the{' '}
        <Text style={styles.textInfoLink}>terms of service</Text>and
        <Text style={styles.textInfoLink}>privacy policy</Text>
      </Text>

      <TouchableOpacity
        style={styles.whatAppButton}
        onPress={handleOpenLiveChat}>
        <MaterialCommunityIcons name="chat" size={hp(25)} color={'blue'} />
        <Text style={styles.whatAppButtonText}>NEED HELP?.</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
  },
  whatAppButton: {
    marginTop: hp(5),
    alignSelf: 'center',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatAppButtonText: {
    fontFamily: 'Poppins-Medium',
    color: 'blue',
    fontSize: hp(16),
    marginLeft: wp(5),
  },
  headerWrapper: {
    width: '100%',
    height: hp(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(20),
    paddingHorizontal: wp(64),
  },
  logoImage: {margin: 5},
  logoTitle: {
    color: colors.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(36),
  },
  connectedWorldCanva: {
    marginTop: hp(46),
    alignSelf: 'center',
    width: wp(231),
    height: hp(239),
  },
  introTitle: {
    marginTop: hp(25),
    color: colors.textBlack,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(20),
    textAlign: 'center',
  },
  buttonsWrapper: {
    marginTop: hp(20),
    height: hp(150),
    justifyContent: 'space-between',
    alignItems: 'center',
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
  loginText: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
  },
  loginButton: {
    borderWidth: 2,
    marginTop: hp(20),
    paddingHorizontal: 25,
    width: wp(310),
    height: hp(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  infoText: {
    marginTop: 10,
    paddingHorizontal: wp(50),
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    fontSize: hp(14),
  },
  textInfoLink: {
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
});
