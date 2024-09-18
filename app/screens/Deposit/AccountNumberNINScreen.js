import React, {useState} from 'react';
import {MainLayout} from '../../components';
import {
  ScrollView,
  Text,
  Input,
  Button,
  VStack,
  Alert,
  HStack,
  IconButton,
  CloseIcon,
  Box,
  Link,
} from 'native-base';
import {createStaticAccount} from '../../api/wallet.api';
import {useDispatch} from 'react-redux';
import {UPDATE_ACCOUNT_NUMBERS} from '../../redux/constants/wallet';
import {Alert as ScreenAlert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const AccountNumberNINScreen = () => {
  const navigation = useNavigation();

  const [bvn, setBvn] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Function to validate BVN
  const validateBVN = () => {
    // BVN must be exactly 11 digits long
    if (bvn.length !== 11 || isNaN(bvn)) {
      setError('NIN must be exactly 11 digits.');
      return false;
    }
    setError('');
    return true;
  };

  // Function to simulate virtual account number generation
  const generateVirtualAccount = async () => {
    if (!validateBVN()) return;

    setLoading(true);

    const request = await createStaticAccount({nin: bvn});
    if (request.ok) {
      dispatch({type: UPDATE_ACCOUNT_NUMBERS, payload: request.data});
      ScreenAlert.alert(
        'Success',
        'You have successfully created your account number',
        [{text: 'Continue', onPress: () => navigation.goBack()}],
      );
      setLoading(false);
      return;
    }

    const requestError =
      request.data?.message || 'Unable to complete your request';
    ScreenAlert.alert(requestError);
    setLoading(false);
  };

  return (
    <MainLayout headerTitle={'Get Account Number'} showHeader={true}>
      <ScrollView px={'4'} mt={'5'}>
        <VStack space={4}>
          {/* Information about BVN collection */}
          <Box bg="info.100" p="4" rounded="md" mb="5">
            <Text fontSize="md" color="info.800" fontWeight="bold">
              Why We Need Your NIN
            </Text>
            <Text fontSize="sm" mt="2">
              In compliance with the regulations set by the Central Bank of
              Nigeria (CBN), we are required to collect your NIN before creating
              a virtual account number for you.
            </Text>
            <Text fontSize="sm" mt="2">
              Your NIN helps verify your identity and ensure that your account
              is secure. We guarantee that your NIN will not be stored or shared
              with third parties, and it will only be used for this process.
            </Text>
          </Box>

          {/* Alert to display errors */}
          {error ? (
            <Alert w="100%" status="error">
              <HStack space={2} flexShrink={1} justifyContent="space-between">
                <HStack space={2} flexShrink={1} alignItems={'center'}>
                  <Alert.Icon mt="1" />
                  <Text>{error}</Text>
                </HStack>
                <IconButton
                  icon={<CloseIcon size="xs" />}
                  onPress={() => setError('')}
                />
              </HStack>
            </Alert>
          ) : null}

          {/* Input field for BVN */}
          <Input
            placeholder="Enter your NIN"
            value={bvn}
            keyboardType="numeric"
            maxLength={11}
            py={'3'}
            size={'lg'}
            onChangeText={text => setBvn(text)}
            isDisabled={loading}
          />

          {/* Submit button */}
          <Button
            onPress={generateVirtualAccount}
            isLoading={loading}
            isDisabled={loading}>
            Generate Virtual Account Number
          </Button>
        </VStack>
      </ScrollView>
    </MainLayout>
  );
};
