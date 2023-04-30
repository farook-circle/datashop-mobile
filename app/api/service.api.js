import {api} from './config.api';


export const getServiceSuccessRate = () => api.get('/system/service-status');