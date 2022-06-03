import EncryptedStorage from 'react-native-encrypted-storage';

import {
  DATA_BUNDLE_CHECKOUT_SUCCESS,
  DATA_BUNDLE_LOADED,
  SET_LOADING,
  DATA_PURCHASE_HISTORY,
  DATA_BUNDLE_CHECKOUT_FAILED,
  GET_DATA_CATEGORY,
} from '../constants/data_bundles';

const initialState = {
  data_bundle: [],
  data_category: [],
  data_purchase_history: [],
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case DATA_BUNDLE_LOADED:
      return {
        ...state,
        data_bundle: action.payload,
      };
    case GET_DATA_CATEGORY:
      return {
        ...state,
        data_category: action.payload,
      };
    case DATA_BUNDLE_CHECKOUT_SUCCESS:
    case DATA_BUNDLE_CHECKOUT_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case DATA_PURCHASE_HISTORY:
      return {
        ...state,
        data_purchase_history: action.payload,
      };
    default:
      return state;
  }
}
