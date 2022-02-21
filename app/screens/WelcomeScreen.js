import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';

export default function WelcomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.logoTitle}>datashop.</Text>
      </View>

      {/* illustrate Image */}
      <Image
        source={require('../../assets/images/connected_world_wuay.png')}
        style={styles.connectedWorldCanva}
      />

      {/* Intro title */}
      <Text style={styles.introTitle}>your number one datashop</Text>

      {/* Register and Login Button */}
      <View style={styles.buttonsWrapper}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/*Information text */}
      <Text style={styles.infoText}>
        by signing up you accept the{' '}
        <Text style={styles.textInfoLink}>terms of service</Text>and
        <Text style={styles.textInfoLink}>privacy policy</Text>
      </Text>
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
  connectedWorldCanva: {
    marginTop: 45,
    alignSelf: 'center',
    width: 231,
    height: 199,
  },
  introTitle: {
    marginTop: 45,
    color: colors.textBlack,
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonsWrapper: {
    marginTop: 20,
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'center',
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
  loginText: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  loginButton: {
    borderWidth: 2,
    marginTop: 20,
    paddingHorizontal: 25,
    width: 310,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  infoText: {
    marginTop: 24,
    paddingHorizontal: 50,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    fontSize: 14,
  },
  textInfoLink: {
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
});
