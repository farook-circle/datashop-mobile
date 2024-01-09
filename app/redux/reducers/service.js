import * as serviceType from '../constants/service';

const inititialState = {
  success_rate: null,
  isLoading: false,
};

export default function (state = inititialState, action) {
  switch (action.type) {
    case serviceType.GET_SUCCESS_RATE:
      return {
        ...state,
        isLoading: false,
        success_rate: action.payload,
      };
    default: {
      return state;
    }
  }
}
