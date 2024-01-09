/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import {View, StyleSheet} from 'react-native';
import {CURRENT_API} from '../../lib';
import {MainLayout} from '../../components';
import {Spinner, Text} from 'native-base';

export const ApiDocScreen = () => {
  const [loading, setLoading] = useState(true);

  return (
    <MainLayout showHeader={true} headerTitle={'API Documentation'}>
      <View style={{flex: 1}}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Spinner />
            <Text mt={'4'}>Loading please wait...</Text>
          </View>
        )}

        <WebView
          source={{uri: `${CURRENT_API}/integrations/mobile-documentation/`}}
          onLoad={() => setLoading(false)}
        />
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
