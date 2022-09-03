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

  const openWhatsapp = () => {
    Linking.openURL(
      'whatsapp://send?text=' +
        `I am complaining about this transaction \n\nTransaction Details\nAgent:${
          user.username
        }\n\nDate:${date}, ${time.slice(
          0,
          5,
        )}\nTransaction Id: ${transaction_ref}\nCustomer: ${customer}\n${
          quantity === 'None' ? 'Amount' : 'Data Plan'
        }: ${
          quantity === 'None' ? amount : quantity
        }\nPayment Method: ${payment_method}\nSome other information:\n\n` +
        '&phone=' +
        whatsapp.number,
    );
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
  } = transaction;

  console.log(image);

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
            {/* Header */}
            <View style={styles.headerWrapper}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather
                  name="chevron-left"
                  size={hp(35)}
                  color={colors.textBlack}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitleText}>Receipt</Text>
            </View>
          </SafeAreaView>

          <Text style={styles.subTitle}>Detail of transaction</Text>

          <View style={styles.sectionGroup}>
            <View style={styles.dataBundleItemsWrapper}>
              <Image
                source={
                  image !== null ? {uri: image} : getPaymentTypeLogo(type)
                }
                style={styles.mtnLogoImage}
              />
              <Text style={styles.quantityText}>
                {quantity !== 'None' ? quantity : amount}
              </Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={styles.priceTitle}>
                {type === 'data_purchase_history'
                  ? `Price ${price}`
                  : `Deposited ${amount}`}
              </Text>
              <Text style={styles.toText}>
                {type === 'data_purchase_history' ? 'To' : 'Using'}
              </Text>
              <Text style={styles.phoneNumberText}>
                {customer !== 'None' ? customer : type}
              </Text>
            </View>
          </View>
          <Text style={styles.detailOfTransaction}>Detail of Transaction</Text>
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
            <Text style={styles.textLeft}>remark</Text>
            <Text style={[styles.textRight, {textAlign: 'left'}]}>
              {remark}
            </Text>
          </View>
          <View
            style={[styles.buttonGroup, {position: 'absolute', bottom: 20}]}>
            {status !== 'delivered' && (
              <TouchableOpacity
                // onPress={openWhatsapp}
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
                style={[
                  styles.shareReceiptButton,
                  {
                    borderColor: colors.secondary,
                    marginRight: wp(15),
                  },
                ]}>
                <Text style={[styles.shareReceiptText, {color: 'red'}]}>
                  Report Issue
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={async () => {
                await share({
                  title: 'Share receipt',
                  url: screenShotImage,
                });
              }}
              style={styles.shareReceiptButton}>
              <Text style={styles.shareReceiptText}>Share Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
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
    marginLeft: wp(93),
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
    paddingHorizontal: 30,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(16),
    color: colors.textBlack,
  },
  textContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textLeft: {
    paddingHorizontal: 30,
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
    fontSize: hp(15),
    color: colors.textLight,
  },
  textRight: {
    paddingHorizontal: 30,
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
    fontSize: hp(15),
    color: colors.textLight,
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
