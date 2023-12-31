import EncryptedStorage from 'react-native-encrypted-storage';
import {GET_AIRTIME_SERVICES} from '../constants/airtime';

const initialState = {
  available: true,
  services: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_AIRTIME_SERVICES:
     
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
