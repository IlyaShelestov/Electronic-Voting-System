import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";

import {
  selectIsAuthenticated,
  selectUserEmail,
} from "@/store/selectors/authSelectors";

import type { AppDispatch, AppStore, RootState } from "./reduxStore";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

export const useIsAuthenticated = () => {
  return useAppSelector(selectIsAuthenticated);
};
export const useElections = () =>
  useAppSelector((state) => state.election.elections);
export const usePageLoading = () =>
  useAppSelector((state) => state.loading["page"]);
export const useEmail = () => {
  return useAppSelector(selectUserEmail) || "";
};
