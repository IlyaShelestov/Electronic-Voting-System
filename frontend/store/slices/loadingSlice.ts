import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  [key: string]: boolean;
}

const initialState: LoadingState = {};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state[action.payload.key] = action.payload.value;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer; 