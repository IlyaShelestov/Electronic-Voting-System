import { RootState } from "../reduxStore";

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.user.isLoading;
export const selectAuthError = (state: RootState) => state.user.error;

export const selectUserRole = (state: RootState) => state.user.user?.role;
export const selectIsAdmin = (state: RootState) =>
  state.user.user?.role === "admin";
export const selectIsManager = (state: RootState) =>
  state.user.user?.role === "manager";
export const selectIsUser = (state: RootState) =>
  state.user.user?.role === "user";

export const selectUserEmail = (state: RootState) => state.user.user?.email;
export const selectUserFullName = (state: RootState) => {
  const user = state.user.user;
  if (!user) return null;
  return `${user.first_name} ${user.last_name}`;
};
export const selectUserId = (state: RootState) => state.user.user?.user_id;
