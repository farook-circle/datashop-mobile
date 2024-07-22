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

export const getPaymentOptionWalletBalance = async () => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get('/api/payment-option', {}, config);
};

export const generateMultiFactorConfigUrl = async () => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get('/system/generate-config-url/', {}, config);
};

export const verifyMultiFactorOtp = async (otp, liveToken) => {
  const token = liveToken || store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/system/verify-otp/', {token: otp}, config);
};

export const getOAuthData = async liveToken => {
  const token = liveToken || store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get('/system/manage-oauth/', {}, config);
};

export const removeOAuthData = async () => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.delete('/system/manage-oauth/', {}, config);
};
