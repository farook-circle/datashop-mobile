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
import {Avatar, Divider, HStack, Pressable, VStack} from 'native-base';
import CategoryItem from '../components/other/CategoryItem';

export const OtherScreen = ({navigation}) => {
  const {electricity} = useSelector(state => state.bill_payment);

  const services = [
    {
      title: 'Electricity',
      icon: 'bolt',
      checkout: 'ElectricityPaymentScreen',
      providers: electricity.providers,
    },
    {
      title: 'Cable Subscription',
      icon: 'tv',
      checkout: 'TvSubscriptionScreen',
      providers: [],
    },
    {
      title: 'Exam Payment',
      icon: 'cube',
      checkout: 'ExamPaymentScreen',
      providers: [],
    },
    {
      title: 'Betting Wallet',
      icon: 'suitcase',
      checkout: 'ExamPaymentScreen',
      providers: [],
    },
  ];

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
      <VStack py={'2'} mt={'2'} space={'2'}>
        <FlatList
          data={services}
          keyExtractor={item => item.title}
          renderItem={({item}) => (
            <CategoryItem title={item.title} icon={item.icon}>
              <View
                style={{
                  marginBottom: 20,
                  marginTop: 10,
                  paddingHorizontal: 10,
                }}>
                <FlatList
                  data={item.providers}
                  numColumns={4}
                  keyExtractor={data => data.name}
                  renderItem={() => <Avatar m={'2'} size={'55px'} />}
                />
              </View>
            </CategoryItem>
          )}
        />
      </VStack>
    </View>
  );
};

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
