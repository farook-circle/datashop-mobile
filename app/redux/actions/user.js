import {
  GET_DATA_RECENT_CONTACT,
  GET_AIRTIME_RECENT_CONTACT,
} from '../constants/user';
import * as userApi from '../../api/user.api';

export const getDataRecentContacts = () => async (dispatch, getState) => {
  const request = await userApi.getDataRecentContact();

  if (request.ok) {
    dispatch({type: GET_DATA_RECENT_CONTACT, payload: request.data});
  }
};

export const getAirtimeRecentContacts = () => async (dispatch, getState) => {
  const request = await userApi.getAirtimeRecentContact();

  if (request.ok) {
    dispatch({type: GET_AIRTIME_RECENT_CONTACT, payload: request.data});
  }
};
