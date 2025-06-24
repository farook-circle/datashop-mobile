import EncryptedStorage from 'react-native-encrypted-storage';

import {
  GET_BALANCE,
  REFRESH_DEPOSIT_OPTION_AND_WALLET_BALANCE,
  TOGGLE_LOADING,
  UPDATE_ACCOUNT_NUMBERS,
  UPDATE_USER_CART,
} from '../constants/wallet';

const initialState = {
  wallet_balance: '0.00',
  automated_deposit: {},
  manual_deposit: {},
  momo_agent_deposit: {},
  accounts: [],
  cart_items: [],
  standard_deposit: {},
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case REFRESH_DEPOSIT_OPTION_AND_WALLET_BALANCE:
      return {
        ...state,
        wallet_balance: action.payload.wallet_balance,
        automated_deposit: action.payload.automated_deposit,
        manual_deposit: action.payload.manual_deposit,
        momo_agent_deposit: action.payload.momo_agent_deposit,
        standard_deposit: action.payload.standard_deposit,
        accounts: action.payload.accounts,
        isLoading: false,
      };
    case GET_BALANCE:
      return {
        ...state,
        wallet_balance: action.payload.balance,
      };
    case UPDATE_USER_CART:
      return {
        ...state,
        cart_items: action.payload,
      };
    case UPDATE_ACCOUNT_NUMBERS:
      return {
        ...state,
        accounts: action.payload,
      };
    default:
      return state;
  }
}
