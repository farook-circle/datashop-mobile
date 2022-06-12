import EncryptedStorage from 'react-native-encrypted-storage';
import {GET_ELECTRIC_PROVIDERS} from '../constants/bill_payment';

const initialState = {
  electric_providers: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ELECTRIC_PROVIDERS:
      return {
        ...state,
        electric_providers: action.payload,
      };
    default:
      return state;
  }
}
