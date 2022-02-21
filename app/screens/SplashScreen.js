import {View, Image, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.logoTitle}>datashop.</Text>
      </View>
    </View>
  );
}

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
  logoImage: {margin: 5},
  logoTitle: {
    color: colors.textBlack,
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
  },
});
