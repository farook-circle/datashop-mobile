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
  ToastAndroid,
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
  Avatar,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Switch,
  VStack,
} from 'native-base';
import RecentContactCard from '../components/contact/RecentContactCard';
import {getDataRecentContacts} from '../redux/actions/user';
import {formatCurrency} from '../utils';
import {DataPlanCard} from './DataPlanCard';
import {UPDATE_USER_CART} from '../redux/constants/wallet';
import {ROUTES} from '../lib';

export const DataPlanCheckoutScreen = gestureHandlerRootHOC(
  ({route, navigation}) => {
    const dispatch = useDispatch();

    const [isFirstTimeFill, setIsFirstTimeFill] = useState(true);

    const {cart_items} = useSelector(state => state.wallet);

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

    const {plan} = route.params;

    const balance = useSelector(state => state.wallet.wallet_balance);
    const isLoading = useSelector(state => state.data_bundles.isLoading);

    const onClose = () => {
      setToggleCheckoutData(false);
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

    const handleCheckout = (checkoutType = 'checkout') => {
      setError(null);
      if (!phoneNumberCheckUp()) {
        return;
      }

      // if (Number(balance) < Number(plan?.price)) {
      //   setError('You do not have sufficient balance. Please fund your wallet');
      //   return;
      // }

      if (checkoutType === 'cart') {
        console.log(cart_items)
        dispatch({
          type: UPDATE_USER_CART,
          payload: [
            {
              product_type: 'data',
              product: plan,
              check_mtn_number: false,
              customer_reference: customReference,
              amount: plan.price,
              customer,
              remark,
            },
            ...cart_items,
          ],
        });
        ToastAndroid.show(
          'Item added to cart successfully',
          ToastAndroid.SHORT,
        );
        navigation.navigate(ROUTES.HOME_SCREEN);
        return;
      }

      completeCheckOut();
    };

    const completeCheckOut = () => {
      Alert.alert(
        'Buy Data',
        `Please confirm that you want to order ${itemClicked?.quantity} for ${customer}`,
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
                      itemClicked?.service.toLowerCase() !== 'mtn'
                        ? false
                        : check_mtn_number,
                    data_bundle_id: itemClicked?.id,
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

    return (
      <MainLayout
        bgColor={'white'}
        headerTitle={'Data Checkout'}
        showHeader={true}>
        <ScrollView flex={1} px={'4'}>
          <DataPlanCard item={plan} />
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

            <Box bgColor={'gray.200'}>
              <Input
                ref={phoneInputRef}
                placeholder="0701234*****"
                onChangeText={text => handleSetCustomer(text)}
                onFocus={() => setPhoneInputFocus(true)}
                onBlur={() => setPhoneInputFocus(false)}
                autoFocus={true}
                keyboardType={'numeric'}
                maxLength={11}
                backgroundColor={'white'}
                variant={'underlined'}
                value={customer}
                fontSize={'2xl'}
                fontWeight={'bold'}
                py={'4'}
                size={'lg'}
                InputLeftElement={
                  <Avatar
                    source={getDataPlanImage(plan.service)}
                    size={'sm'}
                    marginRight={'2'}
                  />
                }
                InputRightElement={
                  <IconButton
                    onPress={handleAddContact}
                    rounded={'full'}
                    variant={'solid'}
                    shadow={1}
                    backgroundColor={'white'}
                    icon={
                      <AntDesign name="user" size={hp(18)} color={'gray'} />
                    }
                  />
                }
              />
            </Box>
          </View>

          <Button
            mt={'2'}
            size={'lg'}
            py={'3'}
            variant={'outline'}
            isDisabled={isLoading}
            startIcon={
              <Feather
                name={'shopping-cart'}
                size={20}
                color={colors.primary}
              />
            }
            onPress={() => handleCheckout('cart')}
            isLoading={isLoading}>
            Add to Cart
          </Button>

          <Button
            mt={'2'}
            size={'lg'}
            py={'3'}
            isDisabled={isLoading}
            onPress={handleCheckout}
            endIcon={<Feather name={'arrow-right'} size={20} color={'white'} />}
            isLoading={isLoading}>
            Buy Now
          </Button>

          <Box mt={'4'}>
            <Heading>Recent</Heading>
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
          </Box>
        </ScrollView>

        <Actionsheet
          _backdrop={{bgColor: 'black', opacity: 1}}
          isOpen={toggleCheckoutData && itemClicked ? true : false}
          onClose={onClose}>
          <Actionsheet.Content width={'100%'}>
            <View
              style={{
                height: phoneInputFocus ? hp(900) : hp(450),
                paddingHorizontal: wp(5),
                width: '100%',
              }}>
              <VStack
                borderWidth={1}
                borderColor={'gray.200'}
                rounded={'lg'}
                py={4}
                width={'full'}
                px={'10px'}
                mt={1}
                space={1}
                shadow={4}
                pt={'2'}>
                <Box width={'full'}>
                  <HStack justifyContent={'space-between'}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Bold',
                        color: 'black',
                        fontSize: hp(20),
                      }}
                      numberOfLines={1}>
                      {itemClicked?.quantity}
                    </Text>
                    <IconButton
                      rounded={'full'}
                      onPress={onClose}
                      icon={
                        <Feather
                          name="x"
                          size={hp(25)}
                          color={colors.textBlack}
                        />
                      }
                    />
                  </HStack>
                </Box>
                <Text numberOfLines={2}>{itemClicked?.description}</Text>
                <HStack
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  mt={'4'}>
                  <VStack>
                    <Box>
                      <Feather name={'wifi'} size={30} color={'black'} />
                    </Box>
                  </VStack>
                  <Box mt={'1'}>
                    <Image
                      alt={'logo'}
                      style={{width: 40, height: 40, borderRadius: 100}}
                      source={{uri: itemClicked?.image}}
                    />
                  </Box>
                  <VStack alignItems={'flex-end'}>
                    <Text
                      style={{color: 'gray', fontFamily: 'Poppins-Regular'}}>
                      Validity
                    </Text>
                    <Text
                      style={{fontFamily: 'Poppins-SemiBold', color: 'black'}}>
                      {itemClicked?.validity}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>

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

                <Box bgColor={'gray.200'}>
                  <Input
                    ref={phoneInputRef}
                    placeholder="PHONE"
                    onChangeText={text => handleSetCustomer(text)}
                    onFocus={() => setPhoneInputFocus(true)}
                    onBlur={() => setPhoneInputFocus(false)}
                    autoFocus={true}
                    keyboardType={'numeric'}
                    maxLength={11}
                    variant={'underlined'}
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
                </Box>
              </View>
              {itemClicked?.service.toLowerCase() === 'mtn' && (
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
          </Actionsheet.Content>
        </Actionsheet>
      </MainLayout>
    );
  },
);
