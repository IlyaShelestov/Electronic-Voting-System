import { configureStore } from '@reduxjs/toolkit';

import electionReducer from './slices/electionSlice';
import loadingReducer from './slices/loadingSlice';
import userReducer from './slices/userSlice';
import voteReducer from './slices/voteSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      election: electionReducer,
      vote: voteReducer,
      loading: loadingReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
