import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import WebView from 'react-native-webview';
import HeaderBackButton from '../../components/HeaderBackButton';
import {Button, HStack} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';

export const LiveChatScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [slowNetwork, setSlowNetwork] = useState(false);

  useEffect(() => {
    // Set timeout to display a slow network message if taking too long
    const timer = setTimeout(() => {
      if (loading) {
        setSlowNetwork(true);
      }
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timeout
  }, [loading]);

  const handleMessage = event => {
    if (event.nativeEvent.data === 'chatLoaded') {
      setLoading(false);
    }
    if (event.nativeEvent.data === 'minimized') {
      navigation.goBack();
    }
  };

  const handleNavigationChange = event => {
    if (
      event &&
      event?.url !==
        'https://admin.farookcircle.com/vrcxbbjbfsfeaqpsrkjpuuwtzqdxac'
    ) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HStack>
        <Button
          onPress={() => navigation.goBack()}
          variant={'ghost'}
          startIcon={<Feather name={'x'} size={20} />}>
          Close
        </Button>
      </HStack>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          {slowNetwork && (
            <Text style={styles.slowNetworkText}>
              Network seems slow, please wait...
            </Text>
          )}
        </View>
      )}
      <WebView
        style={styles.webview}
        source={{
          uri: 'https://admin.farookcircle.com/vrcxbbjbfsfeaqpsrkjpuuwtzqdxac',
        }}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 100,
  },
  slowNetworkText: {
    marginTop: 10,
    color: 'red',
    fontSize: 16,
  },
});
