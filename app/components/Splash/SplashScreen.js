import {View, Image, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import colors from '../../../assets/colors/colors';
import {hp} from '../../config/dpTopx';
import {Wave as LoadingAnimation} from 'react-native-animated-spinkit';

export const SplashScreen = () => {
  return (
    <ImageBackground
      blurRadius={10}
      source={{
        uri: 'https://plus.unsplash.com/premium_photo-1701791988754-d200cc1b78c7?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      }}
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
