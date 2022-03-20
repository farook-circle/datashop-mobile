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
} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../../assets/colors/colors';

export default function Receipt({navigation, route}) {
  const {
    amount,
    type,
    quantity,
    price,
    customer,
    date,
    time,
    transaction_ref,
    payment_method,
  } = route.params;

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
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={35} color={colors.textBlack} />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Data Plan</Text>
        </View>
      </SafeAreaView>

      <Text style={styles.subTitle}>Detail of transaction</Text>

      <View style={styles.dataBundleItemsWrapper}>
        <Image source={getPaymentTypeLogo(type)} style={styles.mtnLogoImage} />
        <Text style={styles.quantityText}>
          {quantity !== 'None' ? quantity : amount}
        </Text>
      </View>
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
        <Text style={styles.textLeft}>Transaction ID</Text>
        <Text style={styles.textRight}>#{transaction_ref}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textLeft}>Payment Method</Text>
        <Text style={styles.textRight}>{payment_method}</Text>
      </View>
      <TouchableOpacity
        style={styles.shareReceiptButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.shareReceiptText}>Share Receipt</Text>
      </TouchableOpacity>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginLeft: 93,
  },
  subTitle: {
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    fontSize: 15,
    color: colors.textLight,
  },
  dataBundleItemsWrapper: {
    marginTop: 41,
    width: 175,
    height: 159,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 15,
    marginBottom: 20,
  },
  mtnLogoImage: {
    marginTop: 25,
    width: 70,
    height: 50,
  },
  quantityText: {
    marginTop: 20,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textWhite,
  },
  priceTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: colors.textBlack,
  },
  toText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: colors.textLight,
  },
  phoneNumberText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: colors.textBlack,
  },
  detailOfTransaction: {
    marginTop: 10,
    paddingHorizontal: 30,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
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
    fontSize: 15,
    color: colors.textLight,
  },
  textRight: {
    paddingHorizontal: 30,
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: colors.textLight,
  },
  shareReceiptButton: {
    marginTop: 10,
    width: 310,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  shareReceiptText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: colors.textWhite,
    fontSize: 18,
  },
});
