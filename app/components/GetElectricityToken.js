/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import {useEffect, useState} from 'react';
import {getMeterToken} from '../redux/actions/bill_payment';
import {useDispatch} from 'react-redux';
import {hp} from '../config/dpTopx';
import Clipboard from '@react-native-clipboard/clipboard';

const RETRY_LIMIT = 5;

export default function GetElectricityToken({data}) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    fetchToken();
  }, [retry]);

  const fetchToken = () => {
    setErrorMessage(null);
    dispatch(getMeterToken(data.transaction_ref, handleFetchTokenResponse));
  };
  const handleFetchTokenResponse = (res_data, res_status) => {
    if (res_status === 200) {
      setToken(res_data.token);
      setIsLoading(false);
      return;
    }

    if (res_status === 204) {
      // first check if we  hit replay limit
      if (retry >= RETRY_LIMIT) {
        setErrorMessage(
          'Something went wrong please check back later or contact us',
        );
        setIsLoading(false);
        return;
      }
      // mean it did not arrive yet so retry after 5 seconds
      setTimeout(() => {
        setRetry(retry + 1);
      }, 5000);
      return;
    }

    if (res_status === 404) {
      setErrorMessage(
        'It seem like your order have been failed or Something went wrong please if you think there a problem retry or contact us',
      );
      setIsLoading(false);
      return;
    }

    setErrorMessage('error has occur please try again');
    setIsLoading(false);
  };

  const handleCopyToClipBoard = () => {
    Clipboard.setString(token);
    alert('Copied');
  };

  const handleRetry = () => {
    setRetry(0);
  };

  const handleContactUs = () => {
    console.log('contact us');
  };
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View>
          <ActivityIndicator />
          <Text>checking your token please wait...</Text>
        </View>
      ) : (
        <>
          {errorMessage ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}>
              <Text style={[styles.textHeader, {textAlign: 'center'}]}>
                {errorMessage}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={handleRetry}
                  style={[
                    styles.buttonStyle,

                    {
                      paddingHorizontal: 20,
                      marginRight: 10,
                      backgroundColor: colors.secondary,
                    },
                  ]}>
                  <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleContactUs}
                  style={[styles.buttonStyle, {paddingHorizontal: 20}]}>
                  <Text style={styles.buttonText}>Contact us</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                backgroundColor: colors.textWhite,
                paddingVertical: 50,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 5,
              }}>
              <Text style={styles.textHeader}>Meter token</Text>
              <Text style={styles.tokenText}>{token}</Text>
              <TouchableOpacity
                onPress={handleCopyToClipBoard}
                style={styles.buttonStyle}>
                <Text style={styles.buttonText}>Copy token</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: colors.background,
    zIndex: 10000,
  },
  textHeader: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(14),
  },
  tokenText: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp(20),
  },
  buttonStyle: {
    padding: 5,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(10),
    color: colors.textWhite,
  },
});
