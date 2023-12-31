import {useDispatch} from 'react-redux';
import {getContactInfo} from '../redux/actions/config';
import {AppConstant, Storage} from '../lib';
import {RESTORE_TOKEN} from '../redux/constants/auth';
import {restoreUser} from '../redux/actions/auth';
import {useCallback} from 'react';

export const useSession = () => {
  const dispatch = useDispatch();

  const restoreSession = useCallback(async () => {
    dispatch(getContactInfo());
    const userSession = await Storage.get(
      AppConstant.STORAGE_KEYS.USER_SESSION,
    );

    if (userSession) {
      dispatch({type: RESTORE_TOKEN, payload: JSON.parse(userSession)});
    }
    dispatch(restoreUser());
  }, [dispatch]);

  return {restoreSession};
};
