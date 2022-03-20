import EncryptedStorage from 'react-native-encrypted-storage';

import {
  CREATE_VIRTUAL_ACCOUNT,
  GET_BALANCE,
  GET_VIRTUAL_ACCOUNT,
  DELETE_VIRTUAL_ACCOUNT,
  GET_MOMO_AGENT_NUMBER,
  GET_ACCOUNT_NUMBER,
} from '../constants/wallet';

const initialState = {
  wallet_balance: '0.00',
  account: {},
  momo_agent_number: [],
  payment_method: [],
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE:
      return {
        ...state,
        wallet_balance: action.payload.balance,
      };
    case CREATE_VIRTUAL_ACCOUNT:
      return {
        ...state,
        account: action.payload,
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
