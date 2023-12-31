import {AppState, AppStateStatus, PanResponder} from 'react-native';
import {useRef, useEffect, useState} from 'react';

export const useAuthNavigation = () => {
  const appState = useRef(AppState.currentState);
  const [currentAppState, setCurrentAppState] = useState(appState.current);
  const [previousAppState, setPreviousAppState] = useState();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        // resetTimer();
        return true;
      },
      onMoveShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => {
        // resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    }),
  ).current;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // authStore.logout();
      }
      setPreviousAppState(appState.current);
      appState.current = nextAppState;
      setCurrentAppState(appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (currentAppState === 'active' && previousAppState === 'background') {
      // TODO: Show user reason for being logged out
      // HINT: use a seperate Modal
    }
  }, [currentAppState, previousAppState]);
  return {panResponder};
};
