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
            <Feather name="chevron-left" size={35} color={colors.textBlack} />
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
  headerUnderLine: {
    marginTop: 10,
    height: 2,
    width: 350,
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  dataBundleCategoryWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    width: 370,

    alignSelf: 'center',
    alignItems: 'center',
  },
  dataBundleItemsWrapper: {
    width: 175,
    height: 159,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 20,
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
    marginTop: 25,
    width: 66,
    height: 47,
  },
  roundIconEnter: {
    marginTop: 10,
    width: 40,
    height: 40,
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
    marginTop: 10,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: colors.secondary,
    textAlign: 'center',
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: colors.textWhite,
    textAlign: 'center',
  },
});
