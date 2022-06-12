import EncryptedStorage from 'react-native-encrypted-storage';

import {
  CREATE_VIRTUAL_ACCOUNT,
  GET_BALANCE,
  GET_VIRTUAL_ACCOUNT,
  DELETE_VIRTUAL_ACCOUNT,
  GET_MOMO_AGENT_NUMBER,
  GET_ACCOUNT_NUMBER,
  GET_PAYMENT_STATUS,
  GET_AIRTIME_FUNDING,
} from '../constants/wallet';

const initialState = {
  wallet_balance: '0.00',
  account: {},
  momo_agent_number: [],
  payment_method: [],
  payment_status: [],
  airtime_instruction: null,
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE:
      return {
        ...state,
        wallet_balance: action.payload.balance,
      };
    case GET_PAYMENT_STATUS:
      return {
        ...state,
        payment_status: action.payload,
      };
    case CREATE_VIRTUAL_ACCOUNT:
      return {
        ...state,
        account: action.payload,
      };
    case GET_AIRTIME_FUNDING:
      return {
        ...state,
        airtime_instruction: action.payload,
      };
    case GET_VIRTUAL_ACCOUNT:
      return {
        ...state,
        account: action.payload,
      };
    case GET_MOMO_AGENT_NUMBER:
      return {
        ...state,
        momo_agent_number: action.payload,
      };
    case GET_ACCOUNT_NUMBER:
      return {
        ...state,
        payment_method: action.payload,
      };
    case DELETE_VIRTUAL_ACCOUNT:
      return {
        ...state,
        account: {},
      };
    default:
      return state;
  }
}
