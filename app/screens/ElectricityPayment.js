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
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataPurchaseHistory} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import BottomModel from '../components/BottomModel';
import {buyElectricity, verifyMeter} from '../redux/actions/bill_payment';
import KeyboardAvoidingView from 'react-native-keyboard-aware-scroll-view';

const meterTypeData = [
  {id: 1, code: '01', title: 'Prepaid'},
  {id: 2, code: '02', title: 'Postpaid'},
];
export default function ElectricityPayment({navigation}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [electricityCompany, setElectricityCompany] = useState(null);
  const [meterType, setMeterType] = useState(null);
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [meterName, setMeterName] = useState('');
  const [error, setError] = useState(false);
  const [disableContinue, setDisableContinue] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buyingElectricityOnprogress, setBuyingElectricityOnprogress] =
    useState(false);
  const [toggleElectricityProviderSelect, setToggleElectricityProviderSelect] =
    useState(false);

  const [toggleMeterTypeSelect, setToggleMeterTypeSelect] = useState(false);

  const electric_providers = useSelector(
    state => state.bill_payment.electric_providers,
  );

  useEffect(() => {}, []);

  useEffect(() => {
    if (
      meterType &&
      electricityCompany &&
      meterNumber.length > 4 &&
      amount !== ''
    ) {
      setDisableContinue(false);
    } else {
      setDisableContinue(true);
    }
  }, [meterType, meterNumber, electricityCompany, amount]);

  const handleSetElectricityCompany = item => {
    setElectricityCompany(item);
    setToggleElectricityProviderSelect(!toggleElectricityProviderSelect);
  };

  const handleSetMeterType = item => {
    setMeterType(item);
    setToggleMeterTypeSelect(!toggleMeterTypeSelect);
  };

  const handleVerifyMeterDetails = () => {
    // verify meter number
    if (meterType && electricityCompany && meterNumber !== '') {
      dispatch(
        verifyMeter(
          {
            electricityCompany: electricityCompany.code,
            meterType: meterType.code,
            meterNumber: meterNumber,
          },
          handleVerifyMeterDetailsResponse,
        ),
      );
    }
  };

  const handleVerifyMeterDetailsResponse = (res_data, res_status) => {
    // assume success if status code is less than 300
    if (res_status < 300) {
      setMeterName(res_data.meter_name);
      setError(false);
      return;
    }

    setMeterName('wrong meter details');
    setError(true);
  };

  const handleContinueBuying = () => {
    // buy if meter is verified
    setButtonLoading(true);
    setDisableContinue(true);
    dispatch(
      verifyMeter(
        {
          electricityCompany: electricityCompany.code,
          meterType: meterType.code,
          meterNumber: meterNumber,
        },
        handleVerifyAndBuy,
      ),
    );
  };

  const handleVerifyAndBuy = (res_data, res_status) => {
    setButtonLoading(false);
    setDisableContinue(false);
    if (res_status > 300) {
      setMeterName('wrong meter details');
      setError(true);
      return;
    }

    Alert.alert(
      'Information',
      `You are about to buy meter token worth of ₦${amount} to ${res_data.meter_name}`,
      [
        {text: 'CANCEL', onPress: () => console.log('CANCEL')},
        {text: 'OK', onPress: () => finishBuyNow()},
      ],
    );
  };

  const finishBuyNow = () => {
    setBuyingElectricityOnprogress(true);

    // dispatch(
    //   buyElectricity(
    //     {
    //       electricityCompany: electricityCompany.code,
    //       meterType: meterType.code,
    //       meterNo: meterNumber,
    //       amount: amount,
    //     },
    //     handleBuyResponse,
    //   ),
    // );
  };

  const handleBuyResponse = (res_data, res_status) => {};

  return (
    <>
      {buyingElectricityOnprogress && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 100,
            backgroundColor: 'white',
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={hp(30)} color={colors.primary} />
            <Text style={{fontFamily: 'Poppins-Regular', fontSize: hp(16)}}>
              Please Wait...
            </Text>
          </View>
        </View>
      )}

      <View style={styles.container}>
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
            <Text style={styles.headerTitleText}>Electricity Payment</Text>
            <Text>{'  '}</Text>
          </View>

          <View style={styles.headerUnderLine} />
        </SafeAreaView>

        {/* Body */}
        <ScrollView style={styles.bodyWrapper}>
          {/* electricityCompany */}
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() =>
              setToggleElectricityProviderSelect(
                !toggleElectricityProviderSelect,
              )
            }>
            <Text
              style={[
                styles.pickerItemTitle,
                electricityCompany && {color: colors.textBlack},
              ]}>
              {electricityCompany
                ? electricityCompany.title
                : 'Select Electricity Company...'}
            </Text>
            <Feather name="chevron-down" color={colors.textBlack} size={20} />
          </TouchableOpacity>

          {/* meterType */}
          {electricityCompany && (
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setToggleMeterTypeSelect(!toggleMeterTypeSelect)}>
              <Text
                style={[
                  styles.pickerItemTitle,
                  meterType && {color: colors.textBlack},
                ]}>
                {meterType ? meterType.title : 'Select Meter Type...'}
              </Text>
              <Feather name="chevron-down" color={colors.textBlack} size={20} />
            </TouchableOpacity>
          )}
          {/* meterType end */}

          <Text style={styles.inputLabel}>Meter Number:</Text>
          <TextInput
            placeholder="Meter Number"
            style={styles.input}
            keyboardType={'numeric'}
            value={meterNumber}
            onBlur={() => handleVerifyMeterDetails()}
            onChangeText={text => setMeterNumber(text)}
          />
          {meterName !== '' && (
            <Text style={[styles.meterNameText, error && {color: 'red'}]}>
              {meterName}
            </Text>
          )}
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            placeholder="Amount"
            style={styles.input}
            keyboardType={'numeric'}
            value={amount}
            onChangeText={text => setAmount(text)}
          />
        </ScrollView>
        <TouchableOpacity
          disabled={disableContinue}
          style={[
            styles.buttonContinue,
            disableContinue && {backgroundColor: colors.textLight},
          ]}
          onPress={handleContinueBuying}>
          {buttonLoading ? (
            <ActivityIndicator color={colors.primary} size={hp(25)} />
          ) : (
            <Text
              style={[
                styles.buttonTitle,
                disableContinue && {color: colors.textWhite},
              ]}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* meterType selector */}

      {toggleMeterTypeSelect && (
        <BottomModel
          onBlankPress={() => setToggleMeterTypeSelect(!toggleMeterTypeSelect)}>
          <View style={styles.electProviderWrapper}>
            <TouchableOpacity
              onPress={() => setToggleMeterTypeSelect(!toggleMeterTypeSelect)}>
              <Feather name="x" color={colors.textBlack} size={30} />
            </TouchableOpacity>
            <FlatList
              data={meterTypeData}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                // items
                <TouchableOpacity
                  style={styles.itemWrapper}
                  onPress={() => handleSetMeterType(item)}>
                  <FontAwesome
                    name="lightbulb"
                    color={colors.primary}
                    size={20}
                  />
                  <Text style={styles.itemTitle}>{item.title}</Text>
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

      {toggleElectricityProviderSelect && (
        <BottomModel
          onBlankPress={() =>
            setToggleElectricityProviderSelect(!toggleElectricityProviderSelect)
          }>
          <View style={styles.electProviderWrapper}>
            <TouchableOpacity
              onPress={() =>
                setToggleElectricityProviderSelect(
                  !toggleElectricityProviderSelect,
                )
              }>
              <Feather name="x" color={colors.textBlack} size={30} />
            </TouchableOpacity>
            <FlatList
              data={electric_providers}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                // items
                <TouchableOpacity
                  style={styles.itemWrapper}
                  onPress={() => handleSetElectricityCompany(item)}>
                  <FontAwesome
                    name="lightbulb"
                    color={colors.primary}
                    size={20}
                  />
                  <Text style={styles.itemTitle}>{item.title}</Text>
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
  searchBox: {
    flex: 1,
    marginHorizontal: wp(20),
    // backgroundColor: 'red',
    fontFamily: 'Poppins-Medium',
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
    width: wp(350),
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  bodyWrapper: {
    flex: 1,
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
  meterNameText: {
    fontFamily: 'Poppins',
    fontSize: hp(16),
    color: colors.primary,
    width: '100%',
    textAlign: 'right',
  },
  inputLabel: {
    marginTop: hp(10),
    fontFamily: 'Poppins-Medium',
    color: colors.textLight,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Medium',
    color: colors.textBlack,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonContinue: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins-Medium',
    color: colors.textBlack,
    backgroundColor: colors.primary,
    marginBottom: hp(20),
  },
  buttonTitle: {
    fontFamily: 'Poppins-Medium',
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
});
