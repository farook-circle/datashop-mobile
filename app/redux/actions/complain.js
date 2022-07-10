import axios from '../../axios';
import defaultAxios from 'axios';

export const getComplain = (ref, callBackFunc) => (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const url = `https://mysppp.herokuapp.com/complain/${ref}`;

  defaultAxios
    .get(url, config)
    .then(res => {
      callBackFunc(res.data, res.status);
    })
    .catch(error => {
      if (error.response) {
        callBackFunc(error.response.data, error.response.status);
      } else {
        callBackFunc('error', 900);
      }
    });
};

export const makeComplain = (data, callBackFunc) => (dispatch, getState) => {
  //

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const url = `https://mysppp.herokuapp.com/complain`;

  const body = JSON.stringify(data);

  defaultAxios
    .post(url, body, config)
    .then(res => {
      callBackFunc(res.data, res.status);
    })
    .catch(error => {
      if (error.response) {
        callBackFunc(error.response.data, error.response.status);
      } else {
        callBackFunc('error', 900);
      }
    });
};
