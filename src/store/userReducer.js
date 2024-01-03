import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  posts: null,
};

export const userReducer = createSlice({
  name: "custom",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutAction: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    postsAction: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { loginAction, logoutAction, postsAction } = userReducer.actions;
export default userReducer.reducer;
