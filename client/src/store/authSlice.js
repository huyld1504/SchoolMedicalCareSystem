import { createSlice } from '@reduxjs/toolkit';
import { clearTokens } from '../api/axiosClient';

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearTokens();
    }
  }
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;