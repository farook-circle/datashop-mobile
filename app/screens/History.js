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
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {VStack, Box} from 'native-base';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataPurchaseHistory} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import HistoryItemList from '../components/History/HistoryItemList';

export const History = ({navigation}) => {
  const dispatch = useDispatch();

  const data_purchase_history = useSelector(
    state => state.data_bundles.data_purchase_history,
  );

  const [searchValue, setSearchValue] = useState('');
  const [toggleSearch, setToggleSearch] = useState(false);
  const [filteredData, setFilteredData] = useState(data_purchase_history);

  useEffect(() => {
    dispatch(getDataPurchaseHistory());
  }, [dispatch]);

  const handleSearch = text => {
    setSearchValue(text);
    if (text !== '') {
      const search = data_purchase_history.filter(item => {
        if (item.customer.includes(text)) {
          return item;
        }
      });
      setFilteredData(search);
      return;
    }

    setFilteredData(data_purchase_history);
  };

  const handleToggleSearch = () => {
    setToggleSearch(!toggleSearch);
    setFilteredData(data_purchase_history);
    setSearchValue('');
  };

  return (
    <ScrollView style={styles.container}>
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
          {toggleSearch ? (
            <TextInput
              onChangeText={text => handleSearch(text)}
              value={searchValue}
              placeholder="Search..."
              style={styles.searchBox}
            />
          ) : (
            <Text style={styles.headerTitleText}>History</Text>
          )}
          <TouchableOpacity onPress={handleToggleSearch}>
            <Feather
              name={toggleSearch ? 'x' : 'search'}
              size={hp(25)}
              color={colors.textBlack}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.headerUnderLine} />
      </SafeAreaView>

      {/* History Items */}

      {Object.entries(filteredData.groupBy('date')).map(([key, value]) => (
        <VStack space={'3'} key={key}>
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

      <Box mt={'20'} />
    </ScrollView>
  );
};

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
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    textAlign: 'center',
  },
  searchBox: {
    flex: 1,
    marginHorizontal: wp(20),
    // backgroundColor: 'red',
    fontFamily: 'Poppins-Medium',
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
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
