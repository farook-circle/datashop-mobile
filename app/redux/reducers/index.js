import {combineReducers} from 'redux';
import auth from './auth';
import data_bundles from './data_bundles';
import wallet from './wallet';
import messages from './messages';

export default combineReducers({
  auth,
  data_bundles,
  wallet,
  messages,
});
