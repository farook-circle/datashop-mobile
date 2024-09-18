import {
  getHomepageGallery,
  getMonnifyBankList,
  getServiceSuccessRate,
  getTickets,
} from '../../api';
import {
  GET_DASHBOARD_WALLPAPER,
  GET_MONNIFY_ACCOUNT_LIST,
  GET_SUCCESS_RATE,
  GET_USER_TICKETS,
} from '../constants/system';

export const getAppDashboardWallpaper = () => dispatch => {
  getHomepageGallery().then(res => {
    if (res.ok) {
      dispatch({
        type: GET_DASHBOARD_WALLPAPER,
        payload: res.data,
      });
    }
  });
};

export const getSuccessRate = () => dispatch => {
  getServiceSuccessRate().then(res => {
    if (res.ok) {
      dispatch({
        type: GET_SUCCESS_RATE,
        payload: res.data,
      });
    }
  });
};

export const getUserTickets = () => dispatch => {
  getTickets().then(res => {
    if (res.ok) {
      dispatch({
        type: GET_USER_TICKETS,
        payload: res.data,
      });
    }
  });
};

export const getBankList = () => dispatch => {
  getMonnifyBankList().then(res => {
    if (res.ok) {
      dispatch({type: GET_MONNIFY_ACCOUNT_LIST, payload: res.data});
    }
  });
};
