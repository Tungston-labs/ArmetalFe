import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: null,
  accessToken: null,
  user: null, // include role if needed
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userName = action.payload.userName;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user; 
    },
    logout: (state) => {
      state.userName = null;
      state.accessToken = null;
      state.user = null;
    },
    setAccessToken: (state, action) => {
  state.accessToken = action.payload.accessToken; 
},

    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
});

export const { login, logout, setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer;
