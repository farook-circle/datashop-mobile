import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  FormControl,
  Divider,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import HeaderBackButton from '../../components/HeaderBackButton';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useSelector} from 'react-redux';
import {transferWalletFund, validateAccountId} from '../../api/wallet.api';
import {Alert} from 'react-native';

const walletTransferValidation = yup.object().shape({
  account_id: yup.string().required('User Phone number is required'),
  amount: yup.string().required('Amount is required'),
  remark: yup.string().required('Transfer Remark is required'),
});

export default function WalletTransferScreen({navigation, route}) {
  const [loading, setLoading] = React.useState(false);
  const balance = useSelector(state => state.wallet.wallet_balance);

  const handleValidateAccount = async data => {
    setLoading(true);
    const request = await validateAccountId({account_id: data.account_id});
    if (request.ok) {
      Alert.alert(
        'Information',
        `You are about to transfer ₦${data.amount} to ${request.data.data.details}`,
        [
          {text: 'Cancel'},
          {text: 'Continue', onPress: () => handleCompleteTransactions(data)},
        ],
      );

      setLoading(false);
      return;
    }

    alert(
      request.data && request.data.message
        ? request.data.message
        : 'Something went wrong please try again',
    );
    setLoading(false);
  };

  const handleCompleteTransactions = async payload => {
    setLoading(true);
    const request = await transferWalletFund(payload);
    if (request.ok) {
      Alert.alert('Success', request.data.message, [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
      setLoading(false);
      return;
    }


    alert(request.data && request.data.message ? request.data.message : 'Unable to complete your request please try again');
    setLoading(false);
  };

  return (
    <Box safeArea flex={1} px={'4'} pt={'4'}>
      <HeaderBackButton
        title={'Wallet Transfer'}
        onBackButtonPress={() => navigation.goBack()}
      />
      <Divider mt={'2'} />
      <Formik
        validationSchema={walletTransferValidation}
        initialValues={{
          account_id: '',
          amount: '',
          remark: '',
        }}
        onSubmit={value => handleValidateAccount(value)}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <VStack mt={'2'} space={'4'} flex={1}>
            <FormControl>
              <FormControl.Label>User Phone number</FormControl.Label>
              <Input
                value={values.account_id}
                onBlur={handleBlur('account_id')}
                onChangeText={handleChange('account_id')}
                placeholder="Phone number"
              />
              {errors.account_id && touched.account_id && (
                <Text color={'red.400'}>{errors.account_id}</Text>
              )}
            </FormControl>
            <FormControl>
              <HStack alignItems={'center'} justifyContent={'space-between'}>
                <FormControl.Label>Amount</FormControl.Label>
                <FormControl.Label color={'primary.500'}>
                  Balance: ₦{new Intl.NumberFormat().format(balance)}
                </FormControl.Label>
              </HStack>
              <Input
                value={values.amount}
                onBlur={handleBlur('amount')}
                onChangeText={handleChange('amount')}
                placeholder="Amount"
              />
              {errors.amount && touched.amount && (
                <Text color={'red.400'}>{errors.amount}</Text>
              )}
            </FormControl>
            <FormControl>
              <FormControl.Label>Remark</FormControl.Label>
              <Input
                value={values.remark}
                onBlur={handleBlur('remark')}
                onChangeText={handleChange('remark')}
                placeholder="Remark"
              />
              {errors.remark && touched.remark && (
                <Text color={'red.400'}>{errors.remark}</Text>
              )}
            </FormControl>
            <Box flex={1} justifyContent={'flex-end'} pb={'4'}>
              <Button onPress={handleSubmit} isLoading={loading}>
                Send
              </Button>
            </Box>
          </VStack>
        )}
      </Formik>
    </Box>
  );
}
