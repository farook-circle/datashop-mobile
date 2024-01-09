import {api} from './config.api';
import {store} from '../redux/store';

export const requestForStatement = async payload => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/api/v1/account/statement', payload, config);
};

export const getUserActivity = payload => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  return api.get('/api/v1/account/activity', payload, config);
};

export const verifyUserBvn = async payload => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  return api.post('/api/v1/account/bvn-verification', payload, config);
};
