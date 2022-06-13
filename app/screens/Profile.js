import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {wp, hp} from '../config/dpTopx';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EncryptedStorage from 'react-native-encrypted-storage';

import {useDispatch, useSelector} from 'react-redux';
import colors from '../../assets/colors/colors';
import {USER_LOGOUT} from '../redux/constants/auth';
import {changeUserPassword} from '../redux/actions/auth';

export default function Profile({navigation}) {
  const dispatch = useDispatch();

  const [changePassword, setChangePassoword] = useState(false);
  const [current_password, setCurrentPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [new_password_again, setNewPasswordAgain] = useState('');

  const user = useSelector(state => state.auth.user);
  const collaborator = useSelector(state => state.auth.collaborator);
  const isLoading = useSelector(state => state.auth.isLoading);

  const cancelPasswordChange = () => {
    setChangePassoword(!changePassword);
  };

  async function removeUserToken() {
    try {
      await EncryptedStorage.removeItem('user_session');
      await EncryptedStorage.removeItem('userPin');
      // Congrats! You've just removed your first value!
    } catch (error) {
      // There was an error on the native side
    }
    dispatch({type: USER_LOGOUT});
  }

  const handleLogout = () => {
    Alert.alert('Alert', 'Are you sure you want to log-out', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => removeUserToken()},
    ]);
  };

  const requestStatus = () => {
    alert('change password succeed');
    setChangePassoword(!changePassword);
  };

  const handleChangePassword = () => {
    if (
      current_password.length < 2 ||
      new_password.length < 2 ||
      new_password_again.length < 2
    ) {
      return;
    }
    if (new_password !== new_password_again) {
      alert('new password does not match please check');
      return;
    }
    dispatch(
      changeUserPassword({current_password, new_password}, requestStatus),
    );
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        {changePassword && (
          <>
            <TouchableOpacity
              onPress={() => setChangePassoword(!changePassword)}
              style={{
                alignSelf: 'baseline',
                marginLeft: wp(30),
                marginTop: hp(40),
              }}>
              <Feather name={'x'} size={hp(45)} color="black" />
            </TouchableOpacity>
            <Text style={styles.changePasswordText}>Change Your Password</Text>
            <TextInput
              placeholder="Your current password"
              style={styles.textInputStyle}
              secureTextEntry={true}
              value={current_password}
              onChangeText={input => setCurrentPassword(input)}
            />
            <TextInput
              placeholder="New password"
              style={styles.textInputStyle}
              secureTextEntry={true}
              value={new_password}
              onChangeText={input => setNewPassword(input)}
            />
            <TextInput
              placeholder="Re-type new password"
              style={styles.textInputStyle}
              secureTextEntry={true}
              value={new_password_again}
              onChangeText={input => setNewPasswordAgain(input)}
            />
            <TouchableOpacity
              disabled={isLoading ? true : false}
              style={[
                styles.buttonWrapper,
                {justifyContent: 'center'},
                isLoading && {backgroundColor: colors.textLight},
              ]}
              onPress={handleChangePassword}>
              {isLoading ? (
                <ActivityIndicator color={colors.secondary} size={'large'} />
              ) : (
                <Text style={[styles.buttonText, {marginLeft: 0}]}>
                  Change Password
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
        {!changePassword && (
          <>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                alignSelf: 'baseline',
                marginLeft: wp(30),
                marginTop: hp(40),
              }}>
              <Feather name={'x'} size={hp(45)} color="black" />
            </TouchableOpacity>
            <View style={styles.profileIcon}>
              <Feather name="user" color={colors.primary} size={50} />
            </View>
            <Text
              style={
                styles.userName
              }>{`${user.first_name} ${user.last_name}`}</Text>
            <Text style={styles.phoneNumber}>{`${
              user.username.split('-')[0]
            }`}</Text>
            <View style={styles.underline} />
            {collaborator && (
              <TouchableOpacity
                style={styles.buttonWrapper}
                // onPress={() => setChangePassoword(!changePassword)}
              >
                <Feather
                  name="book"
                  size={hp(25)}
                  color={colors.secondary}
                  style={{marginLeft: wp(20)}}
                />
                <Text style={styles.buttonText}>Payment Method</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={() => setChangePassoword(!changePassword)}>
              <Feather
                name="lock"
                size={hp(25)}
                color={colors.secondary}
                style={{marginLeft: wp(20)}}
              />
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleLogout}>
              <Feather
                name="log-out"
                size={hp(25)}
                color={colors.secondary}
                style={{marginLeft: wp(20)}}
              />
              <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileIcon: {
    marginTop: hp(20),
    padding: hp(40),
    borderRadius: 300,
    borderWidth: 5,
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  userName: {
    marginTop: hp(30),
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
    color: colors.textLight,
  },
  phoneNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp(25),
    color: colors.textBlack,
  },
  underline: {
    width: '80%',
    height: 1,
    backgroundColor: colors.textLight,
  },

  buttonText: {
    marginLeft: wp(20),
    fontFamily: 'Poppins-Medium',
    fontSize: hp(18),
    color: colors.textWhite,
  },
  buttonWrapper: {
    marginTop: hp(20),
    width: '80%',
    padding: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  changePasswordText: {
    marginTop: hp(70),
    fontFamily: 'Poppins-Bold',
    fontSize: hp(30),
    alignSelf: 'baseline',
    paddingLeft: wp(40),
  },
  textInputStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    padding: hp(16),
    width: '80%',
    borderWidth: 2,
    margin: 10,
    paddingHorizontal: 20,
  },
});
