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
  ImageBackground,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {hp, dp, wp} from '../config/dpTopx.js';
import colors from '../../assets/colors/colors';
import {useSelector} from 'react-redux';

import {Button, useTheme, VStack} from 'native-base';
import {ROUTES} from '../lib/routes.js';

export const WelcomeScreen = ({navigation}) => {
  const themeColors = useTheme().colors;

  const handleOpenLiveChat = () => {
    navigation.navigate(ROUTES.LIVE_CHAT_SCREEN);
  };

  return (
    <ImageBackground
      style={{flex: 1}}
      blurRadius={8}
      source={require('../../assets/images/datashopbg.png')}>
      <SafeAreaView style={styles.container}>
        <VStack
          width={'100%'}
          bgColor={'rgba(255, 255, 255, 0.8)'}
          borderRadius={'20px'}
          py={'10'}>
          <View
            style={[
              styles.logoWrapper,
              {backgroundColor: themeColors.primary[500]},
            ]}>
            <Image
              source={require('../../assets/images/logo_new.png')}
              resizeMode="contain"
              style={{width: hp(100), height: hp(100)}}
            />
          </View>
          <VStack px={'6'} space={'4'} mt={hp(40)} width={'100%'}>
            <Button
              onPress={() => navigation.navigate('Register')}
              rounded={'xl'}
              size={'lg'}
              py={'3'}>
              Login / Register
            </Button>
            <Button
              onPress={() => navigation.navigate('Login')}
              variant={'outline'}
              borderColor={colors.primary}
              rounded={'xl'}
              size={'lg'}
              _text={{fontWeight: 'bold'}}
              py={'3'}>
              Explore Without Login
            </Button>
          </VStack>

          {/*Information text */}
          <Text style={styles.infoText}>
            By proceeding, you agree to our{' '}
            <Text style={styles.textInfoLink}>Terms of Service</Text>
            {' and '}
            <Text style={styles.textInfoLink}>Privacy Policy</Text>.
          </Text>

          <TouchableOpacity
            style={styles.whatAppButton}
            onPress={handleOpenLiveChat}>
            {/* <MaterialCommunityIcons name="chat" size={hp(25)} color={colors.primary} /> */}
            <Text style={[styles.whatAppButtonText, {color: themeColors.primary[500]}]}>Contact Us</Text>
          </TouchableOpacity>
        </VStack>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  logoWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',
    borderRadius: 100,
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
    color: 'black',
  },
  textInfoLink: {
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
});
