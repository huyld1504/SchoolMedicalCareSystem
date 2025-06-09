import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,  reducers: {
    // Login actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = action.payload;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    
    // Register actions
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Refresh token actions
    refreshTokenStart: (state) => {
      state.loading = true;
    },    refreshTokenSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },    refreshTokenFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
      logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart,
  registerSuccess,
  registerFailure,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  logout, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;
