import {useState, useEffect, useRef, useCallback} from 'react';
import {useIsFocused} from '@react-navigation/native';

export const usePolling = (pollingFunction, interval) => {
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);
  const isFocused = useIsFocused();

  const fetchData = useCallback(async () => {
    try {
      await pollingFunction();
    } catch (runError) {
      setError(runError);
    }
  }, [pollingFunction]);

  useEffect(() => {
    const startPolling = () => {
      fetchData();
      pollingRef.current = setInterval(fetchData, interval);
    };

    const stopPolling = () => {
      clearInterval(pollingRef.current);
    };

    if (isFocused) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [pollingFunction, interval, fetchData, isFocused]);

  return {error};
};
