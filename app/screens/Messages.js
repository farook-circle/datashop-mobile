import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {MainLayout} from '../components';

import colors from '../../assets/colors/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {buyDataBundle} from '../redux/actions/data_plans';
import Message from '../components/Message';
import Notification from '../components/Notification';
import {hp, wp} from '../config/dpTopx';

export const Messages = ({route, navigation}) => {
  const [messageSelect, setMessageSelect] = useState(false);
  const [notificationSelect, setNotificationSelect] = useState(true);

  const handleToggleSelected = id => {
    if (id === 0) {
      setMessageSelect(false);
      setNotificationSelect(true);
      return;
    }
    setMessageSelect(true);
    setNotificationSelect(false);
  };
  return (
    <MainLayout>
      <View style={styles.container}>
        <SafeAreaView>
          {/* Header */}
          <View style={styles.headerWrapper}>
            {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={35} color={colors.primary} />
          </TouchableOpacity> */}
            <View style={styles.MessageIconWrapper}>
              <TouchableOpacity
                onPress={() => handleToggleSelected(0)}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Feather
                  name="bell"
                  size={35}
                  color={notificationSelect ? colors.primary : colors.textBlack}
                />
                <Text
                  style={[
                    styles.iconTitle,
                    notificationSelect ? {color: colors.primary} : '',
                  ]}>
                  NOTIFICATION
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleToggleSelected(1)}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Feather
                  name="message-circle"
                  size={35}
                  color={messageSelect ? colors.primary : colors.textBlack}
                />
                <Text
                  style={[
                    styles.iconTitle,
                    messageSelect ? {color: colors.primary} : '',
                  ]}>
                  MESSAGE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        {messageSelect ? <Message /> : <Notification />}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    marginTop: hp(43),
    flexDirection: 'row',
    width: wp(370),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  MessageIconWrapper: {
    marginHorizontal: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
    marginLeft: wp(93),
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: 2,
    width: wp(350),
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  bodyWrapper: {
    marginTop: hp(30),
    alignItems: 'center',
  },
  dataBundleCategoryWrapper: {
    marginTop: hp(10),
    flexDirection: 'row',
    width: wp(370),

    alignSelf: 'center',
    alignItems: 'center',
  },
  dataBundleItemsWrapper: {
    width: wp(175),
    height: hp(159),
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 15,
    marginBottom: hp(20),
  },
  mtnLogoImage: {
    marginTop: hp(25),
    width: wp(66),
    height: hp(47),
  },
  quantityText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    color: colors.secondary,
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    color: colors.textWhite,
  },
  balanceWrapper: {
    marginTop: hp(20),
    width: wp(245),
    height: hp(80),
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableBalanceText: {
    marginBottom: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(18),
    color: colors.textLight,
  },
  balanceText: {
    marginTop: 0,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(25),
    color: colors.textWhite,
  },
  textInputWrapper: {
    marginTop: hp(20),
    width: wp(310),
    height: hp(150),
    // backgroundColor: 'red',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textInput: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    borderWidth: 2,
    width: wp(310),
    height: hp(60),
    borderRadius: 20,
    paddingHorizontal: 30,
  },
  buttonsWrapper: {
    width: wp(310),
    height: hp(101),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  buyText: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
  },
  buyButton: {
    width: wp(310),
    height: hp(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 20,
  },
  noteText: {
    paddingHorizontal: 50,
    fontFamily: 'Poppins-Light',
    fontSize: hp(15),
  },
  noteTextColor: {
    color: colors.secondary,
  },
});
