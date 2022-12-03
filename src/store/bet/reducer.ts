import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  extraBets: [],
  extraBetsResults: [],
  loggedUserExtraBets: [],
  extraBetsLoading: false
};

export const betSlice = createSlice({
  name: 'bet',
  initialState: initialState,
  reducers: {
    extraBetsLoading: (state, action) => {
      state.extraBetsLoading = action.payload;
    },
    extraBetsSet: (state, action) => {
      state.extraBets = action.payload.extraBets;
      state.extraBetsResults = action.payload.extraBetsResults;
      state.loggedUserExtraBets = action.payload.loggedUserExtraBets;
    },
    extraBetsUpdated: (state, action) => {
      state.loggedUserExtraBets = action.payload;
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
