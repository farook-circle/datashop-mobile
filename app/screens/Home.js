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
  Alert,
  RefreshControl,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {wp, hp} from '../config/dpTopx';
import colors from '../../assets/colors/colors';
import {USER_LOGOUT} from '../redux/constants/auth';
import {
  getDataBundle,
  getDataCategory,
  getDataPurchaseHistory,
} from '../redux/actions/data_plans';
import {getPaymentStatus, getWalletBalance} from '../redux/actions/wallet';
import {getMessages, getNotifications} from '../redux/actions/messages';
import OverLayModel from '../components/OverLayModel';
import Button from '../components/Button';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const [showMessage, setShowMessage] = useState(true);

  const whatsapp = useSelector(state => state.config.contact_info);
  const [refreshing, setRefreshing] = useState(false);

  const [messageAvailable, setMessageAvailable] = useState(true);
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
    dispatch(getPaymentStatus());
    dispatch(getDataCategory());

    handleSetMessageAvailable();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

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

  const handleSetMessageAvailable = () => {};

  const handleMessages = () => {
    navigation.navigate('Messages');
  };

  const openWhatsapp = () => {
    Linking.openURL(
      'whatsapp://send?text=' + whatsapp.message + '&phone=' + whatsapp.number,
    );
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
            <Feather
              name="chevron-right"
              size={hp(25)}
              color={colors.textBlack}
            />
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
            amount: item.amount,
            type: item.type,
            price: item.price,
            customer: item.customer,
            quantity: item.quantity,
            date: item.date,
            time: item.time,
            transaction_ref: item.transaction_ref,
            payment_method: item.payment_method,
            remark: item.remark,
            status: item.status,
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
    <>
      {showMessage && (
        <OverLayModel onOverlayPress={() => setShowMessage(false)}>
          <View
            style={{
              width: wp(250),
              height: wp(200),
              padding: 20,
              backgroundColor: colors.textWhite,
              borderRadius: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 20,
                color: 'red',
              }}>
              Hello world
            </Text>
            <Text style={{fontFamily: 'Poppins-Regular', fontSize: hp(13)}}>
              This is the message content this is the message content this is
              the message content this is the message content This is the
              message content this is the
            </Text>
            <Button
              text={'close'}
              buttonStyle={{marginTop: 10, width: 100, height: 30}}
            />
          </View>
        </OverLayModel>
      )}
      <View
        style={styles.container}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <ScrollView
          style={{
            position: 'absolute',
            top: 0,
            height: hp(700),
            width: '100%',
            // backgroundColor: 'red',
            zIndex: -1,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <SafeAreaView>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={handleMessages}>
                <Feather
                  name="message-square"
                  size={hp(24)}
                  color={colors.primary}
                />

                {messageAvailable && <View style={styles.dotIcon} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: hp(20)}}
                onPress={openWhatsapp}>
                <MaterialCommunityIcons
                  name="whatsapp"
                  size={hp(24)}
                  color="green"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{
                backgroundColor: colors.textLight,
                padding: hp(10),
                borderRadius: 50,
              }}>
              <Feather name="user" size={hp(28)} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        {/* Welcome Message To User */}

        <Text
          style={styles.welcomeMessage}>{`Welcome ${user.first_name}`}</Text>

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
        <TouchableOpacity style={styles.dataPlanWrapper}>
          <Text style={styles.dataPlansTitle}>Services</Text>
          <TouchableOpacity
          // onPress={() => navigation.navigate('DataPlan')}
          >
            <Feather
              name="chevron-right"
              size={hp(25)}
              color={colors.textBlack}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.underLine} />

        {/* List of data Bundle */}
        <View style={styles.dataBundleCategoryWrapper}>
          <View style={styles.serviceContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DataCategory')}
              activeOpacity={0.8}
              style={[styles.serviceBox]}>
              <FontAwesome name="globe" color={'white'} size={27} />
            </TouchableOpacity>
            <Text style={styles.serviceTitle}>Data</Text>
          </View>

          <View style={styles.serviceContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.serviceBox, {backgroundColor: '#524F45'}]}>
              <FontAwesome name="phone" color={'white'} size={27} />
            </TouchableOpacity>
            <Text style={styles.serviceTitle}>Airtime</Text>
          </View>

          <View style={styles.serviceContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.serviceBox, {backgroundColor: colors.primary}]}>
              <FontAwesome name="align-justify" color={'white'} size={27} />
            </TouchableOpacity>
            <Text style={styles.serviceTitle}>Bill Payment</Text>
          </View>

          {/* <FlatList
            data={data_bundles}
            renderItem={renderDataBundleItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          /> */}
        </View>

        {/* History  */}
        <View style={styles.historyWrapper}>
          <TouchableOpacity
            style={styles.historyTitleWrapper}
            onPress={() => navigation.navigate('History')}>
            <Text style={styles.historyTitle}>History</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Feather
                name="chevron-right"
                size={hp(30)}
                color={colors.textBlack}
              />
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
    </>
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
    height: hp(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  dotIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: wp(10),
    height: hp(10),
    borderRadius: 50,
    backgroundColor: 'red',
  },
  welcomeMessage: {
    paddingHorizontal: 25,
    marginTop: hp(26),
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
    color: colors.textBlack,
  },
  balanceContainerWrapper: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    marginTop: hp(7),
    height: hp(100),
    width: wp(330),
    backgroundColor: colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  balanceTextWrapper: {
    width: wp(150),
    height: hp(60),
  },
  balanceTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    color: colors.textLight,
  },
  balanceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    color: colors.textWhite,
  },
  addMoneyButton: {
    width: wp(100),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.textBlack,
  },
  addMoneyButtonTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(10),
    color: colors.textWhite,
  },
  dataPlanWrapper: {
    marginTop: hp(22),
    width: '100%',
    height: hp(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  dataPlansTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
  },

  underLine: {
    height: 1,
    width: wp(370),
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  dataBundleCategoryWrapper: {
    marginTop: hp(10),
    flexDirection: 'row',
    width: '100%',
    // height: hp(200),
    paddingHorizontal: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  serviceContainer: {
    marginTop: hp(20),
    alignItems: 'center',
  },
  serviceBox: {
    width: wp(100),
    height: hp(100),
    backgroundColor: '#FCC60D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  serviceTitle: {
    marginTop: hp(10),
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
  },
  dataBundleItemsWrapper: {
    width: wp(130),
    height: hp(167),
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: wp(20),
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
    marginTop: hp(25),
  },
  roundIconEnter: {
    marginTop: hp(10),
    width: wp(40),
    height: hp(40),
    borderRadius: 10,
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
    marginTop: hp(10),
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(15),
    color: colors.textWhite,
    textAlign: 'center',
  },
  historyTitleWrapper: {
    marginTop: hp(22),
    width: '100%',
    height: hp(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  historyTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
  },

  historyUnderLine: {
    height: 1,
    width: wp(370),
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  historyDataWrapper: {
    marginTop: hp(10),
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: wp(20),
  },
  historyItemsWrapper: {
    width: '100%',
    marginBottom: hp(13),
    borderBottomWidth: 1,
    borderColor: colors.textLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiverWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(180),
  },
  mtnLogoImageHistory: {
    borderRadius: 0,
    width: wp(20),
    height: hp(20),
  },
  receiverText: {
    fontFamily: 'Poppins-Light',
    fontSize: hp(13),
  },
  quantityText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(13),
  },
  timeAndPriceText: {},
  timeText: {
    fontFamily: 'Poppins-Light',
    fontSize: hp(13),
    color: colors.textLight,
  },
  priceText: {
    fontFamily: 'Poppins-Light',
    fontSize: hp(13),
  },
});
