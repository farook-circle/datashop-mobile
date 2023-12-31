import EncryptedStorage from 'react-native-encrypted-storage';

import {REFRESH_DEPOSIT_OPTION_AND_WALLET_BALANCE} from '../constants/wallet';

const initialState = {
  wallet_balance: '0.00',
  automated_deposit: {},
  manual_deposit: {},
  momo_agent_deposit: {},
  standard_deposit: {},
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case REFRESH_DEPOSIT_OPTION_AND_WALLET_BALANCE:
      return {
        ...state,
        wallet_balance: action.payload.wallet_balance,
        automated_deposit: action.payload.automated_deposit,
        manual_deposit: action.payload.manual_deposit,
        momo_agent_deposit: action.payload.momo_agent_deposit,
        standard_deposit: action.payload.standard_deposit,
      };
    default:
      return state;
  }
}
