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
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {buyDataBundle, getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import OverLayModel from '../components/OverLayModel';
import {entityId} from '../config/collConfig';
import BottomModel from '../components/BottomModel';
import {
  getCollaboratorData,
  updateCollaboratorData,
} from '../redux/actions/collaborator';
import {useRef} from 'react';
import {Modalize} from 'react-native-modalize';

function DataPlan({route, navigation}) {
  const dispatch = useDispatch();

  const modalizeRef = useRef(null);

  const [itemClick, setItemClick] = useState(false);
  const [itemValue, setItemValue] = useState(null);
  const [editClick, setEditClick] = useState(false);
  const [editedAmount, setEditedAmount] = useState('');
  const [updateDataLoading, setUpdateDataLoading] = useState(false);
  const [checkout, setCheckOut] = useState(false);

  const [error, setError] = useState(null);

  const [check_mtn_number, setCheckMtnNumber] = useState(true);

  const [itemClicked, setItemClicked] = useState(null);
  const [customer, setCustomer] = useState('');
  const [remark, setRemark] = useState('I love this Service');
  const [payment_method, setPaymentMethod] = useState('wallet');

  const [phoneInputFocus, setPhoneInputFocus] = useState(false);

  const collaborator_data = useSelector(
    state => state.collaborator.collaborator_data,
  );

  const {data_bundles} = route.params;
  const collaborator = useSelector(state => state.auth.collaborator);

  const balance = useSelector(state => state.wallet.wallet_balance);

  const isLoading = useSelector(state => state.data_bundles.isLoading);

  useEffect(() => {}, []);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  const getCollaboratorPrice = (data_plan_id, data_actual_price) => {
    const collaborator_data_plan = collaborator_data.filter(
      item => item.data_plan.id === data_plan_id,
    )[0];

    return collaborator_data_plan !== undefined
      ? collaborator_data_plan.collaborator_price + data_actual_price
      : data_actual_price;
  };

  const handleDataItemClick = item => {
    if (collaborator) {
      setItemClick(true);
      setItemValue(item);
      return;
    }

    // not a collaborator app
    // navigation.navigate('CheckOut', {
    //   id: item.id,
    //   image: item.image,
    //   price: item.price,
    //   quantity: item.quantity,
    // });

    setItemClicked(item);
    setCustomer('');
    setError(null);
    onOpen();
  };

  const handleSellData = () => {
    setItemClick(false);
    setItemClicked({
      ...itemValue,
      price: getCollaboratorPrice(itemValue.id, itemValue.price),
    });
    setCustomer('');
    setError(null);
    onOpen();
    // navigation.navigate('CheckOut', {
    //   id: itemValue.id,
    //   image: itemValue.image,
    //   price: getCollaboratorPrice(itemValue.id, itemValue.price),
    //   quantity: itemValue.quantity,
    // });
  };

  const handleEditPrice = () => {
    // setEditedAmount(itemValue.price.toString());
    setEditClick(true);
  };

  const handleCloseModal = () => {
    setEditClick(false);
    setItemClick(false);
  };

  const handleUpdateData = () => {
    setUpdateDataLoading(true);
    dispatch(
      updateCollaboratorData(
        {collaborator_price: editedAmount, data_plan_id: itemValue.id},
        handleUpdateDataResponse,
      ),
    );
  };

  const handleUpdateDataResponse = (res_data, res_status) => {
    setUpdateDataLoading(false);

    dispatch(getDataBundle());
    dispatch(getCollaboratorData());

    alert('you have successfully update the data plan price');

    handleCloseModal();
    setEditedAmount('');
  };

  const phoneNumberCheckUp = () => {
    if (customer.length > 1 && customer.length < 11) {
      setError(
        'Invalid number! Please type out 11-digit phone number and avoid spaces between digits',
      );
      return false;
    }
    if (customer.length < 1) {
      setError('customer phone number should not be empty');
      return false;
    }

    if (customer.match(/0(9|8|7)(0|1)\d{8}/g) == null) {
      setError(
        'Invalid number! Please type out 11-digit phone number and avoid spaces between digits',
      );
      return false;
    }

    return true;
  };

  const handleCheckout = () => {
    setError(null);
    if (!phoneNumberCheckUp()) {
      return;
    }

    if (
      Number(balance) <
      Number(getCollaboratorPrice(itemClicked.id, itemClicked.price))
    ) {
      setError('You do not have sufficient balance. Please fund your wallet');
      return;
    }
    completeCheckOut();
  };

  const completeCheckOut = () => {
    Alert.alert(
      'Buy Data',
      `Please confirm that you want to order ${itemClicked.quantity} for ${customer}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'default',
          onPress: () =>
            dispatch(
              buyDataBundle(
                {
                  check_mtn_number:
                    itemClicked.service.toLowerCase() !== 'mtn'
                      ? false
                      : check_mtn_number,
                  data_bundle_id: itemClicked.id,
                  customer,
                  payment_method,
                  remark,
                },
                handleCheckoutSuccess,
              ),
            ),
        },
      ],
    );
  };

  const handleCheckoutSuccess = () => {
    alert(
      'Your order has been successfully submitted✔️. Thank you for choosing DataShop',
    );
    navigation.navigate('Home');
  };

  const getDataPlanImage = service => {
    switch (service.toLowerCase()) {
      case 'mtn':
        return require('../../assets/images/mtn.jpg');
      case 'airtel':
      case 'zain':
        return require('../../assets/images/airtel.jpg');
      case 'glo':
        return require('../../assets/images/glo.png');
      case '9mobile':
      case 'etisalat':
        return require('../../assets/images/9mobile.jpg');
      default:
        console.log(service);
        return require('../../assets/images/transfer.png');
    }
  };

  const renderDataBundleItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.dataBundleItemsWrapper}
        onPress={() => handleDataItemClick(item)}
        // onPress={onOpen}
      >
        <Image
          source={
            item.image !== null
              ? {uri: item.image}
              : getDataPlanImage(item.service)
          }
          style={styles.mtnLogoImage}
        />
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Text style={styles.priceText}>
            {'\u20A6'}
            {entityId.cid
              ? getCollaboratorPrice(item.id, item.price)
              : item.price}
          </Text>
        </View>
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
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: hp(16),
                    color: colors.textBlack,
                    marginBottom: hp(10),
                  }}>
                  Please always remember to set a reasonable price
                </Text>
                <View>
                  <Text style={styles.nairaSign}>
                    {'\u20A6'}
                    {itemValue.price}+
                  </Text>
                  <TextInput
                    placeholder=" how much do you want to add"
                    value={editedAmount}
                    style={styles.dataPriceInput}
                    onChangeText={text => setEditedAmount(text)}
                    keyboardType={'numeric'}
                  />
                </View>
                {editedAmount !== '' && (
                  <Text
                    style={{
                      width: '100%',
                      fontFamily: 'Poppins-Medium',
                      fontSize: hp(16),
                      color: colors.primary,
                      marginBottom: hp(10),
                      textAlign: 'right',
                    }}>
                    updated Price Will be {'\u20A6'}
                    {Number(itemValue.price) + Number(editedAmount)}
                  </Text>
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleUpdateData}
                  disabled={updateDataLoading ? true : false}
                  style={[
                    styles.buttonStyle,
                    {marginBottom: 10},
                    updateDataLoading && {
                      backgroundColor: colors.textLight,
                    },
                  ]}>
                  {updateDataLoading ? (
                    <ActivityIndicator size={'large'} color={colors.primary} />
                  ) : (
                    <Text style={styles.buttonText}>Update</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </OverLayModel>
      )}

      {/* test overlay */}
      <Modalize
        modalHeight={phoneInputFocus ? 700 : 500}
        keyboardAvoidingBehavior={false}
        closeSnapPointStraightEnabled={true}
        panGestureEnabled={true}
        overlayStyle={{backgroundColor: 'rgba(0,0,0,1)'}}
        ref={modalizeRef}>
        {itemClicked && (
          <View
            style={{
              flex: 1,
              padding: 25,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={hp(25)} color={colors.textBlack} />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: hp(18),
                  color: colors.textBlack,
                }}>
                Checkout
              </Text>
              <Text>{'      '}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',

                padding: 10,
                borderRadius: 5,
                elevation: 1,
                backgroundColor: 'white',
              }}>
              <Image
                source={
                  itemClicked.image !== null
                    ? {uri: itemClicked.image}
                    : getDataPlanImage(itemClicked.service)
                }
                style={{width: 80, height: 80}}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  color: colors.secondary,
                  fontSize: hp(26),
                  marginLeft: hp(20),
                }}>
                {itemClicked && itemClicked.quantity}
              </Text>
            </View>
            <View style={{flex: 1, marginTop: hp(20)}}>
              {error && (
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: 'red',
                    fontSize: hp(14),
                    width: '100%',
                    textAlign: 'center',
                    marginBottom: hp(10),
                  }}>
                  {error}
                </Text>
              )}
              <TextInput
                placeholder="PHONE"
                keyboardType="numeric"
                maxLength={11}
                value={customer}
                onChangeText={text => setCustomer(text)}
                onFocus={() => setPhoneInputFocus(true)}
                onBlur={() => setPhoneInputFocus(false)}
                style={{
                  textAlign: 'center',
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  fontFamily: 'Poppins-Medium',
                  fontSize: hp(16),
                }}
              />
            </View>
            {itemClicked.service.toLowerCase() === 'mtn' && (
              <View style={{flexDirection: 'row', marginTop: hp(10)}}>
                {check_mtn_number ? (
                  <TouchableOpacity
                    onPress={() => setCheckMtnNumber(!check_mtn_number)}>
                    <Feather
                      name="toggle-right"
                      color={colors.primary}
                      size={hp(25)}
                      style={{marginRight: hp(10)}}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setCheckMtnNumber(!check_mtn_number)}>
                    <Feather
                      name="toggle-left"
                      color={colors.textBlack}
                      size={hp(25)}
                      style={{marginRight: hp(10)}}
                    />
                  </TouchableOpacity>
                )}

                <Text
                  style={{
                    fontSize: hp(14),
                    fontFamily: 'Poppins-Medium',
                    color: colors.textBlack,
                  }}>
                  Turn off number validation
                </Text>
              </View>
            )}
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleCheckout}
              style={[
                {
                  marginTop: hp(10),
                  paddingVertical: hp(7),
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                isLoading && {backgroundColor: colors.textLight},
              ]}>
              {isLoading ? (
                <ActivityIndicator size={'large'} color={colors.primary} />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: hp(14),
                    color: colors.textWhite,
                  }}>
                  Buy Data
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Modalize>

      {/* checkout overlay test */}
      {checkout && <BottomModel />}
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
    height: hp(180),
    overflow: 'hidden',
    backgroundColor: 'white',
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
    width: '100%',
    height: '70%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(15),
    color: colors.textBlack,
    marginRight: wp(10),
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(15),
    color: colors.textBlack,
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
    top: 12,
    left: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
  },
  dataPriceInput: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
    paddingLeft: 70,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: hp(10),
  },
});

export default gestureHandlerRootHOC(DataPlan);
