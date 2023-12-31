import {useCallback, useEffect, useState} from 'react';
import {api} from '../api';
import {CURRENT_API} from '../lib';

export const useServer = () => {
  const [serverRunning, setServerRunning] = useState(null);

  const pingApi = useCallback(() => {
    api.get(CURRENT_API + '/system/server-status').then(request => {
      if (request.ok) {
        setServerRunning(true);
      } else {
        setServerRunning(false);
      }
    });
  }, [setServerRunning]);

  useEffect(() => {
    pingApi();
  }, [pingApi]);

  return {serverRunning};
};
