import {api} from './config.api';
import {store} from '../redux/store';

export const getMonnifyBankList = async () => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get('/api/bank-list', {}, config);
};

export const getTickets = async () => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get('/system/ticket', {}, config);
};

export const createTickets = async payload => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/system/ticket', payload, config);
};

export const closeTicket = async ticket_id => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.put('/system/ticket', {ticket_id}, config);
};

export const getTicketMessages = async ticket_id => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.get(`/system/ticket/${ticket_id}/messages`, {}, config);
};

export const createTicketMessages = async (ticket_id, payload) => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post(`/system/ticket/${ticket_id}/messages`, payload, config);
};

export const sendDeviceToken = async payload => {
  const token = store.getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return api.post('/system/devices', payload, config);
};
