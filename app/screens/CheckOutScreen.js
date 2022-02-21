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
} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../../assets/colors/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {buyDataBundle} from '../redux/actions/data_plans';

export default function CheckOut({route, navigation}) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.data_bundles.isLoading);
  const balance = useSelector(state => state.wallet.wallet_balance);
  const [onClickBuy, setClickBuy] = useState(false);
  const [customer, setCustomer] = useState('');
  const [pin, setPin] = useState('');

  const {id, price, quantity} = route.params;
  const data_bundle_id = id;
  const PIN = '1234';
  const remark = 'I love this Service';
  const payment_method = 'wallet';

  const phoneNumberCheckUp = () => {
    if (customer.length > 1 && customer.length < 11) {
      alert(
        `please input the right costumer phone number, the number that you put is ${customer.length} and phone number has to be 11`,
      );
      return false;
    }
    if (customer.length < 1) {
      alert('customer phone number should not be empty');
      return false;
    }

    if (customer.match(/0(9|8|7)(0|1)\d{8}/g) == null) {
      alert('phone number format is wrong check and try again');
      return false;
    }

    return true;
  };

  const handleCheckout = () => {
    if (!phoneNumberCheckUp()) {
      return;
    }
    if (Number(balance) < Number(price)) {
      alert('You do not have enough money on your wallet please deposit');
      return;
    }
    dispatch(
      buyDataBundle(
        {data_bundle_id, customer, payment_method, remark},
        handleCheckoutSuccess,
      ),
    );
  };

  const handleCheckoutSuccess = () => {
    alert(
      `you have successfully buy data for ${customer} thank you for using our services`,
    );
    navigation.navigate('Home');
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <SafeAreaView>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" size={35} color={colors.textBlack} />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>Check Out</Text>
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
            <Text style={styles.priceText}>{price}</Text>
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
            {/* <TextInput
              onChangeText={e => setPin(e)}
              value={pin}
              secureTextEntry={true}
              keyboardType="numeric"
              placeholder="PIN"
              style={styles.textInput}
            /> */}
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
          <Text style={styles.noteTextColor}>NOTE</Text>: Please make sure you
          put right number, because this is irreversible
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
    marginTop: 43,
    flexDirection: 'row',
    width: 370,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginLeft: 93,
  },
  headerUnderLine: {
    marginTop: 10,
    height: 2,
    width: 350,
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  bodyWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
  dataBundleCategoryWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    width: 370,

    alignSelf: 'center',
    alignItems: 'center',
  },
  dataBundleItemsWrapper: {
    width: 175,
    height: 159,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 20,
  },
  mtnLogoImage: {
    marginTop: 25,
    width: 66,
    height: 47,
  },
  quantityText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.secondary,
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textWhite,
  },
  balanceWrapper: {
    marginTop: 20,
    width: 245,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableBalanceText: {
    marginBottom: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: colors.textLight,
  },
  balanceText: {
    marginTop: 0,
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    color: colors.textWhite,
  },
  textInputWrapper: {
    marginTop: 20,
    width: 310,
    height: 150,
    // backgroundColor: 'red',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textInput: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    borderWidth: 2,
    width: 310,
    height: 60,
    borderRadius: 20,
    paddingHorizontal: 30,
  },
  buttonsWrapper: {
    width: 310,
    height: 101,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  buyText: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  buyButton: {
    width: 310,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 20,
  },
  noteText: {
    paddingHorizontal: 50,
    fontFamily: 'Poppins-Light',
    fontSize: 15,
  },
  noteTextColor: {
    color: colors.secondary,
  },
});
