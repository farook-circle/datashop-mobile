/* eslint-disable react-native/no-inline-styles */
import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {MainLayout} from '../../components';
import {
  Input,
  FormControl,
  Button,
  HStack,
  VStack,
  Pressable,
  Box,
  Avatar,
  Select,
  Actionsheet,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useSelector} from 'react-redux';
import {
  cableBillPayment,
  electricityBillPayment,
  validateMeterNumber,
  validateSmartCardNumber,
} from '../../api/service.api';
import {formatCurrency} from '../../utils';
import uuid from 'react-native-uuid';

const defaultValues = {
  amount: '',
  provider: '',
  smart_card_number: '',
  cable_item: '',
};

const electricityPaymentValidation = yup.object().shape({
  provider: yup.string().required('Please select electricity provider'),
  cable_item: yup.string().required('Please select your package'),
  smart_card_number: yup
    .number()
    .required('Please provider your smart card number'),
});

const meterValidationInitial = {
  error: false,
  validate: false,
  message: '',
};

export const TvSubscriptionScreen = ({navigation}) => {
  const {cable} = useSelector(state => state.bill_payment);

  const [selectedProvider, setSelectedProvider] = useState();
  const [toggleSelectNetwork, setToggleSelectNetwork] = useState(false);
  const [selectedCable, setSelectedCable] = useState(null);

  const reference = uuid.v4();
  const [loading, setLoading] = useState(false);
  const [meterValidation, setMeterValidation] = useState(
    meterValidationInitial,
  );
  const formRef = useRef();

  const handleSetProvider = provider => {
    setSelectedProvider(provider);
    formRef.current?.setFieldValue('provider', provider.id);
    setToggleSelectNetwork(false);
    setMeterValidation(meterValidationInitial);
  };

  const handleRequestForConfirmation = async form => {
    if (!meterValidation.validate) {
      return handleValidateMeterNumber(form);
    }

    Alert.alert(
      'Confirm Payment',
      `You are about to pay ${formatCurrency(selectedCable.amount)} for ${
        selectedCable?.name
      } are you sure you want to continue?`,
      [
        {text: 'Cancel'},
        {text: 'Continue', onPress: () => handlePurchaseElectricityBill(form)},
      ],
    );
  };

  const handlePurchaseElectricityBill = async form => {
    setLoading(true);
    const request = await cableBillPayment({...form, reference});
    if (request.ok) {
      Alert.alert(
        'Payment Success',
        request.data ? request.data?.message : 'Cable Bill payment success',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ],
      );
      setLoading(false);
      return;
    }

    setLoading(false);

    Alert.alert(
      'Payment Error',
      request.data ? request.data?.failed : 'Unable to complete your request',
    );
  };

  const handleValidateMeterNumber = async form => {
    setLoading(true);
    const request = await validateSmartCardNumber({
      cable_name: selectedProvider.name,
      smart_card_number: form.smart_card_number,
    });

    if (request.ok) {
      setMeterValidation({
        ...meterValidation,
        validate: true,
        error: false,
        message: request.data?.name,
      });

      setLoading(false);
      return;
    }

    setLoading(false);
    setMeterValidation({
      ...meterValidation,
      validate: false,
      error: true,
      message: request.data ? request.data.message : 'Invalid cable number',
    });
  };

  return (
    <MainLayout headerTitle={'Cable Subscriptions'} showHeader={true}>
      <Box flex={1} px={'4'}>
        {!cable.available ? (
          <Box flex={'1'} alignItems={'center'} justifyContent={'center'}>
            <Text>{cable.message}</Text>
          </Box>
        ) : (
          <Formik
            innerRef={formRef}
            initialValues={defaultValues}
            validationSchema={electricityPaymentValidation}
            onSubmit={data => handleRequestForConfirmation(data)}>
            {({
              errors,
              touched,
              values,
              handleBlur,
              handleSubmit,
              handleChange,
              setFieldValue,
            }) => (
              <>
                <FormControl
                  isRequired
                  isInvalid={errors.provider && touched.provider}>
                  <FormControl.Label>Select Provider</FormControl.Label>
                  <Pressable onPress={() => setToggleSelectNetwork(true)}>
                    <HStack
                      px={2}
                      rounded={'4'}
                      py={'3'}
                      borderWidth={1}
                      borderColor={'gray.200'}
                      alignItems={'center'}
                      justifyContent={'space-between'}>
                      {selectedProvider ? (
                        <HStack alignItems={'center'} space={'2'}>
                          <Avatar
                            size={'xs'}
                            alt={'network image'}
                            source={{
                              uri: selectedProvider?.image?.image_url,
                            }}
                          />
                          <Text>{selectedProvider?.name}</Text>
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
                    {errors.provider}
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={errors.package && touched.package}>
                  <FormControl.Label>Package</FormControl.Label>
                  <Select
                    size={'lg'}
                    py={'3'}
                    onValueChange={value => {
                      setMeterValidation(meterValidationInitial);
                      const cable_item = JSON.parse(value);
                      setFieldValue('cable_item', cable_item.id);
                      setSelectedCable(cable_item);
                    }}
                    accessibilityLabel="Package"
                    placeholder="Package"
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <Feather name={'chevron-down'} size={5} />,
                    }}
                    mt="1">
                    {selectedProvider &&
                      selectedProvider.cable_items.map((item, index) => (
                        <Select.Item
                          key={index}
                          label={`${item.name}`}
                          value={JSON.stringify(item)}
                        />
                      ))}
                  </Select>
                  <FormControl.ErrorMessage
                    leftIcon={<Feather name="info" size={10} />}>
                    {errors.meter_type}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    errors.smart_card_number && touched.smart_card_number
                  }>
                  <FormControl.Label>Smart Card Number</FormControl.Label>
                  <Input
                    keyboardType="number-pad"
                    value={values.smart_card_number}
                    onChangeText={text => {
                      setFieldValue('smart_card_number', text);
                      setMeterValidation(meterValidationInitial);
                    }}
                    onBlur={handleBlur('smart_card_number')}
                    onFocus={() => {
                      setMeterValidation(meterValidationInitial);
                    }}
                    placeholder="Smart Card Number"
                    size={'lg'}
                    py={'3'}
                  />
                  {(meterValidation.error || meterValidation.validate) && (
                    <Text
                      style={{
                        marginTop: 4,
                        textAlign: 'right',
                        color: meterValidation.validate ? 'green' : 'red',
                      }}>
                      {meterValidation.message}
                    </Text>
                  )}
                  <FormControl.ErrorMessage
                    leftIcon={<Feather name="info" size={10} />}>
                    {errors.smart_card_number}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.amount && touched.amount}>
                  <FormControl.Label>Amount</FormControl.Label>
                  <Input
                    isDisabled={true}
                    value={formatCurrency(selectedCable?.amount || 0)}
                    onChangeText={handleChange('amount')}
                    onBlur={handleBlur('amount')}
                    placeholder="Amount"
                    size={'lg'}
                    py={'3'}
                  />
                </FormControl>
              </>
            )}
          </Formik>
        )}
      </Box>
      <Box px={'4'} pb={'2'}>
        {meterValidation.validate ? (
          <Button onPress={formRef.current?.handleSubmit} isLoading={loading}>
            Continue
          </Button>
        ) : (
          <Button onPress={formRef.current?.handleSubmit} isLoading={loading}>
            Validate
          </Button>
        )}
      </Box>
      <Actionsheet
        isOpen={toggleSelectNetwork}
        onClose={() => setToggleSelectNetwork(false)}>
        <Actionsheet.Content>
          {cable?.providers?.map((provider, index) => (
            <Actionsheet.Item
              key={index}
              onPress={() => handleSetProvider(provider)}>
              <HStack alignItems={'center'} space={'2'}>
                <Avatar size={'sm'} source={{uri: provider.image?.image_url}} />
                <Text style={styles.text}>{provider.name}</Text>
              </HStack>
            </Actionsheet.Item>
          ))}
        </Actionsheet.Content>
      </Actionsheet>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});

export default TvSubscriptionScreen;
