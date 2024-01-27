import * as React from 'react';
import {Provider} from 'react-redux';
import {store} from './app/redux/store';
import {NativeBaseProvider} from 'native-base';
import {theme} from './app/lib';
import {useNetInfo} from '@react-native-community/netinfo';
import {Platform} from 'react-native';
import InAppUpdate from './app/utils/InAppUpdate';
import {AppNavigator} from './app/navigation';

const App = () => {
  const {isConnected} = useNetInfo();

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      InAppUpdate.checkUpdate();
    }
  }, [isConnected]);

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <AppNavigator isConnected={isConnected} isServerRunning={true} />
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
