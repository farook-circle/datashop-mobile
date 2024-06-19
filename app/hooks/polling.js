import {useState, useEffect, useRef, useCallback} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

export const usePolling = (pollingFunction, interval) => {
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);
  const isFocused = useIsFocused();

  const fetchData = useCallback(() => {
    try {
      pollingFunction();
    } catch (runError) {
      setError(runError);
    }
  }, [pollingFunction]);

  const startPolling = useCallback(() => {
    fetchData();
    pollingRef.current = setInterval(fetchData, interval);
  }, [fetchData, interval]);

  const stopPolling = () => {
    clearInterval(pollingRef.current);
  };

  useEffect(() => {
    if (isFocused) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [interval, isFocused, startPolling]);

  return {error};
};
