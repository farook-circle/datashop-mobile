/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {selectContactPhone} from 'react-native-select-contact';
import {MainLayout} from '../components';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {buyDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import uuid from 'react-native-uuid';
import {useRef} from 'react';
import {
  Actionsheet,
  Button,
  HStack,
  IconButton,
  Input,
  Switch,
} from 'native-base';
import RecentContactCard from '../components/contact/RecentContactCard';
import {getDataRecentContacts} from '../redux/actions/user';

export const DataPlan = gestureHandlerRootHOC(({route, navigation}) => {
  const dispatch = useDispatch();

  const [itemClick, setItemClick] = useState(false);
  const [itemValue, setItemValue] = useState(null);

  const [isFirstTimeFill, setIsFirstTimeFill] = useState(true);

  const [error, setError] = useState(null);

  const [check_mtn_number, setCheckMtnNumber] = useState(true);

  const [itemClicked, setItemClicked] = useState(null);
  const [customer, setCustomer] = useState('');
  const [remark, setRemark] = useState('I love this Service');
  const [payment_method, setPaymentMethod] = useState('wallet');
  const phoneInputRef = useRef();
  const [customReference, setCustomReference] = useState(null);
  const [phoneInputFocus, setPhoneInputFocus] = useState(false);

  const [toggleCheckoutData, setToggleCheckoutData] = useState(false);

  const {dataContact} = useSelector(state => state.user);

  const collaborator_data = useSelector(
    state => state.collaborator.collaborator_data,
  );

  const {data_bundles} = route.params;
  const collaborator = useSelector(state => state.auth.collaborator);

  const balance = useSelector(state => state.wallet.wallet_balance);

  const isLoading = useSelector(state => state.data_bundles.isLoading);

  const onOpen = () => {
    setToggleCheckoutData(true);
    setCustomReference(uuid.v4());
  };

  const onClose = () => {
    setToggleCheckoutData(false);
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

    setItemClicked(item);
    setCustomer('');
    setError(null);
    onOpen();
  };

  const handleSetCustomer = phoneNumber => {
    if (phoneNumber.length === 11 && isFirstTimeFill) {
      phoneInputRef.current.blur();
      setIsFirstTimeFill(false);
    }

    setCustomer(phoneNumber);
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
                  customer_reference: customReference,
                },
                handleCheckoutSuccess,
              ),
            ),
        },
      ],
    );
  };

  const handleCheckoutSuccess = () => {
    dispatch(getDataRecentContacts());

    Alert.alert(
      'Success Message',
      'Your order has been successfully submitted✔️. Thank you for choosing DataShop',
      [{text: 'OK', onPress: () => navigation.navigate('Home')}],
    );
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
        return require('../../assets/images/transfer.png');
    }
  };

  const renderDataBundleItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.dataBundleItemsWrapper]}
        onPress={() => handleDataItemClick(item)}>
        <Image
          source={
            item.image !== null
              ? {uri: item.image}
              : getDataPlanImage(item.service)
          }
          style={[styles.mtnLogoImage]}
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
            {item.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleAddContact = async () => {
    // check permission
    const granted = await getContactPermission();

    if (!granted) {
      return Alert.alert(
        'Warning',
        'Please grant permission for reading contact',
      );
    }

    const phoneNumber = await selectContactPhone().then(selection => {
      if (!selection) {
        return null;
      }

      let {contact, selectedPhone} = selection;
      return selectedPhone.number;
    });

    if (!phoneNumber) {
      return Alert.alert('Warning', 'Please select valid phone number');
    }

    if (phoneNumber.startsWith('0')) {
      const contact = phoneNumber.replaceAll('-', '').replaceAll(' ', '');
      setCustomer(contact);
      return;
    }

    if (phoneNumber.startsWith('234')) {
      const contact = phoneNumber
        .replaceAll('-', '')
        .replaceAll(' ', '')
        .replace('234', '0');
      setCustomer(contact);
      return;
    }

    if (phoneNumber.startsWith('+234')) {
      const contact = phoneNumber
        .replaceAll('-', '')
        .replaceAll(' ', '')
        .replace('+234', '0');
      setCustomer(contact);
      return;
    }

    alert(`Invalid phone number: ${phoneNumber}`);
  };

  const getContactPermission = async () => {
    if (Platform.OS === 'android') {
      const request = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );

      // denied permission
      if (request === PermissionsAndroid.RESULTS.DENIED) {
        return false;
      }
      // user chose 'deny, don't ask again'
      else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        return false;
      }
    }

    return true;
  };

  return (
    <MainLayout headerTitle={'Data Plan'} showHeader={true}>
      <View style={styles.container}>
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
      <Actionsheet
        _backdrop={{bgColor: 'black', opacity: 1}}
        isOpen={toggleCheckoutData}
        onClose={onClose}>
        <Actionsheet.Content width={'100%'}>
          {itemClicked && (
            <View
              style={{
                height: phoneInputFocus ? hp(900) : hp(450),
                paddingHorizontal: wp(5),
                width: '100%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <IconButton
                  rounded={'full'}
                  onPress={onClose}
                  icon={
                    <Feather name="x" size={hp(25)} color={colors.textBlack} />
                  }
                />
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
              <View style={{marginBottom: hp(20), marginTop: hp(15)}}>
                {error && (
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      color: 'red',
                      fontSize: hp(13),
                      width: '100%',
                      textAlign: 'center',
                      marginBottom: hp(10),
                    }}>
                    {error}
                  </Text>
                )}

                <Input
                  ref={phoneInputRef}
                  placeholder="PHONE"
                  onChangeText={text => handleSetCustomer(text)}
                  onFocus={() => setPhoneInputFocus(true)}
                  onBlur={() => setPhoneInputFocus(false)}
                  autoFocus={true}
                  keyboardType={'numeric'}
                  maxLength={11}
                  value={customer}
                  size={'lg'}
                  InputRightElement={
                    <IconButton
                      onPress={handleAddContact}
                      rounded={'full'}
                      icon={
                        <AntDesign
                          name="contacts"
                          size={hp(25)}
                          color={'gray'}
                        />
                      }
                    />
                  }
                />
              </View>
              {itemClicked.service.toLowerCase() === 'mtn' && (
                <HStack alignItems={'center'} space={2}>
                  <Switch
                    defaultIsChecked={true}
                    onValueChange={e => setCheckMtnNumber(e)}
                  />
                  <Text
                    style={{
                      fontSize: hp(14),
                      fontFamily: 'Poppins-Medium',
                      color: colors.textBlack,
                    }}>
                    Turn off number validation
                  </Text>
                </HStack>
              )}

              <Button
                mt={'2'}
                size={'lg'}
                py={'3'}
                isDisabled={isLoading}
                onPress={handleCheckout}
                isLoading={isLoading}>
                Buy Data
              </Button>

              <HStack pt={'2'}>
                <FlatList
                  horizontal
                  data={dataContact}
                  renderItem={({item}) => (
                    <RecentContactCard
                      contact={item}
                      onRecentClick={recentNumber => setCustomer(recentNumber)}
                    />
                  )}
                  keyExtractor={item => item.id}
                  showsHorizontalScrollIndicator={false}
                />
              </HStack>
            </View>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </MainLayout>
  );
});

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
