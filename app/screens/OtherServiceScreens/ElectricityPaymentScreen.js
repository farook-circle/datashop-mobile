/* eslint-disable react-native/no-inline-styles */
import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {MainLayout} from '../../components';
import {
  Input,
  FormControl,
  Button,
  HStack,
  Pressable,
  Box,
  Avatar,
  Select,
  Actionsheet,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {
  electricityBillPayment,
  validateMeterNumber,
} from '../../api/service.api';
import {getDataPurchaseHistory} from '../../redux/actions/data_plans';
import {getWalletBalance} from '../../redux/actions/wallet';
import uuid from 'react-native-uuid';
import {formatCurrency} from '../../utils';

const defaultValues = {
  amount: '',
  provider: '',
  meter_number: '',
  meter_type: '',
};

const electricityPaymentValidation = yup.object().shape({
  provider: yup.string().required('Please select electricity provider'),
  meter_type: yup.string().required('Please select your meter type'),
  meter_number: yup.number().required('Please provider your meter number'),
  amount: yup
    .number()
    .min(500, 'Minimum amount to top up is 500')
    .required('Please provider amount to top up'),
});

const meterValidationInitial = {
  error: false,
  validate: false,
  message: '',
};

export const ElectricityPaymentScreen = ({navigation}) => {
  const {electricity} = useSelector(state => state.bill_payment);
  const dispatch = useDispatch();

  const [selectedProvider, setSelectedProvider] = useState();
  const [toggleSelectNetwork, setToggleSelectNetwork] = useState(false);
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

  const handlePurchaseElectricityBill = async form => {
    if (!meterValidation.validate) {
      return handleValidateMeterNumber(form);
    }
    Alert.alert(
      'Electricity Bill Payment',
      `You are about to pay ${formatCurrency(form.amount)} for ${
        form.meter_number
      } ${selectedProvider?.title} electricity bill`,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Pay',
          onPress: () => completeBillPayment(form),
        },
      ],
    );
  };

  const completeBillPayment = async form => {
    setLoading(true);
    const request = await electricityBillPayment({...form, reference});
    if (request.ok) {
      dispatch(getDataPurchaseHistory());
      dispatch(getWalletBalance());
      Alert.alert(
        'Payment Success',
        request.data
          ? request.data?.message
          : 'Electricity Bill payment success',
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
    const request = await validateMeterNumber({
      meter_number: form.meter_number,
      meter_type: form.meter_type,
      disco_name: selectedProvider?.validation_code,
    });

    if (request.ok) {
      setMeterValidation({
        ...meterValidation,
        validate: true,
        error: false,
        message: request.data?.meter_name,
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    setMeterValidation({
      ...meterValidation,
      validate: false,
      error: true,
      message: request.data ? request.data.message : 'Invalid meter number',
    });
  };

  return (
    <MainLayout headerTitle={'Electricity'} showHeader={true}>
      <Box flex={1} px={'4'}>
        {!electricity.available ? (
          <Box flex={'1'} alignItems={'center'} justifyContent={'center'}>
            <Text>{electricity.message}</Text>
          </Box>
        ) : (
          <Formik
            innerRef={formRef}
            initialValues={defaultValues}
            validationSchema={electricityPaymentValidation}
            onSubmit={data => handlePurchaseElectricityBill(data)}>
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
                  <FormControl.Label>
                    Select Electricity Provider
                  </FormControl.Label>
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
                          <Text>{selectedProvider?.title}</Text>
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
                  isInvalid={errors.meter_type && touched.meter_number}>
                  <FormControl.Label>Meter Type</FormControl.Label>
                  <Select
                    size={'lg'}
                    py={'3'}
                    onValueChange={value => {
                      setMeterValidation(meterValidationInitial);
                      setFieldValue('meter_type', value);
                    }}
                    accessibilityLabel="Meter Type"
                    placeholder="Meter Type"
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <Feather name={'chevron-down'} size={5} />,
                    }}
                    mt="1">
                    <Select.Item label="Prepaid" value="Prepaid" />
                    <Select.Item label="Postpaid" value="Postpaid" />
                  </Select>
                  <FormControl.ErrorMessage
                    leftIcon={<Feather name="info" size={10} />}>
                    {errors.meter_type}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.meter_number && touched.meter_number}>
                  <FormControl.Label>Meter Number</FormControl.Label>
                  <Input
                    value={values.meter_number}
                    onChangeText={handleChange('meter_number')}
                    onBlur={handleBlur('meter_number')}
                    keyboardType="number-pad"
                    onFocus={() => setMeterValidation(meterValidationInitial)}
                    placeholder="Meter Number"
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
                    {errors.meter_number}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.amount && touched.amount}>
                  <FormControl.Label>Amount</FormControl.Label>
                  <Input
                    keyboardType="number-pad"
                    value={values.amount}
                    onChangeText={handleChange('amount')}
                    onBlur={handleBlur('amount')}
                    placeholder="Amount"
                    size={'lg'}
                    py={'3'}
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<Feather name="info" size={10} />}>
                    {errors.amount}
                  </FormControl.ErrorMessage>
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
          {electricity?.providers?.map((provider, index) => (
            <Actionsheet.Item
              key={index}
              onPress={() => handleSetProvider(provider)}>
              <HStack alignItems={'center'} space={'2'}>
                <Avatar size={'sm'} source={{uri: provider.image?.image_url}} />
                <Text style={styles.text}>{provider.title}</Text>
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

export default ElectricityPaymentScreen;
