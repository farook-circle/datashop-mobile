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

export default function History({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataPurchaseHistory());
  }, []);
  const data_purchase_history = useSelector(
    state => state.data_bundles.data_purchase_history,
  );

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
            payment_method: item.payment_method,
            transaction_ref: item.transaction_ref,
          })
        }>
        <View style={styles.receiverWrapper}>
          <Image
            source={require('../../assets/images/mtn_logo.png')}
            style={styles.mtnLogoImageHistory}
          />
          <Text style={styles.receiverText}>{item.customer}</Text>
        </View>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <View style={styles.timeAndPriceText}>
          {/* <Text style={styles.priceText}>{item.price}</Text> */}
          <Text style={styles.timeText}>{item.time.slice(0, 5)}</Text>
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
            <Feather name="chevron-left" size={35} color={colors.textBlack} />
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
    textAlign: 'center',
    marginLeft: 40,
  },
  headerUnderLine: {
    marginTop: 10,
    height: 2,
    width: 350,
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  historyDataWrapper: {
    width: 350,
    marginTop: 10,
    alignSelf: 'center',
    flexGrow: 1,
  },
  historyItemsWrapper: {
    width: 350,
    height: '100%',
    marginBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  receiverWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 180,
  },
  mtnLogoImageHistory: {
    borderRadius: 10,
  },
  receiverText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  quantityText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  timeAndPriceText: {},
  timeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: colors.textLight,
  },
  priceText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
});
