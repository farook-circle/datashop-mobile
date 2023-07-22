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

Array.prototype.groupBy = function (key) {
  return this.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
};

import {
  getDataBundle,
  getDataCategory,
  getDataPurchaseHistory,
} from '../redux/actions/data_plans';
import {getPaymentStatus, getWalletBalance} from '../redux/actions/wallet';
import {getMessages, getNotifications} from '../redux/actions/messages';
import OverLayModel from '../components/OverLayModel';
import Button from '../components/Button';
import {getElectricProviders} from '../redux/actions/bill_payment';
import {getAirtimeServices} from '../redux/actions/airtime';
import {
  getCollaboratorBank,
  getCollaboratorData,
  getCollaboratorWhatsapp,
} from '../redux/actions/collaborator';
import {Avatar, Box, Divider, HStack, Pressable, VStack} from 'native-base';
import ServiceItemCard from '../components/Dashboard/ServiceItemCard';
import HistoryItemList from '../components/History/HistoryItemList';
import {getHomepageGallery} from '../api/service.api';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function Home({navigation}) {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);

  const whatsapp = useSelector(state => state.config.contact_info);
  const [refreshing, setRefreshing] = useState(false);
  // const [priority_message, setPriorityMessage] = useState(null);
  const [dashPic, setDashPic] = React.useState([]);

  const [messageAvailable, setMessageAvailable] = useState(true);
  const user = useSelector(state => state.auth.user);

  const collaborator = useSelector(state => state.auth.collaborator);
  const data_bundles = useSelector(state => state.data_bundles.data_bundle);
  const data_purchase_history = useSelector(
    state => state.data_bundles.data_purchase_history,
  );

  const balance = useSelector(state => state.wallet.wallet_balance);
  const messages = useSelector(state => state.messages.messages);
  const notifications = useSelector(state => state.messages.notifications);

  const collaborator_whatsapp = useSelector(
    state => state.collaborator.collaborator_whatsapp,
  );

  const priority_message = notifications.filter(
    item => item.priority === true,
  )[0];

  const [popUpMessage, setPopUpMessage] = useState(priority_message);

  useEffect(() => {
    dispatch(getDataBundle());
    dispatch(getDataPurchaseHistory());
    dispatch(getWalletBalance());
    dispatch(getMessages());
    dispatch(getNotifications());
    dispatch(getPaymentStatus());
    dispatch(getDataCategory());
    dispatch(getElectricProviders());
    dispatch(getAirtimeServices());

    // checkIfPriorityMessage();

    handleSetMessageAvailable();
  }, [dispatch, refreshing]);

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

  const handleSortByData = () => {
    console.log('Hello world');
  };

  const renderHistoryItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.historyItemsWrapper}
        onPress={() => navigation.navigate('Receipt', {transaction: item})}>
        <Image
          source={
            item.image !== null
              ? {uri: item.image}
              : getPaymentTypeLogo(item.type)
          }
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

  const handleGetHomeScreenPic = async () => {
    const request = await getHomepageGallery();
    if (request.ok) {
      setDashPic(request.data);
    }
  };

  React.useEffect(() => {
    handleGetHomeScreenPic();
  }, []);

  return (
    <>
      {/* {popUpMessage && (
          <OverLayModel>
            <View
              style={{
                width: wp(250),
                height: wp(200),
                padding: 20,
                backgroundColor: colors.textWhite,
                alignItems: 'center',
                borderRadius: 20,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 20,
                    color: 'red',
                  }}>
                  {priority_message.title}
                </Text>
                <Text style={{fontFamily: 'Poppins-Regular', fontSize: hp(14)}}>
                  {priority_message.notification}
                </Text>
              </View>
              <Button
                onPress={() => setPopUpMessage(null)}
                text={'close'}
                buttonStyle={{marginTop: 10, width: 100, height: 30}}
              />
            </View>
          </OverLayModel>
        )} */}

      <View
        style={styles.container}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <View style={styles.secContainer}>
          <View
            style={{
              marginTop: 0,
              position: 'absolute',
              width: '100%',
              height: hp(240),
              zIndex: 0,
            }}>
            <FlatList
              data={[{id: '1'}]}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              renderItem={({item}) => (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'red',
                  }}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={{
                      uri: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
                    }}
                    alt={'bgimage'}
                  />
                </View>
              )}
            />
          </View>
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
          {/* Header */}
          <View style={styles.headerWrapper}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Pressable onPress={() => navigation.openDrawer()}>
                <Avatar size={'sm'} bgColor={'rgba(0,0,0,0.5)'}>
                  <Feather name="menu" size={hp(20)} color={'white'} />
                </Avatar>
              </Pressable>
            </View>
            <HStack
              bgColor={'rgba(0,0,0,0.5)'}
              p={'2'}
              rounded={'full'}
              alignItems={'center'}
              space={'2'}>
              <Pressable onPress={openWhatsapp}>
                <MaterialCommunityIcons
                  name="whatsapp"
                  size={hp(24)}
                  color="white"
                />
              </Pressable>
              <Pressable onPress={handleMessages}>
                <Feather name="message-circle" size={hp(24)} color={'white'} />
                {messageAvailable && <View style={styles.dotIcon} />}
              </Pressable>

              {/* <Pressable onPress={() => navigation.navigate('Profile')}>
                  <Avatar size={'sm'} bgColor={'white'}>
                    <Feather name="user" size={hp(20)} color={colors.primary} />
                  </Avatar>
                </Pressable> */}
            </HStack>
          </View>

          {/* Wallet Balance Container */}
          <View style={styles.balanceContainerWrapper}>
            <Text style={styles.balanceTitle}>BALANCE:</Text>
            <Text style={styles.balanceText}>
              {'\u20A6'} {balance}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: hp(20),
              }}>
              <TouchableOpacity
                style={[styles.buttonStyle, {marginRight: wp(8)}]}
                onPress={() => navigation.navigate('Deposit')}>
                <Text style={styles.buttonTitle}>ADD FUND</Text>
              </TouchableOpacity>
              {collaborator && (
                <TouchableOpacity
                  style={[styles.buttonStyle, {backgroundColor: '#E53429'}]}
                  onPress={() => navigation.navigate('Withdraw')}>
                  <Text style={styles.buttonTitle}>WITHDRAW</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.underLine} />

        {/* List of data Bundle */}
        <HStack
          pt={'6'}
          pb={'3'}
          px={'4'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <ServiceItemCard
            name={'Data'}
            icon={'globe'}
            color={'#FCC60D'}
            onPress={() => navigation.navigate('DataCategory')}
          />
          <ServiceItemCard
            name={'Airtime'}
            icon={'phone'}
            color={'#524F45'}
            onPress={() => navigation.navigate('Airtime')}
          />
          <ServiceItemCard
            name={'More'}
            icon={'align-justify'}
            color={colors.primary}
            onPress={() => navigation.navigate('Other')}
          />
        </HStack>

        <HStack
          alignItems={'center'}
          justifyContent={'space-between'}
          py={'3'}
          px={'5'}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              color: 'black',
              fontSize: hp(18),
            }}>
            History
          </Text>
          <Pressable onPress={() => navigation.navigate('History')}>
            <Text>See all</Text>
          </Pressable>
        </HStack>
        <ScrollView>
          {Object.entries(
            data_purchase_history.slice(0, 5).groupBy('date'),
          ).map(([key, value]) => (
            <VStack space={'3'}>
              <Box px={'6'} bgColor={'primary.200'} py={'2'}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: 'black',
                    fontSize: hp(18),
                  }}>
                  {new Date(key).toDateString()}
                </Text>
              </Box>
              <VStack space={'3'}>
                {value.map((item, index) => (
                  <HistoryItemList
                    avatar={item.image}
                    name={item.customer}
                    time={item.time.slice(0, 5)}
                    amount={item.quantity}
                    key={item.id}
                    status={item.status}
                    onPress={() =>
                      navigation.navigate('Receipt', {transaction: item})
                    }
                  />
                ))}
              </VStack>
            </VStack>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  secContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
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
    // flexDirection: 'row',
    marginTop: hp(30),
    width: '100%',
  },
  balanceTextWrapper: {
    width: wp(150),
    height: hp(60),
  },
  balanceTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(14),
    color: colors.textLight,
  },
  balanceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    color: colors.textWhite,
  },
  buttonStyle: {
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.textBlack,
  },
  buttonTitle: {
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
