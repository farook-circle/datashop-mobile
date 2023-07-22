import * as React from 'react';
import {Provider} from 'react-redux';
import {store} from './app/redux/store';
import RootNavigator from './app/navigation/stackNavigator';
import {extendTheme, NativeBaseProvider} from 'native-base';
import {themes} from './themes';

const theme = extendTheme(themes);

function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <RootNavigator />
      </NativeBaseProvider>
    </Provider>
  );
}

export default App;
