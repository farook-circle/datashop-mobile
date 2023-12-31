import axios from '../../axios';
import {GET_AIRTIME_SERVICES} from '../constants/airtime';
import * as airtimeAPI from '../../api/service.api';

export const getAirtimeServices = () => (dispatch, getState) => {
  airtimeAPI.getAirtimeServices().then(response => {
    if (response.ok) {
      dispatch({
        type: GET_AIRTIME_SERVICES,
        payload: response.data,
      });
    } else {
    
    }
  });
};

export const buyAirtime = (data, callBackFunc) => (dispatch, getState) => {
  const token = getState().auth.token;
  // Header
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //Check to see if there is an token and to header
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  const body = JSON.stringify(data);

  axios
    .post('/airtime/buy', body, config)
    .then(res => {
      callBackFunc(res.data, res.status);
    })
    .catch(error => {
      if (error.response) {
        callBackFunc(error.response.data, error.response.status);
        // do nothing
      } else {
        // do nothing
        callBackFunc('error', 500);
      }
    });
};
