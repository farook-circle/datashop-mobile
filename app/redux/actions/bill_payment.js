import axios from '../../axios';
import * as defaultAxios from 'axios';

import {GET_ELECTRIC_PROVIDERS} from '../constants/bill_payment';

export const getElectricProviders = () => (dispatch, getState) => {
  //Get Token from the state

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

  axios
    .get('/bill/electricity', config)
    .then(res => {
      dispatch({
        type: GET_ELECTRIC_PROVIDERS,
        payload: res.data,
      });
    })
    .catch(error => {
      if (error.response) {
        // do nothing
      } else {
        // do nothing
      }
    });
};

export const verifyMeter = (data, callBackFunc) => (dispatch, getState) => {
  //Get Token from the state

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


  
  axios.post('/bill/validate/electricity', data, config)
    .then(res => {
      callBackFunc(res.data, res.status);
    })
    .catch(error => {
      if (error.response) {
        callBackFunc(error.response.data, error.response.status);
        // do nothing
      } else {
        callBackFunc('', 1000);
        // do nothing
      }
    });
};

export const buyElectricity = (data, callBackFunc) => (dispatch, getState) => {
  //Get Token from the state

  const token = getState().auth.token;
  // Header
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //Check to see if there is an token and to header
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  const body = JSON.stringify(data);

  axios
    .post('/bill/electricity', body, config)
    .then(res => {
      callBackFunc(res.data, res.status);
    })
    .catch(error => {
      if (error.response) {
        callBackFunc(error.response.data, error.response.data);
        // do nothing
      } else {
        callBackFunc('error', 900);
        // do nothing
      }
    });
};

export const getMeterToken = (ref, callBackFunc) => (dispatch, getState) => {
  //Get Token from the state

  const token = getState().auth.token;
  // Header
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Check to see if there is an token and to header
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  // destruct data object

  axios
    .get(`/bill/electricity/${ref}`, config)
    .then(res => {
      callBackFunc(res.data, res.status);
    })
    .catch(error => {
      if (error.response) {
        callBackFunc(error.response.data, error.response.status);
        // do nothing
      } else {
        callBackFunc('', 1000);
        // do nothing
      }
    });
};
