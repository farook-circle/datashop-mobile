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
import {Button as NBButton, useTheme} from 'native-base';

import {USER_LOGOUT} from '../redux/constants/auth';

import {
  getDataBundle,
  getDataCategory,
  getDataPurchaseHistory,
} from '../redux/actions/data_plans';
import {
  getPaymentStatus,
  getWalletBalance,
  paymentOptionWalletBalance,
} from '../redux/actions/wallet';
import {getMessages, getNotifications} from '../redux/actions/messages';
import OverLayModel from '../components/OverLayModel';
import Button from '../components/Button';
import {
  getCableProviders,
  getElectricProviders,
  getExamProviders,
} from '../redux/actions/bill_payment';
import {getAirtimeServices} from '../redux/actions/airtime';
import {
  getCollaboratorBank,
  getCollaboratorData,
  getCollaboratorWhatsapp,
} from '../redux/actions/collaborator';
import {
  Avatar,
  Box,
  Divider,
  HStack,
  IconButton,
  Pressable,
  VStack,
} from 'native-base';
import ServiceItemCard from '../components/Dashboard/ServiceItemCard';
import HistoryItemList from '../components/History/HistoryItemList';
import {getHomepageGallery} from '../api/service.api';
import {formatCurrency} from '../utils';
import {getDataRecentContacts} from '../redux/actions/user';
import {deviceNotificationToken, displayNotification} from '../lib';
import moment from 'moment-timezone';
import {usePolling} from '../hooks';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

Array.prototype.groupBy = function (key) {
  return this.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
};

export const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const color = useTheme().colors;

  const whatsapp = useSelector(state => state.config.contact_info);
  const [refreshing, setRefreshing] = useState(false);

  const [showBalance, setShowBalance] = useState(true);

  const [messageAvailable, setMessageAvailable] = useState(true);

  const collaborator = useSelector(state => state.auth.collaborator);
  const data_purchase_history = useSelector(
    state => state.data_bundles.data_purchase_history,
  );

  const balance = useSelector(state => state.wallet.wallet_balance);
  const notifications = useSelector(state => state.messages.notifications);

  const priority_message = notifications.filter(
    item => item.priority === true,
  )[0];

  const [dashboardImage, setDashboardImages] = useState([]);

  const handleRefreshPolling = () => {
    console.log('Refreshing Polling');
  };

  const {error} = usePolling(handleRefreshPolling, 10000);

  const current_image =
    dashboardImage[Math.floor(Math.random() * (dashboardImage.length - 0)) + 0];

  useEffect(() => {
    dispatch(getDataBundle());
    dispatch(getDataPurchaseHistory());
    dispatch(getWalletBalance());
    dispatch(getMessages());
    dispatch(getNotifications());
    dispatch(getPaymentStatus());
    dispatch(getDataCategory());
    dispatch(getElectricProviders());
    dispatch(getCableProviders());
    dispatch(getExamProviders());
    dispatch(getAirtimeServices());
    dispatch(getDataRecentContacts());
    dispatch(paymentOptionWalletBalance());
    // checkIfPriorityMessage();
    handleSetMessageAvailable();
  }, [dispatch, refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const handleSetMessageAvailable = () => {};

  const handleMessages = () => {
    navigation.navigate('Messages');
  };

  const openWhatsapp = () => {
    Linking.openURL(
      'whatsapp://send?text=' + whatsapp.message + '&phone=' + whatsapp.number,
    );
  };

  const handleGetHomeScreenPic = async () => {
    const request = await getHomepageGallery();
    if (request.ok) {
      setDashboardImages(request.data);
    }
  };

  React.useEffect(() => {
    handleGetHomeScreenPic();
    deviceNotificationToken();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.secContainer}>
          <SafeAreaView />
          <View
            style={{
              marginTop: 0,
              position: 'absolute',
              width: '100%',
              height: hp(260),
              zIndex: 0,
            }}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={{
                uri: current_image,
              }}
              alt={'bgimage'}
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
              px={'1'}
              rounded={'full'}
              alignItems={'center'}
              space={'4'}>
              <Pressable onPress={openWhatsapp}>
                <MaterialCommunityIcons
                  name="whatsapp"
                  size={hp(24)}
                  color="white"
                />
              </Pressable>
              <Pressable onPress={handleMessages}>
                <Feather name="bell" size={hp(24)} color={'white'} />
                {messageAvailable && <View style={styles.dotIcon} />}
              </Pressable>
            </HStack>
          </View>

          {/* Wallet Balance Container */}
          <View style={styles.balanceContainerWrapper}>
            <Text style={styles.balanceTitle}>BALANCE:</Text>
            <HStack alignItems={'center'}>
              <Text style={styles.balanceText}>
                {showBalance ? formatCurrency(balance) : '******'}
              </Text>
              <IconButton
                rounded={'full'}
                onPress={() => setShowBalance(!showBalance)}
                icon={
                  <Feather
                    name={showBalance ? 'eye-off' : 'eye'}
                    color={'white'}
                  />
                }
              />
            </HStack>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: hp(10),
              }}>
              <HStack space={2}>
                <IconButton
                  rounded={'full'}
                  onPress={() => navigation.navigate('Deposit')}
                  bgColor={'white'}
                  icon={
                    <Feather
                      name={'plus'}
                      size={hp(20)}
                      color={colors.primary}
                    />
                  }
                  variant={'solid'}
                />
                <IconButton
                  rounded={'full'}
                  onPress={() => navigation.navigate('WalletTransferScreen')}
                  icon={<Feather name={'send'} size={hp(20)} color={'white'} />}
                  variant={'solid'}
                />
              </HStack>
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
          <NBButton
            onPress={() => navigation.navigate('History')}
            variant={'ghost'}>
            See All
          </NBButton>
        </HStack>

        <ScrollView>
          {Object.entries(
            data_purchase_history.slice(0, 5).groupBy('date'),
          ).map(([key, value]) => (
            <VStack space={'2'}>
              <Box px={'4'} mt={'2'}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: color.gray[500],
                    fontSize: hp(14),
                  }}>
                  {moment(key).format('MMMM D, YYYY')}
                </Text>
              </Box>
              <VStack space={'2'}>
                {value.map(item => (
                  <HistoryItemList
                    key={item.id}
                    item={item}
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
};

const styles = StyleSheet.create({
  secContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.primary,
    height: hp(260),
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
