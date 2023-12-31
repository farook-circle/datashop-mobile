import {View, Image, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import {hp} from '../config/dpTopx';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Image
          source={require('../../assets/images/logo_new.png')}
          style={styles.logoImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
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
