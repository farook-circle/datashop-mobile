import {api} from './config.api';

export const requestUserPasswordReset = async payload =>
  api.post('/api/password-reset-request', payload);
export const confirmUserPasswordReset = async payload =>
  api.post('/api/password-reset-confirm', payload);
export const completeUserPasswordReset = async payload =>
  api.post('/api/password-reset-complete', payload);

export const userVerificaiton = {
  requestCode: phone_number =>
    api.get('/api/v1/user-verification', {phone_number}),
  verifyCode: payload => api.post('/api/v1/user-verification', payload),
};

export const checkUserExist = async phone_number =>
  api.post('/api/v1/check-user', {phone_number});


export const registerUser = async payload => api.post('/api/v1/register', payload);