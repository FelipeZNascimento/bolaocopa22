import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedUser: null,
  loginLoading: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    config: (state, action) => {
      state.loggedUser = action.payload;
    },
    userLoginLoading: (state, action) => {
      state.loginLoading = action.payload;
    },
    userLoggedIn: (state, action) => {
      state.loggedUser = action.payload;
    },
    userLoggedOut: (state) => {
      state.loggedUser = null;
    }
  }
});

export const { userLoggedIn, userLoggedOut, userLoginLoading } =
  userSlice.actions;
export default userSlice.reducer;
