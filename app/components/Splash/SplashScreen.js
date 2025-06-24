import {View, Image, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import colors from '../../../assets/colors/colors';
import {hp} from '../../config/dpTopx';
import {Wave as LoadingAnimation} from 'react-native-animated-spinkit';

export const SplashScreen = () => {
  return (
    <ImageBackground
      blurRadius={10}
      source={require('../../../assets/images/datashopbg.png')}
      style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.headerWrapper}>
          <Image
            source={require('../../../assets/images/logo-no-bg.png')}
            style={styles.logoImage}
          />
        </View>
      </View>
      <LoadingAnimation color="white" size={30} style={{marginBottom: 50}} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 64,
  },
  logoImage: {margin: 5, width: hp(200), height: hp(200)},
  logoTitle: {
    color: colors.textBlack,
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
  },
});
