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
  Linking,
} from 'react-native';

import Share from 'react-native-share';

import React, {useEffect, useRef, useState} from 'react';
import ViewShot from 'react-native-view-shot';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../assets/colors/colors';
import {hp, wp} from '../config/dpTopx';
import {useSelector} from 'react-redux';
import {
  Avatar,
  Button,
  HStack,
  IconButton,
  Pressable,
  VStack,
} from 'native-base';

const url = 'https://awesome.contents.com/';
const title = 'Awesome Contents';
const message = 'Please check this out.';

const options = {
  title,
  url,
  message,
};

export default function Receipt({navigation, route}) {
  const viewShotRef = useRef();
  const whatsapp = useSelector(state => state.config.contact_info);
  const user = useSelector(state => state.auth.user);

  const [show, setShow] = useState(false);
  const [screenShotImage, setScreenShotImage] = useState(null);

  useEffect(() => {
    takeScreenShot();
  }, []);

  const takeScreenShot = () => {
    setShow(true);
    viewShotRef.current.capture().then(uri => {
      setScreenShotImage(uri);
    });
  };

  const share = async (customOptions = options) => {
    try {
      await Share.open(customOptions);
    } catch (err) {
      //
    }
  };

  const {transaction} = route.params;

  const {
    amount,
    type,
    image,
    quantity,
    price,
    customer,
    date,
    time,
    transaction_ref,
    payment_method,
    remark,
    status,
    balance_before,
    balance_after,
  } = transaction;

  const monthToString = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return (
    <>
      {
        <ViewShot
          style={styles.receiptContainer}
          ref={viewShotRef}
          options={{format: 'png', quality: 1}}>
          <Image
            source={require('../../assets/images/company_logo.jpeg')}
            style={styles.companyLogo}
          />
          <Text style={styles.receiptTextHeader}>Transaction Details</Text>
          <View style={styles.underline} />
          <Text style={styles.receiptAgent}>Agent Number: {user.username}</Text>
          <View style={styles.detailsWrapper}>
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailText}>
                {quantity === 'None' ? 'Deposited to:' : 'Send Data To:'}{' '}
              </Text>
              <Text style={styles.detailText}>
                {quantity === 'None' ? 'wallet' : customer}
              </Text>
            </View>
            <View style={styles.underline} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailText}>
                {quantity === 'None' ? 'Amount' : 'Quantity:'}{' '}
              </Text>
              <Text style={styles.detailText}>
                {quantity === 'None' ? amount : quantity}
              </Text>
            </View>

            <View style={styles.underline} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailText}>Status: </Text>
              <Text style={styles.detailText}>{status}</Text>
            </View>

            <View style={styles.underline} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailText}>Date: </Text>
              <Text style={styles.detailText}>
                {date} {time.slice(0, 5)}
              </Text>
            </View>

            <View style={styles.underline} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailText}>Payment Method: </Text>
              <Text style={styles.detailText}>{payment_method}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>Balance Before</Text>
              <Text style={styles.textRight}>{balance_before || 'None'}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>Balance After</Text>
              <Text style={styles.textRight}>{balance_after || 'None'}</Text>
            </View>

            <View style={styles.underline} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailText}>Transaction ID: </Text>
              <Text style={styles.detailText}>{transaction_ref}</Text>
            </View>
            <View style={styles.underline} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailText}>Remark: </Text>
              <Text style={styles.detailText}>{remark}</Text>
            </View>
          </View>
        </ViewShot>
      }
      {
        <View style={styles.container}>
          <SafeAreaView>
            <HStack
              alignItems={'center'}
              justifyContent={'space-between'}
              pr={'4'}>
              <IconButton
                onPress={() => navigation.goBack()}
                rounded={'full'}
                icon={
                  <Feather
                    name="chevron-left"
                    size={hp(30)}
                    color={colors.textBlack}
                  />
                }
              />
              <VStack alignItems={'center'}>
                <Text style={styles.headerTitleText}>Receipt</Text>
                <Text style={styles.subTitle}>Detail of transaction</Text>
              </VStack>
              <Button
                size={'sm'}
                onPress={async () => {
                  await share({
                    title: 'Share receipt',
                    url: screenShotImage,
                  });
                }}>
                Share
              </Button>
            </HStack>
          </SafeAreaView>

          <VStack
            space={'2'}
            alignItems={'center'}
            bgColor={'white'}
            roundedTop={'2xl'}
            pt={'10'}>
            <Avatar size={'xl'} bgColor={'primary.100'}>
              <Avatar size={'md'} source={{uri: image}} />
            </Avatar>
            <VStack space={'2'} alignItems={'center'}>
              <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
                {customer}
              </Text>
              <Text style={{fontFamily: 'Poppins-Light', fontSize: hp(15)}}>
                Received
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  color: colors.primary,
                  fontSize: hp(28),
                }}>
                {quantity !== 'None' ? quantity : amount}
              </Text>
            </VStack>
          </VStack>

          <View style={{paddingHorizontal: hp(10), backgroundColor: 'white'}}>
            <Text style={styles.detailOfTransaction}>
              Detail of Transaction
            </Text>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>Date</Text>
              <Text style={styles.textRight}>
                {date.slice(8, 10)} {monthToString[Number(date.slice(5, 7))]}{' '}
                {date.slice(0, 4)} - {time.slice(0, 5)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>To</Text>
              <Text style={styles.textRight}>
                {customer !== 'None' ? customer : 'Wallet'}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>Status</Text>
              <Text style={styles.textRight}>{status}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>Transaction ID</Text>
              <Text style={styles.textRight}>#{transaction_ref}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>Payment Method</Text>
              <Text style={styles.textRight}>{payment_method}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>Balance Before</Text>
              <Text style={styles.textRight}>{balance_before || 'None'}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>Balance After</Text>
              <Text style={styles.textRight}>{balance_after || 'None'}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textLeft}>remark</Text>
              <Text
                style={[styles.textRight, {textAlign: 'left'}]}
                numberOfLines={1}>
                {remark}
              </Text>
            </View>
          </View>
          <VStack px={'6'} space={'2'} pt={'3'} bgColor={'white'}>
            <Button
              onPress={() =>
                navigation.navigate('Complain', {
                  amount,
                  type,
                  quantity,
                  price,
                  customer,
                  date,
                  time,
                  transaction_ref,
                  payment_method,
                  remark,
                  status,
                })
              }
              rounded={'lg'}
              colorScheme={'red'}>
              Report issue
            </Button>
            <Button rounded={'lg'}>Save Contact</Button>
          </VStack>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'rgb(250,250,250)',
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
  },
  subTitle: {
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    fontSize: hp(14),
    color: colors.textLight,
  },
  sectionGroup: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 25,
  },
  dataBundleItemsWrapper: {
    marginTop: hp(41),
    width: wp(100),
    height: hp(130),
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 15,
    marginBottom: hp(20),
  },
  mtnLogoImage: {
    marginTop: hp(25),
    width: wp(70),
    height: hp(50),
  },
  quantityText: {
    marginTop: hp(20),
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    color: colors.textWhite,
  },
  priceTitle: {
    marginTop: hp(10),
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
    color: colors.textBlack,
  },
  toText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: hp(20),
    color: colors.textLight,
  },
  phoneNumberText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: hp(20),
    color: colors.textBlack,
  },
  detailOfTransaction: {
    marginTop: hp(10),
    paddingHorizontal: 25,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
  },
  textContainer: {
    marginTop: 10,
    paddingHorizontal: wp(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textLeft: {
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
    fontSize: hp(13),
    color: colors.textLight,
  },
  textRight: {
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
    fontSize: hp(13),
    marginLeft: wp(10),
    color: colors.textBlack,
  },
  shareReceiptButton: {
    marginTop: hp(19),
    flex: 1,
    height: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
  },

  shareReceiptText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
    fontSize: hp(15),
  },
  buttonGroup: {
    // backgroundColor: 'red',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },

  receiptContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 25,
    position: 'absolute',
    zIndex: -99,
  },
  companyLogo: {
    marginTop: hp(80),
    width: wp(200),
    height: hp(200),
  },
  receiptTextHeader: {
    marginTop: hp(20),
    fontFamily: 'Poppins-Bold',
    color: colors.textBlack,
    fontSize: hp(20),
  },
  receiptAgent: {
    marginTop: hp(10),
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
    fontSize: hp(20),
  },

  underline: {
    width: '100%',
    height: 2,
    backgroundColor: colors.textLight,
  },
  detailsWrapper: {
    backgroundColor: '#9d9d9d',
    borderRadius: 10,
    width: '100%',
    padding: 20,
    marginTop: hp(20),
  },
  detailTextWrapper: {
    marginVertical: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    color: colors.textWhite,
  },
});
