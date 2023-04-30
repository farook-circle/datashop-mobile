import {api} from './config.api';
import {store} from '../redux/store';

export const validateAccountId = async payload => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return api.get('/wallet/validate', payload, config);
};

export const transferWalletFund = async (payload) => {
    const token = store.getState().auth.token;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
  
    return api.post('/wallet/transfer', payload, config);
};
