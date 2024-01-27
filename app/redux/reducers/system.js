import {
  GET_DASHBOARD_WALLPAPER,
  GET_SUCCESS_RATE,
  GET_USER_TICKETS,
} from '../constants/system';

const initialState = {
  dashboard_wallpaper: [],
  success_rate: null,
  tickets: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_TICKETS:
      return {
        ...state,
        tickets: action.payload,
      };
    case GET_SUCCESS_RATE:
      return {
        ...state,
        success_rate: action.payload,
      };

    case GET_DASHBOARD_WALLPAPER:
      return {
        ...state,
        dashboard_wallpaper: action.payload,
      };
    default:
      return state;
  }
}
