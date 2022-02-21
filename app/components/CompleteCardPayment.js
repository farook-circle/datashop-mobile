import {View, Text} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';

export default function CompleteCardPayment({link}) {
  return <WebView source={{uri: link}} />;
}
