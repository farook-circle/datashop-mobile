import axios from '../../axios';
import {GET_MESSAGES, GET_NOTIFICATION} from '../constants/messages';

export const getMessages = () => (dispatch, getState) => {
  const token = getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  axios
    .get('/api/messages', config)
    .then(res => {
      dispatch({type: GET_MESSAGES, payload: res.data});
    })
    .catch(error => {
      if (error.response) {
        //handle error
      } else {
        // handle network error
      }
    });
};

export const getNotifications = () => (dispatch, getState) => {
  const token = getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  axios
    .get('/api/notifications', config)

    .then(res => {
      dispatch({type: GET_NOTIFICATION, payload: res.data});
    })
    .catch(error => {
      if (error.response) {
        //handle error
      } else {
        // handle network error
      }
    });
};
