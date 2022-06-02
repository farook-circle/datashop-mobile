import {combineReducers} from 'redux';
import auth from './auth';
import data_bundles from './data_bundles';
import wallet from './wallet';
import messages from './messages';
import config from './config';

export default combineReducers({
  auth,
  data_bundles,
  wallet,
  messages,
  config,
});
