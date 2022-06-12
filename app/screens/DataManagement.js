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
} from 'react-native';
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';

export default function DataManagement({navigation}) {
  const dispatch = useDispatch();

  const data_category = useSelector(state => state.data_bundles.data_category);

  useEffect(() => {}, []);

  const renderDataCategory = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.dataCategory}
        onPress={() =>
          navigation.navigate('DataPlan', {
            data_bundles: item.data_plan_items,
          })
        }>
        <View style={styles.iconBox}>
          <FontAwesome name="globe" size={20} color={'white'} />
        </View>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Feather name="chevron-right" color={'black'} size={30} />
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
          <Text style={styles.headerTitleText}>Manage Data</Text>
          <Text>{'  '}</Text>
        </View>
        <View style={styles.headerUnderLine} />
      </SafeAreaView>
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
    borderRadius: 5,
  },
  categoryTitle: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
    paddingLeft: wp(10),
  },
});
