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

import colors from '../../assets/colors/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {buyDataBundle} from '../redux/actions/data_plans';
import Message from '../components/Message';
import Notification from '../components/Notification';

export default function Messages({route, navigation}) {
  const [messageSelect, setMessageSelect] = useState(true);
  const [notificationSelect, setNotificationSelect] = useState(false);

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
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.headerWrapper}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={35} color={colors.primary} />
          </TouchableOpacity> */}
          <View style={styles.MessageIconWrapper}>
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
          </View>
        </View>
      </SafeAreaView>
      {messageSelect ? <Message /> : <Notification />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    marginTop: 43,
    flexDirection: 'row',
    width: 370,
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
    fontSize: 20,
    marginLeft: 93,
  },
  headerUnderLine: {
    marginTop: 10,
    height: 2,
    width: 350,
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  bodyWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
  dataBundleCategoryWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    width: 370,

    alignSelf: 'center',
    alignItems: 'center',
  },
  dataBundleItemsWrapper: {
    width: 175,
    height: 159,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 20,
  },
  mtnLogoImage: {
    marginTop: 25,
    width: 66,
    height: 47,
  },
  quantityText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.secondary,
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textWhite,
  },
  balanceWrapper: {
    marginTop: 20,
    width: 245,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableBalanceText: {
    marginBottom: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: colors.textLight,
  },
  balanceText: {
    marginTop: 0,
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    color: colors.textWhite,
  },
  textInputWrapper: {
    marginTop: 20,
    width: 310,
    height: 150,
    // backgroundColor: 'red',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textInput: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    borderWidth: 2,
    width: 310,
    height: 60,
    borderRadius: 20,
    paddingHorizontal: 30,
  },
  buttonsWrapper: {
    width: 310,
    height: 101,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  buyText: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  buyButton: {
    width: 310,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 20,
  },
  noteText: {
    paddingHorizontal: 50,
    fontFamily: 'Poppins-Light',
    fontSize: 15,
  },
  noteTextColor: {
    color: colors.secondary,
  },
});
