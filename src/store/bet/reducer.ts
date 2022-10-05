import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  extraBets: [],
  loggedUserExtraBets: [],
  betsLoading: false
};

export const betSlice = createSlice({
  name: 'bet',
  initialState: initialState,
  reducers: {
    extraBetsLoading: (state, action) => {
      state.betsLoading = action.payload;
    },
    extraBetsSet: (state, action) => {
      state.extraBets = action.payload.extraBets;
      state.loggedUserExtraBets = action.payload.loggedUserExtraBets;
    },
    extraBetsUpdated: (state, action) => {
      state.extraBets = action.payload.extraBets;
      state.loggedUserExtraBets = action.payload.loggedUserExtraBets;
    },
    extraBetsUserLoggedOut: (state) => {
      state.loggedUserExtraBets = [];
    }
  }
});

export const {
  extraBetsLoading,
  extraBetsSet,
  extraBetsUpdated,
  extraBetsUserLoggedOut
} = betSlice.actions;
export default betSlice.reducer;
