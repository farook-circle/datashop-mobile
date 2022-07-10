/* eslint-disable react-native/no-inline-styles */
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
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataPurchaseHistory} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import OverLayModel from '../components/OverLayModel';
import BottomModel from '../components/BottomModel';
import {buyAirtime} from '../redux/actions/airtime';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function Airtime({navigation}) {
  const dispatch = useDispatch();

  const [selectedService, setSelectedService] = useState(null);
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [customer, setCustomer] = useState('');
  const [rechargeType, setRechargeType] = useState(null);
  const [validate, setValidate] = useState(false);

  const [toggleRechargeType, setToggleRechargeType] = useState(false);
  const [toggleRechargeTypeSelect, setToggleRechargeTypeSelect] =
    useState(false);

  const airtime = useSelector(state => state.airtime.airtime);
  const balance = useSelector(state => state.wallet.wallet_balance);

  const [isLoading, setIsLoading] = useState(false);
  const [isBuyLoading, setIsBuyLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);

  useEffect(() => {
    if (Number(amount) > 50) {
      setDiscount(calculatePercentage());
    }
  }, [amount]);

  const calculatePercentage = () => {
    const total = Number(amount) / 100;
    return Number(Number(amount) - total * selectedService.discount);
  };

  useEffect(() => {
    if (!airtime.available) {
      var timeOutId = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeOutId);
    };
  }, []);

  const handelSetRechargeType = item => {
    setToggleRechargeTypeSelect(false);
    setRechargeType(item);
  };

  const getServiceImage = service => {
    switch (service.toLowerCase()) {
      case 'mtn':
        return require('../../assets/images/mtn.jpg');
      case 'airtel':
      case 'zain':
        return require('../../assets/images/airtel.jpg');
      case 'etisalat':
      case '9mobile':
        return require('../../assets/images/9mobile.jpg');
      case 'glo':
        return require('../../assets/images/glo.png');
      default:
        return require('../../assets/images/bank-building.png');
    }
  };

  const validateAndBuy = () => {
    if (customer.length !== 11) {
      return;
    }
    if (amount === '' || amount === '0') {
      return;
    }
    if (Number(amount) < 50) {
      alert('Amount cannot be less thant 50 naira');
      return;
    }
    if (balance < Number(amount)) {
      alert('You do not have sufficient balance. Please fund your wallet');
      return;
    }
    // Alert.alert(
    //   'Alert',
    //   `you are about time buy ${amount} naira airtime to ${customer}`,
    //   [{text: 'Cancel'}, {text: 'OK', onPress: () => buyAirtime()}],
    // );
    setValidate(true);
  };

  const handleBuyAirtime = () => {
    setIsBuyLoading(true);

    dispatch(
      buyAirtime(
        {
          amount,
          customer,
          recharge_type: rechargeType,
          service: selectedService.id,
        },
        handleResponse,
      ),
    );

    // send request to buy airtime
  };

  const handleResponse = (res_data, res_status) => {
    if (res_status < 300) {
      // success
      alert(
        'Your order has been successfully submitted✔️. Thank you for choosing DataShop',
      );
      navigation.navigate('Home');
      return;
    }

    // error
    console.log(res_data);
    setIsBuyLoading(false);
    setValidate(false);
  };

  if (!airtime.available) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size={40} color={colors.primary} />
        ) : (
          <>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: hp(14),
                color: colors.textBlack,
              }}>
              Not available at the moment
            </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{padding: hp(10), backgroundColor: colors.textBlack}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: colors.textWhite,
                }}>
                go back
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
  return (
    <>
      {toggleRechargeTypeSelect && (
        <BottomModel
        // onBlankPress={() =>
        //   setToggleRechargeTypeSelect(!toggleRechargeTypeSelect)
        // }
        >
          <View style={styles.electProviderWrapper}>
            <TouchableOpacity
              onPress={() =>
                setToggleRechargeTypeSelect(!toggleRechargeTypeSelect)
              }>
              <Feather name="x" color={colors.textBlack} size={30} />
            </TouchableOpacity>

            <FlatList
              data={selectedService.recharge_type.split(',')}
              keyExtractor={item => item}
              renderItem={({item}) => (
                // items
                <TouchableOpacity
                  style={styles.itemWrapper}
                  onPress={() => handelSetRechargeType(item)}>
                  <Text style={styles.itemTitle}>{item}</Text>
                  <Feather
                    name="chevron-right"
                    size={25}
                    color={colors.textLight}
                  />
                </TouchableOpacity>

                // items
              )}
            />
          </View>
        </BottomModel>
      )}

      {validate && (
        <BottomModel
          onBlankPress={() => setValidate(false)}
          style={{background: 'white'}}>
          <View
            style={{
              backgroundColor: 'white',
              paddingTop: hp(30),
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingHorizontal: 25,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: hp(16),
                color: colors.textBlack,
              }}>
              You are about to buy {amount} airtime to {customer}
            </Text>
            {/* <TextInput
              placeholder="PIN"
              keyboardType={'numeric'}
              maxLength={4}
              autoFocus={true}
              style={{fontSize: hp(30)}}
              textAlign={'center'}
              secureTextEntry={true}
            /> */}
            <TouchableOpacity
              style={[
                styles.buttonBody,
                {marginTop: hp(10)},
                isBuyLoading && {backgroundColor: colors.textLight},
              ]}
              onPress={handleBuyAirtime}
              disabled={isBuyLoading ? true : false}>
              {isBuyLoading ? (
                <ActivityIndicator size={'large'} color={colors.textWhite} />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </BottomModel>
      )}

      <KeyboardAwareScrollView style={styles.container}>
        <SafeAreaView>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="chevron-left"
                size={hp(35)}
                color={colors.textBlack}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>Airtime</Text>
            <Text>{'  '}</Text>
          </View>

          <View style={styles.headerUnderLine} />
        </SafeAreaView>

        {/* Body */}
        <View>
          <FlatList
            data={airtime.services}
            keyExtractor={item => item.id}
            horizontal={true}
            scrollEnabled={false}
            renderItem={({item}) => (
              <>
                {item.available && (
                  <View style={styles.serviceWrapper}>
                    <TouchableOpacity
                      style={styles.serviceLogo}
                      onPress={() => setSelectedService(item)}>
                      <Image
                        source={getServiceImage(item.service)}
                        style={styles.serviceImage}
                      />
                      {selectedService && (
                        <View
                          style={[
                            {
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'black',
                              opacity: 0.9,
                            },
                            selectedService.id === item.id && {opacity: 0.0},
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.serviceName}>{item.service}</Text>
                  </View>
                )}
              </>
            )}
          />
        </View>
        {!selectedService && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                marginTop: hp(80),
                fontFamily: 'Poppins-Medium',
                fontSize: hp(16),
                color: colors.secondary,
                textAlign: 'center',
                paddingHorizontal: hp(30),
              }}>
              Select a Service provider
            </Text>
          </View>
        )}
        {selectedService && (
          <>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Phone number to buy airtime to:</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  placeholder="Phone number"
                  style={styles.inputStyle}
                  keyboardType={'numeric'}
                  value={customer}
                  onChangeText={text => setCustomer(text)}
                  maxLength={11}
                />
              </View>
              {selectedService.service === 'MTN' && (
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() =>
                    setToggleRechargeTypeSelect(!toggleRechargeTypeSelect)
                  }>
                  <Text
                    style={[
                      styles.pickerItemTitle,
                      rechargeType && {color: colors.textBlack},
                    ]}>
                    {rechargeType ? rechargeType : 'Select Recharge Type...'}
                  </Text>
                  <Feather
                    name="chevron-down"
                    color={colors.textBlack}
                    size={20}
                  />
                </TouchableOpacity>
              )}
              <Text style={styles.label}>Amount you want to buy for:</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.nairaSign}>₦</Text>
                <TextInput
                  placeholder="Amount"
                  style={styles.inputStyle}
                  keyboardType={'numeric'}
                  value={amount}
                  onChangeText={text => setAmount(text)}
                />
              </View>
              {discount !== '' && (
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  You will pay ₦{discount}
                </Text>
              )}
              <Text
                style={[
                  styles.label,
                  {width: '100%', textAlign: 'center', color: colors.secondary},
                ]}>
                Note: ₦50 naira minimum
              </Text>
            </View>
            <TouchableOpacity
              style={styles.buttonBody}
              onPress={validateAndBuy}>
              <Text style={styles.buttonText}>Buy</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 25,
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    textAlign: 'center',
  },

  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
    width: wp(350),
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  serviceWrapper: {
    marginTop: 20,
    marginLeft: wp(10),
    alignItems: 'center',
  },
  serviceLogo: {
    width: wp(65),
    height: hp(65),
    backgroundColor: colors.secondary,
    borderRadius: 5,
    overflow: 'hidden',
  },
  serviceImage: {
    width: wp(65),
    height: hp(65),
  },
  serviceName: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(13),
    color: colors.textLight,
  },
  label: {
    marginTop: hp(20),
    fontFamily: 'Poppins-Medium',
    fontSize: hp(13),
    color: colors.textBlack,
  },
  inputStyle: {
    flex: 1,
    marginTop: hp(10),
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textBlack,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 30,
  },
  nairaSign: {
    position: 'absolute',
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    paddingTop: hp(7),
    paddingLeft: wp(10),
  },
  buttonBody: {
    marginTop: hp(140),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textWhite,
  },
  electProviderWrapper: {
    width: '100%',
    backgroundColor: 'white',
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // alignItems: 'center',
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: colors.textLight,
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Medium',
  },
  pickerButton: {
    marginTop: hp(20),
    backgroundColor: '#f4f4f4',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pickerItemTitle: {
    fontFamily: 'Poppins-Medium',
    color: colors.textLight,
  },
});
