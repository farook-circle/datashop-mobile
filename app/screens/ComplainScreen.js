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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataPurchaseHistory} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import {getComplain, makeComplain} from '../redux/actions/complain';

export default function ComplainScreen({route, navigation}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [extraDetail, setExtraDetail] = useState('');
  const [complainResponse, setComplainResponse] = useState(null);
  const user = useSelector(state => state.auth.user);

  // data from route
  const {
    amount,
    type,
    quantity,
    price,
    customer,
    date,
    time,
    transaction_ref,
    payment_method,
    remark,
    status,
  } = route.params;

  useEffect(() => {
    fetchComplainItem();
  }, []);

  const fetchComplainItem = () => {
    setIsLoading(true);
    dispatch(getComplain(transaction_ref, handleGetResponse));
  };

  const handleGetResponse = (res_data, res_status) => {
    if (res_status === 200) {
      if (res_data.complainResponse) {
        setComplainResponse(res_data);
      }
      setIsLoading(false);

      return;
    }

    if (res_status === 900) {
      alert('alert network error');
      setIsLoading(false);
      navigation.goBack();
      return;
    }

    setIsLoading(false);
  };

  const sendComplain = () => {
    setIsLoading(true);
    const data = {
      agent_id: user.id,
      type: type,
      amount: amount,
      quantity: quantity,
      customer: quantity,
      date: date,
      time: time,
      transaction_ref: transaction_ref,
      payment_method: payment_method,
      status: status,
      dispute_message: extraDetail,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    dispatch(makeComplain(data, handleMakeComplainResponse));
  };

  const handleMakeComplainResponse = (res_data, res_status) => {
    if (res_status === 201) {
      // eslint-disable-next-line no-alert
      alert(res_data.message_response);

      setIsLoading(false);
      navigation.goBack();
      return;
    }

    if (res_status === 900) {
      alert('Network error please try again');
      setIsLoading(false);

      return;
    }

    alert(res_data.error_message);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={hp(30)} color={colors.primary} />
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: hp(16),
            color: colors.primary,
          }}>
          Loading please wait...
        </Text>
      </View>
    );
  }

  return (
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
          <Text style={styles.headerTitleText}>Complain</Text>
          <Text>{'  '}</Text>
        </View>

        <View style={styles.headerUnderLine} />
      </SafeAreaView>

      {/* Body */}
      <KeyboardAwareScrollView style={styles.bodyWrapper}>
        <Text />
        <Text style={styles.infoLabel}>Agent Number</Text>
        <Text style={styles.infoContent}>{user.username}</Text>

        <Text style={styles.infoLabel}>Date of transaction</Text>
        <Text style={styles.infoContent}>{`${date} ${time.slice(0, 5)}`}</Text>

        <Text style={styles.infoLabel}>Transaction Refrence</Text>
        <Text style={styles.infoContent}>{transaction_ref}</Text>

        <Text style={styles.infoLabel}>Customer </Text>
        <Text style={styles.infoContent}>{customer}</Text>

        <Text style={styles.infoLable}>
          {quantity === 'None' ? 'Amount' : 'Data Plan'}
        </Text>
        <Text style={styles.infoContent}>
          {quantity === 'None' ? amount : quantity}
        </Text>

        <Text style={styles.infoLabel}>Payment Method</Text>
        <Text style={styles.infoContent}>{payment_method}</Text>

        <Text style={styles.label}>Extra Details</Text>
        {!complainResponse ? (
          <>
            <TextInput
              placeholder="other information"
              multiline={true}
              numberOfLines={6}
              textAlignVertical={'top'}
              style={styles.extraDetailInput}
              value={extraDetail}
              onChangeText={text => setExtraDetail(text)}
            />
            <TouchableOpacity
              style={styles.sendButton}
              activeOpacity={0.7}
              onPress={sendComplain}>
              <Text style={styles.sendText}>Send Complaint</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.infoContent}>
              {complainResponse && complainResponse.dispute_message}
            </Text>
            <Text />
            <Text style={styles.infoLabel}>Complain Response</Text>

            <Text style={[styles.infoContent, {color: 'green'}]}>
              {complainResponse && complainResponse.response_message}
            </Text>
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
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

  bodyWrapper: {
    flex: 1,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    color: colors.textBlack,
  },
  extraDetailInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    padding: hp(15),
  },

  infoLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(12),
    color: colors.textBlack,
  },
  infoContent: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.primary,
  },

  sendButton: {
    width: '100%',
    // position: 'absolute',
    bottom: hp(10),
    marginTop: hp(90),
    paddingVertical: hp(7),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
    color: colors.textWhite,
  },
});
