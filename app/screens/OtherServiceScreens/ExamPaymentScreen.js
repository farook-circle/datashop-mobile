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
  electricityBillPayment,
  examBillPayment,
  validateSmartCardNumber,
} from '../../api/service.api';
import {formatCurrency} from '../../utils';

const defaultValues = {
  amount: '',
  provider: '',
  quantity: 1,
};

const electricityPaymentValidation = yup.object().shape({
  provider: yup.string().required('Please select electricity provider'),
  quantity: yup
    .number()
    .min(1, 'Minimum Quantity is 1')
    .required('Please provider quantity to buy'),
});

const meterValidationInitial = {
  error: false,
  validate: false,
  message: '',
};

export const ExamPaymentScreen = ({navigation}) => {
  const {exam} = useSelector(state => state.bill_payment);

  const [selectedProvider, setSelectedProvider] = useState();
  const [toggleSelectNetwork, setToggleSelectNetwork] = useState(false);
  const [selectedCable, setSelectedCable] = useState(null);

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
  
    setLoading(true);
    const request = await examBillPayment(form);
    if (request.ok) {
      Alert.alert(
        'Payment Success',
        request.data
          ? request.data?.message
          : 'Exam Payment Order added successfully',
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

  return (
    <MainLayout headerTitle={'Exam payment'} showHeader={true}>
      <Box flex={1} px={'4'}>
        {!exam.available ? (
          <Box flex={'1'} alignItems={'center'} justifyContent={'center'}>
            <Text>{exam.message}</Text>
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
                  isInvalid={errors.quantity && touched.quantity}>
                  <FormControl.Label>Quantity</FormControl.Label>
                  <Input
                    value={values.quantity}
                    onChangeText={handleChange('quantity')}
                    onBlur={handleBlur('quantity')}
                    placeholder="Quantity"
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
                    {errors.quantity}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={errors.amount && touched.amount}>
                  <FormControl.Label>Amount</FormControl.Label>
                  <Input
                    isDisabled={true}
                    value={formatCurrency(
                      selectedProvider?.amount * values.quantity || 0,
                    )}
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
        <Button onPress={formRef.current?.handleSubmit} isLoading={loading}>
          Continue
        </Button>
      </Box>
      <Actionsheet
        isOpen={toggleSelectNetwork}
        onClose={() => setToggleSelectNetwork(false)}>
        <Actionsheet.Content>
          {exam?.providers?.map((provider, index) => (
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

export default ExamPaymentScreen;
