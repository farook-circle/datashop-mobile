import React, {useCallback, useEffect, useState} from 'react';
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
  Select,
} from 'native-base';
import {createStaticAccount} from '../../api/wallet.api';
import {useDispatch, useSelector} from 'react-redux';
import {UPDATE_ACCOUNT_NUMBERS} from '../../redux/constants/wallet';
import {
  Dimensions,
  FlatList,
  Pressable,
  Alert as ScreenAlert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getBankList} from '../../redux/actions/system';
import {hp, wp} from '../../config/dpTopx';
import Feather from 'react-native-vector-icons/Feather';

const {width, height} = Dimensions.get('screen');

export const AccountNumberScreen = () => {
  const navigation = useNavigation();

  const {bankList} = useSelector(state => state.system);

  const [bvn, setBvn] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankList, setShowBankList] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');

  const [searchBank, setSearchBank] = useState('');
  const [bankFilter, setBankFilter] = useState(bankList);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Function to validate Form
  const validateForm = () => {
    // BVN must be exactly 11 digits long
    if (bvn.length !== 11 || isNaN(bvn)) {
      setError('BVN must be exactly 11 digits.');
      return false;
    }

    // Account must be exactly 10 digit
    if (accountNumber.length !== 10 || isNaN(accountNumber)) {
      setError('Account number must be exactly 10 digit');
      return false;
    }

    if (!bankCode) {
      setError('You must select your bank to continue');
      return false;
    }

    setError('');
    return true;
  };

  // Function to simulate virtual account number generation
  const generateVirtualAccount = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const request = await createStaticAccount({
      bvn,
      code: bankCode,
      account: accountNumber,
    });
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

  useEffect(() => {
    dispatch(getBankList());
  }, [dispatch]);

  const handleFilterBank = useCallback(() => {
    if (bankList.length < 1) {
      return;
    }

    if (searchBank.length < 1) {
      setBankFilter(bankList);
      return;
    }

    const newBankList = bankList?.filter(item =>
      item?.name?.toLowerCase().includes(searchBank.toLowerCase()),
    );

    setBankFilter(newBankList);
  }, [bankList, searchBank]);

  useEffect(() => {
    handleFilterBank();
  }, [handleFilterBank]);

  return (
    <>
      <MainLayout headerTitle={'Get Account Number'} showHeader={true}>
        <ScrollView px={'4'} mt={'5'}>
          <VStack space={4}>
            {/* Information about BVN collection */}
            <Box bg="info.100" p="4" rounded="md" mb="5">
              <Text fontSize="md" color="info.800" fontWeight="bold">
                Why We Need Your BVN
              </Text>
              <Text fontSize="sm" mt="2">
                In compliance with the regulations set by the Central Bank of
                Nigeria (CBN), we are required to collect your BVN before
                creating a virtual account number for you.
              </Text>
              <Text fontSize="sm" mt="2">
                Your BVN helps verify your identity and ensure that your account
                is secure. We guarantee that your BVN will not be stored or
                shared with third parties, and it will only be used for this
                process.
              </Text>
            </Box>

            {/* Alert to display errors */}
            {error ? (
              <Alert w="100%" status="error">
                <HStack space={2} flexShrink={1} justifyContent="space-between">
                  <HStack space={2} flexShrink={1} alignItems={'center'}>
                    <Alert.Icon />
                    <Text fontSize={'sm'}>{error}</Text>
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
              placeholder="Enter your BVN"
              value={bvn}
              keyboardType="numeric"
              maxLength={11}
              size={'lg'}
              py={'3'}
              onChangeText={text => setBvn(text)}
              isDisabled={loading}
            />

            <Pressable
              style={styles.selectInput}
              onPress={() => setShowBankList(true)}>
              <Text fontSize={'md'} color={bankName ? 'black' : 'gray.400'}>
                {bankName || 'Choose your bank'}
              </Text>
            </Pressable>

            <Input
              placeholder="Your Account number"
              value={accountNumber}
              keyboardType="numeric"
              maxLength={11}
              size={'lg'}
              py={'3'}
              onChangeText={text => setAccountNumber(text)}
              isDisabled={loading}
            />

            {/* Submit button */}
            <Button
              onPress={generateVirtualAccount}
              isLoading={loading}
              size={'lg'}
              py={'3'}
              isDisabled={loading}>
              Generate Virtual Account Number
            </Button>
          </VStack>
        </ScrollView>
      </MainLayout>
      {showBankList && (
        <Pressable
          style={styles.modelContainer}
          onPress={() => setShowBankList(false)}>
          <View style={styles.itemWrapper}>
            <Input
              size={'lg'}
              py={'3'}
              placeholder="Search banks..."
              mb={'4'}
              value={searchBank}
              onChangeText={text => setSearchBank(text)}
            />
            <FlatList
              data={bankFilter}
              keyExtractor={item => item.code}
              renderItem={({item}) => (
                <TouchableOpacity
                  activeOpacity={0.4}
                  onPress={() => {
                    setBankCode(item?.code);
                    setBankName(item?.name);
                    setShowBankList(false);
                    setSearchBank('');
                  }}>
                  <Text style={styles.text}>{item?.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modelContainer: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'absolute',
    zIndex: 100,
    justifyContent: 'flex-end',
  },

  itemWrapper: {
    height: '80%',
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    backgroundColor: 'white',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(14),
    marginVertical: hp(5),
  },
});
