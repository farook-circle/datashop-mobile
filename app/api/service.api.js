import {api} from './config.api';
import {store} from '../redux/store';

export const getServiceSuccessRate = () => api.get('/system/service-status');
export const getHomepageGallery = () => api.get('/system/dashboard-gallery');

export const getAirtimeServices = async () => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get('/airtime/', {}, config);
};

export const buyAirtimeService = async payload => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/airtime/', payload, config);
};

export const validateMeterNumber = async payload => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/bill/validate/electricity', payload, config);
};

export const validateSmartCardNumber = async payload => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/bill/validate/cable', payload, config);
};

export const electricityBillPayment = async payload => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/bill/electricity', payload, config);
};
export const cableBillPayment = async payload => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/bill/cable', payload, config);
};

export const examBillPayment = async payload => {
  const {token} = store.getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/bill/exam', payload, config);
};
