import EncryptedStorage from 'react-native-encrypted-storage';
import {
  GET_ELECTRIC_PROVIDERS,
  GET_CABLE_PROVIDERS,
  GET_EXAM_PROVIDERS,
} from '../constants/bill_payment';

const initialState = {
  electricity: {},
  cable: {},
  exam: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ELECTRIC_PROVIDERS:
      return {
        ...state,
        electricity: action.payload,
      };
    case GET_CABLE_PROVIDERS:
      return {
        ...state,
        cable: action.payload,
      };
    case GET_EXAM_PROVIDERS:
      return {
        ...state,
        exam: action.payload,
      };
    default:
      return state;
  }
}
