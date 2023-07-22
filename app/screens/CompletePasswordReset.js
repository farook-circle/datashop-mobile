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
import {Button} from 'native-base';
import {completeUserPasswordReset} from '../api/auth.api';

export default function CompletePasswordReset({navigation, route}) {
  const dispatch = useDispatch();

  const [new_password, setNewPassword] = React.useState('');
  const [confirm_new_password, setConfirmNewPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const data = route.params.data;

  const handleResetUserPassword = async () => {
    // validate phone phone number
    if (
      !new_password ||
      !confirm_new_password ||
      new_password !== confirm_new_password
    ) {
      alert('Password are not the same');
      return;
    }

    setLoading(true);
    const payload = {
      ...data,
      new_password,
    };
    const request = await completeUserPasswordReset(payload);
    if (request.ok) {
      alert(
        'You have successfully change your password you can now login with your new password',
      );
      navigation.navigate('Login');
      setLoading(false);
      return;
    }

    alert(
      request.data ? request.data.message : 'Unable to complete your request',
    );
    setLoading(false);
  };

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
          <Text style={styles.headerTitleText}>Reset Password</Text>
          <Text>{'  '}</Text>
        </View>
      </SafeAreaView>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.titleText}>{`Create New\nPassword`}</Text>
        <Text style={styles.subTitleText}>
          Create a new strong password for your account
        </Text>
        <Text style={styles.emailLabel}>Your Account phone number:</Text>
        <TextInput
          value={new_password}
          placeholder="New Password"
          style={styles.emailInput}
          onChangeText={text => setNewPassword(text)}
          secureTextEntry={true}
        />
        <TextInput
          value={confirm_new_password}
          placeholder="Confirm New Password"
          style={styles.emailInput}
          onChangeText={text => setConfirmNewPassword(text)}
          secureTextEntry={true}
        />
      </View>
      <Button mb="4" onPress={handleResetUserPassword} isLoading={loading}>
        Change password
      </Button>
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
    marginTop: hp(15),
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
