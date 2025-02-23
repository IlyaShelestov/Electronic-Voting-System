import { IUser } from "@/models/IUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  user: null | IUser;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<IUser>) {
      console.log("User logged in:", action.payload);
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      console.log("User logged out");
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
