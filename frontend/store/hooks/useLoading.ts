import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearLoading, setLoading } from '@/store/slices/loadingSlice';

export const useLoading = () => {
  const dispatch = useAppDispatch();
  const loadingState = useAppSelector((state) => state.loading);

  const setLoadingState = useCallback(
    (key: string, value: boolean) => {
      dispatch(setLoading({ key, value }));
    },
    [dispatch]
  );

  const clearLoadingState = useCallback(
    (key: string) => {
      dispatch(clearLoading(key));
    },
    [dispatch]
  );

  const isLoading = useCallback(
    (key: string) => {
      return loadingState[key] || false;
    },
    [loadingState]
  );

  const withLoading = useCallback(
    async <T>(key: string, asyncFunction: () => Promise<T>): Promise<T> => {
      setLoadingState(key, true);
      try {
        const result = await asyncFunction();
        return result;
      } finally {
        setLoadingState(key, false);
      }
    },
    [setLoadingState]
  );

  return {
    setLoading: setLoadingState,
    clearLoading: clearLoadingState,
    isLoading,
    withLoading,
  };
};
