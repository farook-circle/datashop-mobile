import {GET_MESSAGES, GET_NOTIFICATION} from '../constants/messages';

const initialState = {
  messages: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case GET_NOTIFICATION:
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return state;
  }
}
