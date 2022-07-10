/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';

export default function ForgotPasswordRequest({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              name="chevron-left"
              size={hp(25)}
              color={colors.textBlack}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Forgot Password</Text>
          <Text>{'  '}</Text>
        </View>
      </SafeAreaView>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.titleText}>{`Forgot\nPassword?`}</Text>
        <Text style={styles.subTitleText}>
          Fill in your email below to get the password reset code
        </Text>
        <Text style={styles.emailLabel}>Your Email Address:</Text>
        <TextInput placeholder="Email Address" style={styles.emailInput} />
      </View>
      <TouchableOpacity style={styles.buttonStyle}>
        <Text style={styles.buttonText}>Send Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 25,
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(14),
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    fontSize: hp(25),
  },
  subTitleText: {
    fontFamily: 'Poppins-Regular',
    color: colors.textBlack,
    fontSize: hp(16),
  },
  emailLabel: {
    marginTop: hp(10),
    fontFamily: 'Poppins-Regular',
    color: colors.textLight,
    fontSize: hp(14),
  },
  emailInput: {
    fontFamily: 'Poppins-Regular',
    color: colors.textBlack,
    fontSize: hp(14),
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonStyle: {
    paddingVertical: hp(7),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    color: colors.textWhite,
    fontSize: hp(14),
  },
});
