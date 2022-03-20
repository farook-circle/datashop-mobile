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
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch, useSelector} from 'react-redux';
import {wp, hp} from '../config/dpTopx';

import colors from '../../assets/colors/colors';
import {USER_LOGOUT} from '../redux/constants/auth';
import {
  getDataBundle,
  getDataPurchaseHistory,
} from '../redux/actions/data_plans';
import {getWalletBalance} from '../redux/actions/wallet';
import {getMessages, getNotifications} from '../redux/actions/messages';

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  // const [messageAvailable, setMessageAvailable] = useState(false);
  const user = useSelector(state => state.auth.user);
  const data_bundles = useSelector(state => state.data_bundles.data_bundle);
  const data_purchase_history = useSelector(
    state => state.data_bundles.data_purchase_history,
  );
  const balance = useSelector(state => state.wallet.wallet_balance);
  const messages = useSelector(state => state.messages.messages);
  const notifications = useSelector(state => state.messages.notifications);

  useEffect(() => {
    dispatch(getDataBundle());
    dispatch(getDataPurchaseHistory());
    dispatch(getWalletBalance());
    dispatch(getMessages());
    dispatch(getNotifications());
  }, []);

  if (messages.length !== 0 || notifications.length !== 0) {
    var messageAvailable = true;
  }

  const getPaymentTypeLogo = type => {
    if (type === 'bank transfer deposit') {
      return require('../../assets/images/bank-building.png');
    } else if (type === 'data_purchase_history') {
      return require('../../assets/images/mtn_logo.png');
    } else if (type === 'card deposit') {
      return require('../../assets/images/credit-card.png');
    } else if (type === 'momo agent') {
      return require('../../assets/images/momo_logo.png');
    } else if (type === 'refund') {
      return require('../../assets/images/money-back.png');
    } else {
      return require('../../assets/images/transfer.png');
    }
  };

  async function removeUserToken() {
    try {
      await EncryptedStorage.removeItem('token');
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

  const handleMessages = () => {
    navigation.navigate('Messages');
  };

  const renderDataBundleItem = ({item}) => {
    return (
      <View style={styles.dataBundleItemsWrapper}>
        <Image
          source={require('../../assets/images/mtn_logo.png')}
          style={styles.mtnLogoImage}
        />
        <TouchableOpacity onPress={() => navigation.navigate('CheckOut', item)}>
          <View style={styles.roundIconEnter}>
            <Feather name="chevron-right" size={25} color={colors.textBlack} />
          </View>
        </TouchableOpacity>
        <Text style={styles.priceAndQuantity}>
          <Text style={{color: colors.secondary}}>{item.quantity}</Text>
          {'  '}
          {item.price}
        </Text>
      </View>
    );
  };

  const renderHistoryItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.historyItemsWrapper}
        onPress={() =>
          navigation.navigate('Receipt', {
            price: item.price,
            customer: item.customer,
            quantity: item.quantity,
            date: item.date,
            time: item.time,
            transaction_ref: item.transaction_ref,
            payment_method: item.payment_method,
          })
        }>
        <Image
          source={getPaymentTypeLogo(item.type)}
          style={styles.mtnLogoImageHistory}
        />
        <Text style={styles.receiverText}>
          {item.customer !== 'None' ? item.customer : item.type}
        </Text>

        <Text style={styles.quantityText}>
          {item.quantity !== 'None' ? item.quantity : item.amount}
        </Text>
        <View style={styles.timeAndPriceText}>
          <Text style={styles.timeText}>{item.time.slice(0, 5)}</Text>
          <Text style={styles.priceText}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={handleMessages}>
            <Feather name="message-square" size={24} color={colors.primary} />

            {messageAvailable && <View style={styles.dotIcon}></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Feather name="log-out" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* Welcome Message To User */}
      <Text style={styles.welcomeMessage}>{`Welcome ${user.first_name}`}</Text>

      {/* Wallet Balance Container */}
      <View style={styles.balanceContainerWrapper}>
        <View style={styles.balanceTextWrapper}>
          <Text style={styles.balanceTitle}>BALANCE:</Text>
          <Text style={styles.balanceText}>
            {'\u20A6'} {balance}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addMoneyButton}
          onPress={() => navigation.navigate('Deposit')}>
          <Text style={styles.addMoneyButtonTitle}>ADD MONEY</Text>
        </TouchableOpacity>
      </View>

      {/* Data Plans Container */}
      <TouchableOpacity
        style={styles.dataPlanWrapper}
        onPress={() => navigation.navigate('DataPlan')}>
        <Text style={styles.dataPlansTitle}>Data Plans</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DataPlan')}>
          <Feather name="chevron-right" size={30} color={colors.textBlack} />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.underLine} />

      {/* List of data Bundle */}
      <View style={styles.dataBundleCategoryWrapper}>
        <FlatList
          data={data_bundles}
          renderItem={renderDataBundleItem}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* History  */}
      <View style={styles.historyWrapper}>
        <TouchableOpacity
          style={styles.historyTitleWrapper}
          onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyTitle}>History</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Feather name="chevron-right" size={30} color={colors.textBlack} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.historyUnderLine} />
      </View>
      <View style={styles.historyDataWrapper}>
        <FlatList
          data={data_purchase_history}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
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
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  dotIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'red',
  },
  welcomeMessage: {
    paddingHorizontal: 25,
    marginTop: 26,
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: colors.textBlack,
  },
  balanceContainerWrapper: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    marginTop: 7,
    height: 100,
    width: 370,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  balanceTextWrapper: {
    width: 150,
    height: 60,
  },
  balanceTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.textLight,
  },
  balanceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textWhite,
  },
  addMoneyButton: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.textBlack,
  },
  addMoneyButtonTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: colors.textWhite,
  },
  dataPlanWrapper: {
    marginTop: 22,
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  dataPlansTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: colors.textBlack,
  },

  underLine: {
    height: 1,
    width: 370,
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  dataBundleCategoryWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    width: 370,
    height: 200,
    alignSelf: 'center',
    alignItems: 'center',
  },
  dataBundleItemsWrapper: {
    width: 130,
    height: 167,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 20,
    shadowColor: colors.textBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 4,
    shadowRadius: 20,
    elevation: 4,
  },
  mtnLogoImage: {
    marginTop: 25,
  },
  roundIconEnter: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.textWhite,
    shadowColor: colors.textBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 4,
    shadowRadius: 20,
    elevation: 4,
  },
  priceAndQuantity: {
    marginTop: 10,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: colors.textWhite,
    textAlign: 'center',
  },
  historyTitleWrapper: {
    marginTop: 22,
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  historyTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: colors.textBlack,
  },

  historyUnderLine: {
    height: 1,
    width: 370,
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  historyDataWrapper: {
    marginTop: 10,
    alignSelf: 'center',
    flexGrow: 1,
  },
  historyItemsWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiverWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 180,
  },
  mtnLogoImageHistory: {
    borderRadius: 0,
    width: wp(20),
    height: hp(20),
  },
  receiverText: {
    fontFamily: 'Poppins-Light',
    fontSize: 13,
  },
  quantityText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  timeAndPriceText: {},
  timeText: {
    fontFamily: 'Poppins-Light',
    fontSize: 13,
    color: colors.textLight,
  },
  priceText: {
    fontFamily: 'Poppins-Light',
    fontSize: 13,
  },
});
