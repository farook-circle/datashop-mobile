import {create} from 'apisauce';
import {AppConstant} from '../lib';

// for development server

// for production server
export const api = create({
  baseURL: AppConstant.Config.BASE_API_URL,
  headers: {
    'X-Platform': 'android',
    'X-App-Build-Number': '1.2.0',
    'X-Col-Build_Number': '0000000000',
  },
});
