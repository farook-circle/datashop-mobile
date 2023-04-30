import {api} from './config.api';

export const requestUserPasswordReset = async payload =>   api.post('/api/password-reset-request', payload);
export const confirmUserPasswordReset = async payload =>   api.post('/api/password-reset-confirm', payload);
export const completeUserPasswordReset = async payload =>   api.post('/api/password-reset-complete', payload);

