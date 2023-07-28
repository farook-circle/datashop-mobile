import {api} from './config.api';

export const getServiceSuccessRate = () => api.get('/system/service-status');
export const getHomepageGallery = () => api.get('/system/dashboard-gallery');
