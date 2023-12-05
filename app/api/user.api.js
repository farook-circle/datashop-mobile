import {api} from './config.api';
import {store} from '../redux/store';

export const getDataRecentContact = async () => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get('/contacts/recent-data/', {}, config);
};

export const getAirtimeRecentContact = async () => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get('/contacts/recent-airtime/', {}, config);
};
