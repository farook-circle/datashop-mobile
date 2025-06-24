/* eslint-disable no-extend-native */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  Linking,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {wp, hp} from '../config/dpTopx';
import colors from '../../assets/colors/colors';
import {
  Actionsheet,
  Badge,
  Button,
  Card,
  Divider,
  Button as NBButton,
  useTheme,
} from 'native-base';

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

import {
  getCableProviders,
  getElectricProviders,
  getExamProviders,
} from '../redux/actions/bill_payment';
import {getAirtimeServices} from '../redux/actions/airtime';

import {Avatar, Box, HStack, IconButton, Pressable, VStack} from 'native-base';
import ServiceItemCard from '../components/Dashboard/ServiceItemCard';
import HistoryItemList from '../components/History/HistoryItemList';
import {formatCurrency} from '../utils';
import {getDataRecentContacts} from '../redux/actions/user';
import moment from 'moment-timezone';

import {useIsFocused} from '@react-navigation/native';
import {getAppDashboardWallpaper} from '../redux/actions/system';
import Clipboard from '@react-native-clipboard/clipboard';
import {BankAccountsOverlay} from '../components/BankAccountsOverlay';
import {ROUTES} from '../lib';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

Array.prototype.groupBy = function (key) {
  return this.reduce((hash, obj) => {
    if (obj[key] === undefined) {
      return hash;
    }
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
};

const POLLING_REFRESH_TIME = 10000;

export const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const color = useTheme().colors;

  const {user} = useSelector(state => state.auth);
  const {cart_items} = useSelector(state => state.wallet);
  const whatsapp = useSelector(state => state.config.contact_info);
  const [refreshing, setRefreshing] = useState(false);

  const [showBalance, setShowBalance] = useState(true);

  const [messageAvailable, setMessageAvailable] = useState(true);

  const [isAccountModelOpen, setIsAccountModelOpen] = useState(false);

  const data_purchase_history = useSelector(
    state => state.data_bundles.data_purchase_history,
  );

  const balance = useSelector(state => state.wallet.wallet_balance);

  const {dashboard_wallpaper} = useSelector(state => state.system);

  const isFocused = useIsFocused();

  const checkForTransactionUpdate = useCallback(() => {
    dispatch(getDataPurchaseHistory());
    dispatch(getWalletBalance());
  }, [dispatch]);

  const pendingTransaction = data_purchase_history
    ?.slice(0, 10)
    .find(
      item =>
        item.status?.toLowerCase() === 'pending' ||
        item?.status?.toLowerCase() === 'processing',
    );

  const handlePollUpdate = useCallback(() => {
    // call server to get the new history
    if (pendingTransaction) {
      dispatch(getWalletBalance());
      dispatch(getDataPurchaseHistory());
    }
  }, [dispatch, pendingTransaction]);

  useEffect(() => {
    let pollInterval;

    if (isFocused) {
      pollInterval = setInterval(() => {
        handlePollUpdate();
      }, POLLING_REFRESH_TIME);
    }

    return () => clearInterval(pollInterval);
  }, [isFocused, handlePollUpdate]);

  useEffect(() => {
    if (isFocused) {
      checkForTransactionUpdate();
    }
  }, [isFocused, dispatch, checkForTransactionUpdate]);

  const current_image =
    dashboard_wallpaper[
      Math.floor(Math.random() * (dashboard_wallpaper.length - 0)) + 0
    ];

  const handleReloadData = useCallback(async () => {
    if (refreshing) {
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
      dispatch(getAppDashboardWallpaper());
    }
  }, [dispatch, refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleReloadData();
    wait(2000).then(() => setRefreshing(false));
  }, [handleReloadData]);

  const handleMessages = () => {
    navigation.navigate('Messages');
  };

  const openWhatsapp = () => {
    Linking.openURL(
      'whatsapp://send?text=' + whatsapp.message + '&phone=' + whatsapp.number,
    );
  };

  const randomImages = [
    'https://picsum.photos/290/120?random=1',
    'https://picsum.photos/290/120?random=2',
    'https://picsum.photos/290/120?random=3',
  ];

  const {width: screenWidth} = Dimensions.get('window');

  const ITEM_WIDTH = screenWidth * 0.8; // 80% of screen
  const ITEM_SPACING = 10; // space between items
  const SIDE_PADDING = (screenWidth - ITEM_WIDTH) / 2;

  const handleCopyText = text => {
    Clipboard.setString(text);
    ToastAndroid.show('Copied', ToastAndroid.SHORT);
  };

  return (
    <>
      <View style={[styles.container, {backgroundColor: color.gray[50]}]}>
        {/* Header */}
        <VStack bgColor={'primary.500'}>
          <HStack
            px={'10px'}
            justifyContent={'space-between'}
            mt={'2'}
            py={'1'}>
            <VStack>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: hp(16),
                }}>
                Hi, {user?.first_name}
              </Text>
              <Pressable onPress={() => navigation.openDrawer()}>
                <MaterialCommunityIcons
                  name="menu"
                  size={hp(25)}
                  color="white"
                />
              </Pressable>
            </VStack>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                fontSize: hp(16),
              }}>
              {user?.username}
            </Text>
          </HStack>
          <HStack
            justifyContent={'flex-end'}
            space={'1'}
            px={'10px'}
            bgColor={'rgba(0,0,0,0.3)'}
            py={2}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-SemiBold',
                letterSpacing: 0.2,
                fontSize: hp(13),
                color: 'white',
              }}>
              Sic Parvis Magna yessss has atrhs and yessssssss
            </Text>
            <Pressable onPress={() => navigation.openDrawer()}>
              <MaterialCommunityIcons name="bell" size={hp(20)} color="white" />
            </Pressable>
          </HStack>
        </VStack>

        <VStack px={'10px'} bgColor={'primary.500'} py={'4'}>
          {/* Wallet Balance Container */}
          <View style={styles.balanceContainerWrapper}>
            <HStack justifyContent={'space-between'} mt={'2'}>
              <VStack>
                <HStack alignItems={'center'} space={'1'}>
                  <TouchableOpacity onPress={() => setIsAccountModelOpen(true)}>
                    <HStack alignItems={'center'}>
                      <Feather
                        name="chevron-down"
                        size={17}
                        color={'white'}
                        style={{marginBottom: 3}}
                      />
                      <Text
                        selectable={true}
                        style={[
                          styles.balanceTitle,
                          {
                            color: 'white',
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: hp(14),
                            lineHeight: hp(16),
                          },
                        ]}>
                        Opay
                      </Text>
                    </HStack>
                  </TouchableOpacity>

                  <Text
                    style={[
                      styles.balanceTitle,
                      {
                        color: 'white',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: hp(14),
                        lineHeight: hp(16),
                      },
                    ]}>
                    |
                  </Text>
                  <TouchableOpacity onPress={() => handleCopyText()}>
                    <Text
                      style={[
                        styles.balanceTitle,
                        {
                          color: 'white',
                          fontFamily: 'Poppins-SemiBold',
                          fontSize: hp(14),
                          lineHeight: hp(16),
                        },
                      ]}>
                      9066424203
                    </Text>
                  </TouchableOpacity>
                </HStack>

                <HStack alignItems={'center'} mt={'1'}>
                  <Text style={[styles.balanceText, {color: 'white'}]}>
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

                <Text
                  style={{
                    color: 'white',
                    fontSize: hp(14),
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Bonus:{' '}
                  <Text style={{color: colors.secondary}}>
                    {formatCurrency(3000)}
                  </Text>
                </Text>
              </VStack>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: hp(10),
                }}>
                <HStack space={'3'}>
                  <IconButton
                    rounded={'full'}
                    bgColor={'white'}
                    borderWidth={1}
                    size={'lg'}
                    onPress={() => navigation.navigate('Deposit')}
                    icon={
                      <Feather name={'plus'} size={hp(16)} color={'blue'} />
                    }
                    variant={'solid'}
                  />
                  <IconButton
                    rounded={'full'}
                    borderWidth={1}
                    size={'lg'}
                    onPress={() => navigation.navigate('WalletTransferScreen')}
                    icon={
                      <Feather name={'send'} size={hp(16)} color={'white'} />
                    }
                    variant={'solid'}
                  />
                </HStack>
              </View>
            </HStack>
          </View>
        </VStack>

        {/* List of data Bundle */}
        <HStack
          mt={hp(20)}
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
            name={'Billing'}
            icon={'align-justify'}
            color={colors.primary}
            onPress={() => navigation.navigate('Other')}
          />
        </HStack>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{paddingBottom: 100}}>
          <View style={{marginTop: hp(10)}}>
            <FlatList
              horizontal
              data={randomImages}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <View style={{marginHorizontal: ITEM_SPACING / 2}}>
                  <Image
                    style={{
                      width: ITEM_WIDTH,
                      height: 130,
                      borderRadius: hp(2),
                    }}
                    source={{uri: dashboard_wallpaper[0]}}
                    alt="bgimage"
                    resizeMode="stretch"
                  />
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: SIDE_PADDING,
              }}
              snapToInterval={ITEM_WIDTH + ITEM_SPACING}
              decelerationRate="fast"
              pagingEnabled={false}
            />
          </View>

          {/* Recent transaction  */}
          <TouchableOpacity
            style={{marginTop: 20}}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('History')}>
            <HStack mx={'4'} justifyContent={'space-between'} my={'2'}>
              <Text style={{color: color.primary[500]}}>Transactions</Text>
              <Feather
                name={'chevron-right'}
                size={20}
                color={color.primary[500]}
              />
            </HStack>
          </TouchableOpacity>

          {Object.entries(
            data_purchase_history.slice(0, 10).groupBy('date'),
          ).map(([key, value]) => (
            <VStack space={'2'} key={key}>
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
      <VStack position={'absolute'} bottom={10} right={5}>
        <Badge // bg="red.400"
          colorScheme="danger"
          rounded="full"
          mb={-4}
          mr={-4}
          zIndex={1}
          variant="solid"
          alignSelf="flex-end"
          _text={{
            fontSize: 12,
          }}>
          {cart_items?.length || 0}
        </Badge>
        <IconButton
          onPress={() => navigation.navigate(ROUTES.CART_SCREEN)}
          mx={{
            base: 'auto',
            md: 0,
          }}
          size={'50px'}
          icon={<Feather name={'shopping-cart'} size={20} color={'white'} />}
          variant={'solid'}
          rounded={'full'}
          p="2"
          _text={{
            fontSize: 14,
          }}
        />
      </VStack>

      <BankAccountsOverlay
        isOpen={isAccountModelOpen}
        setClose={() => setIsAccountModelOpen(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: hp(13),
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
    fontSize: hp(30),
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
