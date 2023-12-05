import {
  GET_DATA_RECENT_CONTACT,
  GET_AIRTIME_RECENT_CONTACT,
} from '../constants/user';

const initialState = {
  dataContact: [],
  airtimeContact: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DATA_RECENT_CONTACT:
      return {
        ...state,
        dataContact: action.payload,
      };
    case GET_AIRTIME_RECENT_CONTACT:
      return {
        ...state,
        airtimeContact: action.payload,
      };
    default:
      return state;
  }
}
