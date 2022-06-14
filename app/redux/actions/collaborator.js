/* eslint-disable no-alert */
import axios from '../../axios';
import {GET_AGENTS} from '../constants/collaborator';

export const getCollaboratorAgent = callBackFunc => (dispatch, getState) => {
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

  axios
    .get('/collaborators', config)
    .then(res => {
      callBackFunc(res.data, res.status);
    })
    .catch(error => {
      if (error.response) {
        callBackFunc(error.response.data, error.response.status);
      } else {
        callBackFunc('error', 400);
        alert('Network error please check your internet connection');
      }
    });
};

export const fundCollaboratorAgent =
  (data, callBackFunc) => (dispatch, getState) => {
    //Get Token from the state

    const token = getState().auth.token;
    // Header
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(data);

    //Check to see if there is an token and to header
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    axios
      .post('/collaborators/fund-agent', body, config)
      .then(res => {
        callBackFunc(res.data, res.status);
      })
      .catch(error => {
        if (error.response) {
          callBackFunc(error.response.data, error.response.status);
        } else {
          callBackFunc('error', 400);
          alert('Network error please check your internet connection');
        }
      });
  };
