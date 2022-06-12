import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import {hp, wp} from '../config/dpTopx';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  createVirtualAccount,
  depositMoneyToWallet,
  getVirtualAccount,
  getWalletBalance,
} from '../redux/actions/wallet';
import CompleteCardPayment from '../components/CompleteCardPayment';
import AccountNumber from '../components/AccountNumber';
import MomoAgent from '../components/MomoAgent';
import AlternatePayment from '../components/AlternatePayment';
import AirtimePaymentFunding from '../components/AirtimePaymentFunding';

export default function DepositToWallet({navigation, route}) {
  useEffect(() => {
    dispatch(getVirtualAccount());
  }, []);

  const dispatch = useDispatch();
  const [amount, setAmount] = useState('0');
  const [selectedId, setSelectedPaymentMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [initWithCard, setInitWithCard] = useState(false);
  const [initWithAccount, setInitWithAccount] = useState(false);
  const [initWithMomoAgent, setInitWithMomoAgent] = useState(false);
  const [initWithManualFunding, setInitWithManualFunding] = useState(false);
  const [initWithAirtimeFunding, setInitWithAirtimeFunding] = useState(false);
  const [init, setInit] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);

  const payment_status = useSelector(state => state.wallet.payment_status);

  const getDepositFee = type => {
    const fee = payment_status.filter(item => item.type === type)[0];

    if (fee.fee) {
      return fee.fee;
    }

    return 'Free';
  };

  const payment_method = [
    {
      id: 1,
      type: 'Card or Ussd',
      payment_method: 'card',
      transfer_fee: getDepositFee('card'),
    },
    {
      id: 2,
      type: 'Bank Transfer',
      payment_method: 'bank_transfer',
      transfer_fee: getDepositFee('bank_transfer'),
    },
    {
      id: 3,
      type: 'Momo Agent',
      payment_method: 'momo_agent',
      transfer_fee: getDepositFee('momo_agent'),
    },
    {
      id: 4,
      type: 'Manual Funding',
      payment_method: 'manual_funding',
      transfer_fee: getDepositFee('manual_funding'),
    },
    {
      id: 5,
      type: 'Airtime Funding',
      payment_method: 'airtime_funding',
      transfer_fee: getDepositFee('airtime_funding'),
    },
  ];

  const handleNumericInput = value => {
    if (amount.length == 7) {
      return;
    }
    if (amount == 0) {
      setAmount(value);

      return;
    }
    const newAmount = amount + value;
    setAmount(newAmount);
  };

  const togglePaymentMethod = id => {
    const payment = payment_method.filter(item => item.id === id)[0];

    const status = payment_status.filter(
      item => item.type === payment.payment_method,
    )[0];
    if (!status.status) {
      alert(`${payment.type} Deposit is not available at the moment`);
      setSelectedPaymentMethod(null);
      return;
    }
    setSelectedPaymentMethod(id);
    setPaymentMethod(payment.payment_method);
  };

  const handleDeletButton = () => {
    if (amount.length === 1) {
      setAmount('0');
      return;
    }
    const newAmount = amount.slice(0, amount.length - 1);
    setAmount(newAmount);
  };
  const handleDeposit = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (paymentMethod === 'card') {
      setLoading(true);
      dispatch(depositMoneyToWallet(amount, completeCardDeposit));
    } else if (paymentMethod === 'bank_transfer') {
      setLoading(true);
      dispatch(createVirtualAccount(amount, completeWithAccount));
    } else if (paymentMethod === 'momo_agent') {
      setLoading(false);
      setInit(false);
      setInitWithMomoAgent(true);
    } else if (paymentMethod === 'manual_funding') {
      setLoading(false);
      setInit(false);
      setInitWithManualFunding(true);
    } else if (paymentMethod === 'airtime_funding') {
      setLoading(false);
      setInit(false);
      setInitWithAirtimeFunding(true);
    }
  };

  const completeCardDeposit = status => {
    if (status === false) {
      alert('Sorry an error has occur please check your network');
      setLoading(false);
      return;
    }
    setLoading(false);
    setPaymentLink(status.data.link);
    setInit(false);
    setInitWithCard(true);
  };

  const completeWithAccount = status => {
    if (status === false) {
      alert('Sorry an error has occur please check your network');
      setLoading(false);
      return;
    }
    setLoading(false);
    setInit(false);
    setInitWithAccount(true);
  };

  const completeWithMomoAgent = status => {
    if (status === false) {
      alert('Sorry an error has occur please check your network');
      setLoading(false);
      return;
    }
    setLoading(false);
    setInit(false);
    setInitWithAccount(true);
  };

  const completeWithManualFunding = status => {
    if (status === false) {
      alert('Sorry an error has occur please check your network');
      setLoading(false);
      return;
    }
    setLoading(false);
    setInit(false);
    setInitWithAccount(true);
  };

  const reloadAndGoBack = () => {
    dispatch(getWalletBalance());
    navigation.goBack();
  };

  const renderPaymentMethod = ({item}) => {
    return (
      <TouchableOpacity onPress={() => togglePaymentMethod(item.id)}>
        <View
          style={[
            styles.PaymentMethodItemWrapper,
            selectedId === item.id ? {backgroundColor: colors.primary} : {},
          ]}>
          <Text
            style={[
              styles.paymentMethodType,
              selectedId === item.id ? {color: colors.textWhite} : {},
            ]}>
            {item.type}
          </Text>
        </View>
        <Text
          style={[
            styles.paymentMethodFee,
            item.transfer_fee === 'Free' ? {color: 'green'} : {color: 'red'},
          ]}>
          Fee: {item.transfer_fee == 'Free' ? '' : '\u20A6'}
          {item.transfer_fee}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={reloadAndGoBack}>
            <Feather
              name="chevron-left"
              size={hp(35)}
              color={colors.textBlack}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Deposit</Text>
          <Text>{'  '}</Text>
        </View>
      </SafeAreaView>
      {/* <View style={styles.balanceContainerWrapper}>
        <View style={styles.balanceTextWrapper}>
          <Text style={styles.balanceTitle}>BALANCE:</Text>
          <Text style={styles.balanceText}>{'\u20A6'}0.00</Text>
        </View>
      </View> */}

      {initWithCard && <CompleteCardPayment link={paymentLink} />}

      {initWithAccount && <AccountNumber />}
      {initWithMomoAgent && <MomoAgent amount={amount} />}
      {initWithManualFunding && <AlternatePayment />}
      {initWithAirtimeFunding && <AirtimePaymentFunding />}

      {init && (
        <>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: hp(16),
              paddingHorizontal: wp(25),
              marginTop: hp(10),
              color: colors.primary,
            }}>
            Deposit To your wallet Using ?
          </Text>
          <View style={styles.paymentTypeWrapper}>
            <FlatList
              data={payment_method}
              renderItem={renderPaymentMethod}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          {/* <Text style={styles.textNote}>
        Please press Card or Bank and enter amount you wish to deposit please
        know that a charge of 1.4 % will be applied
      </Text> */}
          <View style={styles.textInputWrapper}>
            <Text style={styles.nairaSign}>{'\u20A6'}</Text>
            <Text style={styles.amountText}>{amount}</Text>
            {/* <TextInput
          keyboardType="numeric"
          placeholder="0.00"
          style={styles.textInput}
        /> */}
          </View>
          {/* <Text style={styles.processingFee}>Proccessing Fee</Text> */}
          <View style={styles.numericInputWrapper}>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('1')}>
              <Text style={styles.numberText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('2')}>
              <Text style={styles.numberText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('3')}>
              <Text style={styles.numberText}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.numericInputWrapper}>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('4')}>
              <Text style={styles.numberText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('5')}>
              <Text style={styles.numberText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('6')}>
              <Text style={styles.numberText}>6</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.numericInputWrapper}>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('7')}>
              <Text style={styles.numberText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('8')}>
              <Text style={styles.numberText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('9')}>
              <Text style={styles.numberText}>9</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.numericInputWrapper}>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('.')}>
              <Text style={styles.numberText}>.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={() => handleNumericInput('0')}>
              <Text style={styles.numberText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberContainer}
              onPress={handleDeletButton}>
              <Feather name="delete" size={hp(30)} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.shareReceiptButton,
              Number(amount) < 100 ? {backgroundColor: colors.textLight} : '',
            ]}
            disabled={Number(amount) < 100 ? true : false}
            onPress={handleDeposit}>
            {isLoading ? (
              <ActivityIndicator color={colors.textWhite} size={'large'} />
            ) : (
              <Text style={styles.shareReceiptText}>DEPOSIT</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
  },
  balanceContainerWrapper: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    marginTop: hp(7),
    height: hp(100),
    width: wp(370),
    backgroundColor: colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  balanceTextWrapper: {
    width: wp(150),
    height: hp(60),
  },
  balanceTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    color: colors.textLight,
  },
  balanceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    color: colors.textWhite,
  },
  paymentTypeWrapper: {
    marginTop: hp(10),
    flexDirection: 'row',
    width: '100%',
    height: hp(90),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  PaymentMethodItemWrapper: {
    width: wp(70),
    marginRight: wp(10),
    height: '70%',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
  },
  paymentMethodType: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp(12),
    color: colors.primary,
  },
  paymentMethodFee: {
    fontFamily: 'Poppins-Bold',
    marginTop: 4,
  },
  usingCard: {
    width: wp(170),
    height: hp(83),
    borderWidth: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary,
  },
  usingCardText: {
    fontFamily: 'Poppins-Light',
    fontSize: hp(15),
  },
  usingBank: {
    width: wp(170),
    height: hp(83),
    borderWidth: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary,
  },
  usingBankTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(20),
    color: colors.primary,
  },
  usingBankSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(10),
  },
  textNote: {
    marginTop: hp(19),
    fontFamily: 'Poppins-Regular',
    fontSize: hp(14),
    paddingHorizontal: 25,
    textAlign: 'center',
  },
  textInputWrapper: {
    flexDirection: 'row',
    marginTop: hp(10),
    width: '100%',
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(40),
    textAlign: 'center',
    color: colors.primary,
    minWidth: 150,
  },
  nairaSign: {
    color: colors.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(40),
  },
  amountText: {
    marginHorizontal: 10,
    color: colors.primary,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(60),
  },
  processingFee: {
    fontFamily: 'Poppins-Light',
    color: colors.textLight,
    fontSize: hp(20),
    textAlign: 'center',
    marginBottom: hp(5),
  },
  numericInputWrapper: {
    width: '100%',
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberContainer: {
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  numberText: {
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    fontSize: hp(30),
  },
  shareReceiptButton: {
    marginTop: hp(10),
    width: wp(300),
    height: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  shareReceiptText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: colors.textWhite,
    fontSize: hp(18),
  },
});
