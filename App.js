// In App.js in a new project

import * as React from 'react';
import {Provider} from 'react-redux';

import {store} from './app/redux/store';
import RootNavigator from './app/routing/route';

function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

export default App;
