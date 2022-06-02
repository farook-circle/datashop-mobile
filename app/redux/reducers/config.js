import {GET_CONTACT_INFO} from '../constants/config';

const initialState = {
  contact_info: {
    message: 'hi',
    number: '090***',
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CONTACT_INFO:
      return {
        ...state,
        contact_info: action.payload,
      };

    default:
      return state;
  }
}
