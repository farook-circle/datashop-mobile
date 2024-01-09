/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {VStack} from 'native-base';
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';

import {hp, wp} from '../config/dpTopx';

export const DataCategoryScreen = ({navigation}) => {
  const data_category = useSelector(state => state.data_bundles.data_category);

  const renderDataCategory = ({item}) => {
    return (
      <TouchableOpacity
        disabled={!item.available}
        style={[styles.dataCategory, {}]}
        onPress={() =>
          navigation.navigate('DataPlan', {
            data_bundles: item.data_plan_items,
          })
        }>
        <View
          style={[
            styles.iconBox,
            !item.available && {backgroundColor: 'gray'},
          ]}>
          <FontAwesome name="globe" size={20} color={'white'} />
        </View>
        <VStack flex={1} justifyContent={'center'}>
          <Text
            style={[styles.categoryTitle, !item.available && {color: 'gray'}]}>
            {item.title}
          </Text>
          {!item.available && (
            <Text
              style={[
                styles.categoryTitle,
                {
                  fontFamily: 'Poppins-Regular',
                  fontSize: hp(16),
                  color: 'gray',
                },
              ]}>
              {'service not available'}
            </Text>
          )}
        </VStack>
        <Feather
          name="chevron-right"
          color={item.available ? 'black' : 'gray'}
          size={30}
        />
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
          <Text style={styles.headerTitleText}>Data Category</Text>
          <Text>{'  '}</Text>
        </View>
        <View style={styles.headerUnderLine} />
      </SafeAreaView>

      <View style={styles.dataBundleCategoryWrapper}>
        <FlatList
          data={data_category}
          renderItem={renderDataCategory}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
        />
      </View>
      {data_category.length < 1 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontFamily: 'Poppins-Regular', fontSize: 20}}>
            Nothing here come back later
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
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
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  dataCategory: {
    marginTop: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: wp(70),
    height: hp(53),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 115,
  },
  categoryTitle: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    color: colors.textBlack,
    fontSize: hp(18),
    paddingLeft: wp(10),
  },
});
