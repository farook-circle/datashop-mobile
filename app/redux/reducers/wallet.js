import EncryptedStorage from 'react-native-encrypted-storage';

import {
  CREATE_VIRTUAL_ACCOUNT,
  GET_BALANCE,
  GET_VIRTUAL_ACCOUNT,
  DELETE_VIRTUAL_ACCOUNT,
} from '../constants/wallet';

const initialState = {
  wallet_balance: '0.00',
  account: {},
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
    case DELETE_VIRTUAL_ACCOUNT:
      return {
        ...state,
        account: {},
      };
    default:
      return state;
  }
}
