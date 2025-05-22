import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import electionReducer from "./slices/electionSlice";
import voteReducer from "./slices/voteSlice";
import loadingReducer from './slices/loadingSlice';

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
