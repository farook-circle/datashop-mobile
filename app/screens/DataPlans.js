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
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';

export default function DataPlan({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataBundle());
  }, []);

  const data_bundles = useSelector(state => state.data_bundles.data_bundle);

  const renderDataBundleItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.dataBundleItemsWrapper}
        onPress={() =>
          navigation.navigate('CheckOut', {
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })
        }>
        <Image
          source={require('../../assets/images/mtn_logo.png')}
          style={styles.mtnLogoImage}
        />
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
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
          <Text style={styles.headerTitleText}>Data Plan</Text>
        </View>
        <View style={styles.headerUnderLine} />
      </SafeAreaView>
      <View style={styles.dataBundleCategoryWrapper}>
        <FlatList
          numColumns={2}
          data={data_bundles}
          renderItem={renderDataBundleItem}
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
    marginLeft: wp(93),
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(2),
    width: wp(350),
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  dataBundleCategoryWrapper: {
    marginTop: hp(10),
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  dataBundleItemsWrapper: {
    width: wp(145),
    height: hp(159),
    backgroundColor: colors.primary,
    borderRadius: hp(10),
    alignItems: 'center',
    marginRight: wp(15),
    marginBottom: hp(20),
    shadowColor: colors.textBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 4,
    shadowRadius: 20,
    elevation: 4,
  },
  mtnLogoImage: {
    marginTop: hp(25),
    width: wp(66),
    height: hp(47),
  },
  roundIconEnter: {
    marginTop: hp(10),
    width: wp(40),
    height: hp(40),
    borderRadius: 20,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.textWhite,
    shadowColor: colors.textBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 4,
    shadowRadius: 20,
    elevation: 4,
  },
  quantityText: {
    marginTop: hp(10),
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(15),
    color: colors.secondary,
    textAlign: 'center',
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(15),
    color: colors.textWhite,
    textAlign: 'center',
  },
});
