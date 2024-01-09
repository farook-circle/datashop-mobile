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
import {VStack, Box, Input} from 'native-base';
import {MainLayout} from '../components';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataPurchaseHistory} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import HistoryItemList from '../components/History/HistoryItemList';
import moment from 'moment-timezone';

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

  return (
    <MainLayout headerTitle={'Transactions'} showHeader={true}>
      <VStack px={'4'}>
        <Input
          InputLeftElement={
            <Box pl={'3'}>
              <Feather size={25} color={'gray'} name={'search'} />
            </Box>
          }
          py={'3'}
          size={'lg'}
          placeholder="Search"
          value={searchValue}
          onChangeText={text => handleSearch(text)}
        />
      </VStack>
      <ScrollView style={styles.container}>
        {/* History Items */}

        {Object.entries(filteredData.groupBy('date')).map(([key, value]) => (
          <VStack space={'3'} key={key}>
            <Box px={'6'} py={'2'}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  color: 'black',
                  fontSize: hp(15),
                }}>
                {moment(key).format('MMMM D, YYYY')}
              </Text>
            </Box>
            <VStack space={'3'}>
              {value.map((item, index) => (
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

        <Box mt={'20'} />
      </ScrollView>
    </MainLayout>
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
