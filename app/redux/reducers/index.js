import {combineReducers} from 'redux';
import auth from './auth';
import data_bundles from './data_bundles';
import wallet from './wallet';
import messages from './messages';
import bill_payment from './bill_payment';
import config from './config';
import airtime from './airtime';
import collaborator from './collaborator';
import service from './service';

export default combineReducers({
  auth,
  data_bundles,
  wallet,
  messages,
  config,
  bill_payment,
  airtime,
  collaborator,
  service
});
