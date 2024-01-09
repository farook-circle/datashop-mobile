/* eslint-disable react-native/no-inline-styles */
import {Alert, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import {MainLayout} from '../components';
import {
  Actionsheet,
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  HStack,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  VStack,
  Text,
} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Formik} from 'formik';
import * as yup from 'yup';
import {selectContactPhone} from 'react-native-select-contact';
import {buyAirtimeService} from '../api/service.api';
import {getDataPurchaseHistory} from '../redux/actions/data_plans';
import {getWalletBalance} from '../redux/actions/wallet';

const defaultValues = {
  network: '',
  amount: '',
  phone_number: '',
};

const buyAirtimeValidation = yup.object().shape({
  network: yup.string().required('Please select your network'),
  amount: yup
    .number()
    .min(100, 'Minimum amount is 100 naira')
    .required('Please add amount to recharge'),
  phone_number: yup
    .string()
    .matches(/(0)(\d){8}\b/, 'Enter a valid phone number')
    .required('Phone number is required'),
});

export const AirtimeScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {services, available} = useSelector(state => state.airtime);
  const [toggleSelectNetwork, setToggleSelectNetwork] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const formRef = useRef();

  const handleSelectNetwork = network => {
    setSelectedNetwork(network);
    formRef.current?.setFieldValue('network', network.id);
    setToggleSelectNetwork(false);
  };

  function calculateDiscount(originalPrice, discountPercentage) {
    // Check for valid input
    if (
      originalPrice < 0 ||
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      return originalPrice;
    }

    // Calculate the discount amount
    const discountAmount = (discountPercentage / 100) * originalPrice;

    return discountAmount;
  }

  const handleBuyAirtime = async payload => {
    setLoading(true);
    const request = await buyAirtimeService({
      amount: payload.amount,
      service: payload.network,
      customer: payload.phone_number,
    });

    if (request.ok) {
      Alert.alert(
        'Airtime Order',
        request.data?.message || 'Airtime Order Successfully',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
      dispatch(getDataPurchaseHistory());
      dispatch(getWalletBalance());

      setLoading(false);
      return;
    }

    setLoading(false);
    Alert.alert(
      'Airtime Purchase Error',
      request.data?.failed || 'Something went wrong',
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
      formRef.current?.setFieldValue('phone_number', contact);
      return;
    }

    if (phoneNumber.startsWith('234')) {
      const contact = phoneNumber
        .replaceAll('-', '')
        .replaceAll(' ', '')
        .replace('234', '0');
      formRef.current?.setFieldValue('phone_number', contact);
      return;
    }

    if (phoneNumber.startsWith('+234')) {
      const contact = phoneNumber
        .replaceAll('-', '')
        .replaceAll(' ', '')
        .replace('+234', '0');
      formRef.current?.setFieldValue('phone_number', contact);
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
      if (request === PermissionsAndroid.RESULTS.DENIED) return false;
      // user chose 'deny, don't ask again'
      else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
        return false;
    }

    return true;
  };

  return (
    <MainLayout showHeader={true} headerTitle={'Airtime'}>
      <ScrollView flex={1} px={'4'}>
        {!available ? (
          <Text style={styles.unavailableText}>
            Service temporarily unavailable at the moment
          </Text>
        ) : (
          <Box>
            <Formik
              innerRef={formRef}
              initialValues={defaultValues}
              validationSchema={buyAirtimeValidation}
              onSubmit={form => handleBuyAirtime(form)}>
              {({
                values,
                errors,
                touched,
                handleChange,
                setFieldTouched,
                handleBlur,
                setFieldValue,
              }) => (
                <>
                  <FormControl isInvalid={errors.network && touched.network}>
                    <FormControl.Label>Network</FormControl.Label>
                    <Pressable
                      onPress={() => {
                        setFieldTouched('network');
                        setToggleSelectNetwork(true);
                      }}>
                      <HStack
                        px={2}
                        rounded={'4'}
                        py={'3'}
                        borderWidth={1}
                        borderColor={'gray.200'}
                        alignItems={'center'}
                        justifyContent={'space-between'}>
                        {selectedNetwork ? (
                          <HStack alignItems={'center'} space={'2'}>
                            <Avatar
                              size={'xs'}
                              alt={'network image'}
                              source={{
                                uri: selectedNetwork?.image?.image_url,
                              }}
                            />
                            <Text>{selectedNetwork?.service}</Text>
                          </HStack>
                        ) : (
                          <Text style={styles.placeholderText}>Choose one</Text>
                        )}
                        <Feather
                          name={'chevron-down'}
                          size={20}
                          color={'black'}
                        />
                      </HStack>
                    </Pressable>
                    <FormControl.ErrorMessage
                      leftIcon={<Feather name="info" size={10} />}>
                      {errors.network}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={errors.phone_number && touched.phone_number}>
                    <FormControl.Label>Phone Number</FormControl.Label>
                    <Input
                      value={values.phone_number}
                      onBlur={handleBlur('phone_number')}
                      onChangeText={handleChange('phone_number')}
                      placeholder="Phone Number"
                      keyboardType="number-pad"
                      py={'3'}
                      size={'lg'}
                      InputRightElement={
                        <IconButton
                          onPress={handleAddContact}
                          rounded={'full'}
                          icon={
                            <AntDesign
                              size={20}
                              name={'contacts'}
                              color={'black'}
                            />
                          }
                        />
                      }
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<Feather name="info" size={10} />}>
                      {errors.phone_number}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={errors.amount && touched.amount}>
                    <FormControl.Label>
                      Amount (Minimum 100NGN)
                    </FormControl.Label>
                    <Input
                      value={values.amount}
                      onChangeText={text => {
                        setFieldValue('amount', text);
                        setAmount(text);
                      }}
                      keyboardType={'number-pad'}
                      onBlur={handleBlur('amount')}
                      placeholder="Amount"
                      py={'3'}
                      size={'lg'}
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<Feather name="info" size={10} />}>
                      {errors.amount}
                    </FormControl.ErrorMessage>
                  </FormControl>
                </>
              )}
            </Formik>
          </Box>
        )}
      </ScrollView>
      {available && (
        <Box px={'4'} pb={'3'}>
          {Number(amount) && Number(amount) > 99 && selectedNetwork ? (
            <Card bgColor={'primary.100'} mb={'4'} rounded={'xl'}>
              <VStack space={'2'}>
                <HStack justifyContent={'space-between'}>
                  <Text fontSize={'md'}>Sub total</Text>
                  <Text fontSize={'md'} fontWeight={'semibold'}>
                    ₦{amount}
                  </Text>
                </HStack>
                <HStack justifyContent={'space-between'}>
                  <Text fontSize={'md'}>Discount</Text>
                  <Text fontSize={'md'} fontWeight={'semibold'}>
                    ₦{selectedNetwork.discount}
                  </Text>
                </HStack>
                <HStack justifyContent={'space-between'}>
                  <Text fontSize={'md'}>Total</Text>
                  <Text fontWeight={'semibold'} fontSize={'md'}>
                    ₦
                    {amount -
                      calculateDiscount(amount, selectedNetwork.discount)}
                  </Text>
                </HStack>
              </VStack>
            </Card>
          ) : (
            <></>
          )}
          <Button isLoading={loading} onPress={formRef.current?.handleSubmit}>
            Continue
          </Button>
        </Box>
      )}
      <Actionsheet
        isOpen={toggleSelectNetwork}
        onClose={() => setToggleSelectNetwork(false)}>
        <Actionsheet.Content>
          {services.map((network, index) => (
            <Actionsheet.Item
              key={index}
              onPress={() => handleSelectNetwork(network)}>
              <HStack alignItems={'center'} space={'2'}>
                <Avatar size={'sm'} source={{uri: network.image?.image_url}} />
                <Text style={styles.text}>{network.service}</Text>
              </HStack>
            </Actionsheet.Item>
          ))}
        </Actionsheet.Content>
      </Actionsheet>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  unavailableText: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 100,
  },
  placeholderText: {
    fontFamily: 'Poppins-Regular',
    color: 'gray',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});

export default AirtimeScreen;
