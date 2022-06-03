import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../../assets/colors/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {buyDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';

export default function CheckOut({route, navigation}) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.data_bundles.isLoading);
  const balance = useSelector(state => state.wallet.wallet_balance);
  const [onClickBuy, setClickBuy] = useState(false);
  const [customer, setCustomer] = useState('');
  const [check_mtn_number, setCheckMtnNumber] = useState(true);

  const {id, price, quantity} = route.params;
  const data_bundle_id = id;
  const remark = 'I love this Service';
  const payment_method = 'wallet';

  const phoneNumberCheckUp = () => {
    if (customer.length > 1 && customer.length < 11) {
      alert(
        'Invalid number! Please type out 11-digit phone number and avoid spaces between digits',
      );
      return false;
    }
    if (customer.length < 1) {
      alert('customer phone number should not be empty');
      return false;
    }

    if (customer.match(/0(9|8|7)(0|1)\d{8}/g) == null) {
      alert(
        'Invalid number! Please type out 11-digit phone number and avoid spaces between digits',
      );
      return false;
    }

    return true;
  };

  const handleCheckout = () => {
    if (!phoneNumberCheckUp()) {
      return;
    }
    if (Number(balance) < Number(price)) {
      alert('You do not have sufficient balance. Please fund your wallet');
      return;
    }
    completeCheckOut();
  };

  const handleCheckoutSuccess = () => {
    alert(
      'Your order has been successfully submitted✔️. Thank you for choosing DataShop',
    );
    navigation.navigate('Home');
  };

  const completeCheckOut = () => {
    Alert.alert(
      'Buy Data',
      `Please confirm that you want to order for ${customer}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'default',
          onPress: () =>
            dispatch(
              buyDataBundle(
                {
                  check_mtn_number,
                  data_bundle_id,
                  customer,
                  payment_method,
                  remark,
                },
                handleCheckoutSuccess,
              ),
            ),
        },
      ],
    );
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <SafeAreaView>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" size={hp(30)} color={colors.textBlack} />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>Check Out</Text>
            <Text>{'   '}</Text>
          </View>
          <View style={styles.headerUnderLine} />
        </SafeAreaView>

        {/* Data to Buy */}
        <View style={styles.bodyWrapper}>
          <View style={styles.dataBundleItemsWrapper}>
            <Image
              source={require('../../assets/images/mtn_logo.png')}
              style={styles.mtnLogoImage}
            />
            <Text style={styles.quantityText}>{quantity}</Text>
            {/* <Text style={styles.priceText}>{price}</Text> */}
          </View>
          <View style={styles.balanceWrapper}>
            <Text style={styles.availableBalanceText}>Avail Balance: </Text>
            <Text style={styles.balanceText}>
              {'\u20A6'} {balance}
            </Text>
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              onChangeText={e => setCustomer(e)}
              value={customer}
              placeholder="PHONE"
              keyboardType="numeric"
              style={styles.textInput}
              maxLength={11}
            />
            <View style={styles.toggleWrapper}>
              {check_mtn_number ? (
                <TouchableOpacity
                  onPress={() => setCheckMtnNumber(!check_mtn_number)}>
                  <Feather
                    name="toggle-right"
                    color={colors.primary}
                    size={hp(40)}
                    style={{marginRight: hp(10)}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setCheckMtnNumber(!check_mtn_number)}>
                  <Feather
                    name="toggle-left"
                    color={colors.textBlack}
                    size={hp(40)}
                    style={{marginRight: hp(10)}}
                  />
                </TouchableOpacity>
              )}
              <Text style={{fontSize: 16, fontFamily: 'Poppins-Bold'}}>
                Turn off number validation
              </Text>
            </View>
          </View>

          <View style={styles.buttonsWrapper}>
            <TouchableOpacity
              style={[
                styles.buyButton,
                isLoading
                  ? {borderColor: colors.textLight}
                  : {borderColor: 'black'},
              ]}
              onPress={handleCheckout}
              disabled={isLoading ? true : false}>
              {isLoading ? (
                <ActivityIndicator size={'large'} color={colors.primary} />
              ) : (
                <Text style={styles.buyText}>Buy Data</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.noteText}>
          <Text style={styles.noteTextColor}>NOTE</Text>: Please confirm the
          number before proceeding because this action is irreversible
        </Text>
      </KeyboardAwareScrollView>
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
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
    width: wp(350),
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  bodyWrapper: {
    marginTop: hp(30),
    alignItems: 'center',
  },
  dataBundleCategoryWrapper: {
    marginTop: hp(10),
    flexDirection: 'row',
    width: wp(370),

    alignSelf: 'center',
    alignItems: 'center',
  },
  dataBundleItemsWrapper: {
    width: wp(175),
    height: hp(159),
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: wp(15),
    marginBottom: hp(20),
    justifyContent: 'center',
  },
  mtnLogoImage: {
    marginTop: hp(25),
    width: wp(66),
    height: hp(47),
  },
  quantityText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.secondary,
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(20),
    color: colors.textWhite,
  },
  balanceWrapper: {
    marginTop: hp(20),
    width: wp(245),
    height: hp(80),
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableBalanceText: {
    marginBottom: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(18),
    color: colors.textLight,
  },
  balanceText: {
    marginTop: 0,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(25),
    color: colors.textWhite,
  },
  textInputWrapper: {
    marginTop: hp(20),
    width: wp(310),
    height: hp(150),
    // backgroundColor: 'red',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
  toggleWrapper: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    borderWidth: 2,
    width: wp(310),
    height: hp(60),
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  buttonsWrapper: {
    width: wp(310),

    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  buyText: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(20),
  },
  buyButton: {
    width: wp(310),
    height: hp(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
  },
  noteText: {
    paddingHorizontal: 25,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(15),
  },
  noteTextColor: {
    color: colors.secondary,
  },
});
