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
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataPurchaseHistory} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import { Divider, HStack, Pressable, VStack } from 'native-base';
import CategoryItem from '../components/other/CategoryItem';

export default function OtherScreen({navigation}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {}, []);

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
          <Text style={styles.headerTitleText}>Other services</Text>
          <Text>{'  '}</Text>
        </View>

        <View style={styles.headerUnderLine} />
      </SafeAreaView>

      {/* Body */}
      <VStack p={'2'} mt={'2'} space={'2'} divider={<Divider />}>
        <CategoryItem
          title={'Electricity'}
          icon={'bolt'}
          onPress={() => navigation.navigate('ElectricityPayment')}
        />
         <CategoryItem
          title={'Airtime to cash'}
          icon={'money-bill'}
          onPress={() => navigation.navigate('ElectricityPayment')}
        />
         <CategoryItem
          title={'TV Subscription'}
          icon={'tv'}
          onPress={() => navigation.navigate('ElectricityPayment')}
        />
         <CategoryItem
          title={'Wallet Transfer'}
          icon={'paper-plane'}
          onPress={() => navigation.navigate('ElectricityPayment')}
        />
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 25,
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',

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

  bodyWrapper: {
    flex: 1,
  },
  itemWrapper: {
    paddingHorizontal: 10,
    marginTop: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f4f4f4',
    borderRadius: 5,
    paddingVertical: 5,
  },
  itemTitle: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 20,
    fontSize: hp(16),
    color: colors.textBlack,
  },
});
