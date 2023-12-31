import React, {useState} from 'react';
import {
  Box,
  Text,
  Input,
  FormControl,
  HStack,
  Button,
  IconButton,
  useTheme,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import * as yup from 'yup';
import {Formik} from 'formik';
import {cardWalletDeposit} from '../../api/wallet.api';

const depositValidation = yup.object().shape({
  amount: yup
    .number()
    .required('Amount is required')
    .min(50, 'A minimum of 50NGN is required'),
});

export const CardDeposit = ({cardDepositData, onClose, onPaymentInitiated}) => {
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);

  const handleGetPaymentLink = async data => {
    setLoading(true);
    const request = await cardWalletDeposit(data);
    if (request.ok) {
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <Box px={'4'} flex={1}>
      <HStack width={'full'}>
        <IconButton
          onPress={() => onClose()}
          rounded={'full'}
          icon={<Feather name={'x'} color={colors.primary[500]} size={25} />}
        />
      </HStack>
      <Text fontSize={'md'} my={'2'}>
        Top up your wallet using card or bank transfer
      </Text>
      <Formik
        validationSchema={depositValidation}
        initialValues={{amount: ''}}
        onSubmit={value => handleGetPaymentLink(value)}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <>
            <FormControl isInvalid={errors.amount && touched.amount}>
              <FormControl.Label>Amount</FormControl.Label>
              <Input
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
            <Box p={'2'} bgColor={'primary.100'} mt={'2'} rounded={'lg'}>
              <Text>
                Processing <Text color={'primary.500'}>Fee is 1.5%</Text>
              </Text>
            </Box>
            <Button
              isLoading={loading}
              py={'3'}
              mt={'2'}
              onPress={handleSubmit}>
              Continue
            </Button>
          </>
        )}
      </Formik>
    </Box>
  );
};
