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
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import OverLayModel from '../components/OverLayModel';
import {entityId} from '../config/collConfig';

export default function DataPlan({route, navigation}) {
  const dispatch = useDispatch();
  const [itemClick, setItemClick] = useState(false);
  const [itemValue, setItemValue] = useState(null);
  const [editClick, setEditClick] = useState(false);
  const [editedAmount, setEditedAmount] = useState('');

  const {data_bundles} = route.params;
  const collaborator = useSelector(state => state.auth.collaborator);

  useEffect(() => {}, []);

  const handleDataItemClick = item => {
    if (collaborator) {
      setItemClick(true);
      setItemValue(item);
      return;
    }

    // not a collaborator app
    navigation.navigate('CheckOut', {
      id: item.id,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    });
  };

  const handleSellData = () => {
    setItemClick(false);
    navigation.navigate('CheckOut', {
      id: itemValue.id,
      image: itemValue.image,
      price: itemValue.price,
      quantity: itemValue.quantity,
    });
  };

  const handleEditPrice = () => {
    setEditedAmount(itemValue.price.toString());
    setEditClick(true);
  };

  const handleCloseModal = () => {
    setEditClick(false);
    setItemClick(false);
  };

  const renderDataBundleItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.dataBundleItemsWrapper}
        onPress={() => handleDataItemClick(item)}>
        <Image
          source={require('../../assets/images/mtn_logo.png')}
          style={styles.mtnLogoImage}
        />
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Text style={styles.priceText}>
          {'\u20A6'}
          {item.price}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {itemClick && (
        <OverLayModel
          // onOverlayPress={() => setItemClick(false)}
          style={styles.modelContainer}>
          <View style={styles.modelWrapper}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={{
                marginTop: hp(20),
                marginBottom: hp(30),
              }}>
              <Feather name="x" size={30} color={'red'} />
            </TouchableOpacity>
            {!editClick ? (
              <>
                <TouchableOpacity
                  style={[styles.buttonStyle, {marginBottom: 10}]}
                  onPress={handleSellData}>
                  <Text style={styles.buttonText}>Sell Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleEditPrice}
                  style={[
                    styles.buttonStyle,
                    {
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderColor: colors.primary,
                    },
                  ]}>
                  <Text style={[styles.buttonText, {color: colors.textBlack}]}>
                    Update Data Plan Price
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View>
                  <Text style={styles.nairaSign}>{'\u20A6'}</Text>
                  <TextInput
                    placeholder="Price"
                    value={editedAmount}
                    style={styles.dataPriceInput}
                    onChangeText={text => setEditedAmount(text)}
                    keyboardType={'numeric'}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.buttonStyle, {marginBottom: 10}]}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </OverLayModel>
      )}
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
            <Text>{'  '}</Text>
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
    </>
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

    backgroundColor: colors.textLight,
  },
  dataBundleCategoryWrapper: {
    marginTop: hp(10),
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
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

  // model
  modelContainer: {
    justifyContent: 'flex-end',
    width: '100%',
  },

  modelWrapper: {
    paddingHorizontal: wp(25),
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: hp(30),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    color: colors.textWhite,
    fontSize: hp(16),
  },
  nairaSign: {
    position: 'absolute',
    top: 8,
    left: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
  },
  dataPriceInput: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: hp(20),
  },
});
