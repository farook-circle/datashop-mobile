import {useDispatch} from 'react-redux';
import {getContactInfo} from '../redux/actions/config';
import {AppConstant, Storage} from '../lib';
import {RESTORE_TOKEN} from '../redux/constants/auth';
import {useCallback} from 'react';
import {restoreUser} from '../redux/actions/auth';

export const useSession = () => {
  const dispatch = useDispatch();

  const restoreSession = useCallback(async () => {
    dispatch(getContactInfo());

    const userSession = await Storage.get(
      AppConstant.STORAGE_KEYS.USER_SESSION,
    );

    let token = null;

    if (userSession) {
      const parsedData = JSON.parse(userSession);
      dispatch({type: RESTORE_TOKEN, payload: parsedData});
      token = parsedData.token;
    }

    dispatch(restoreUser(token));
  }, [dispatch]);

  return {restoreSession};
};
