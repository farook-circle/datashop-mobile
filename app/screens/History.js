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
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataPurchaseHistory} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';

export default function History({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataPurchaseHistory());
  }, []);
  const data_purchase_history = useSelector(
    state => state.data_bundles.data_purchase_history,
  );

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
            payment_method: item.payment_method,
            transaction_ref: item.transaction_ref,
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              name="chevron-left"
              size={hp(35)}
              color={colors.textBlack}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Transaction History</Text>
        </View>
        <View style={styles.headerUnderLine} />
      </SafeAreaView>

      {/* History Items */}
      <View style={styles.historyDataWrapper}>
        <FlatList
          numColumns={2}
          data={data_purchase_history}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
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
    marginTop: hp(43),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
    textAlign: 'center',
    marginLeft: wp(40),
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(2),
    width: wp(350),
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  historyDataWrapper: {
    width: '100%',
    marginTop: hp(10),
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: 25,
  },
  historyItemsWrapper: {
    width: '100%',
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
    width: wp(20),
    height: hp(20),
    borderRadius: 0,
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
