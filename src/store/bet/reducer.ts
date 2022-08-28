import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  extraBets: null,
  loggedUserExtraBets: null,
  betsLoading: false
};

export const betSlice = createSlice({
  name: 'bet',
  initialState: initialState,
  reducers: {
    betsLoading: (state, action) => {
      state.betsLoading = action.payload;
    },
    betsSet: (state, action) => {
      state.extraBets = action.payload.extraBets;
      state.loggedUserExtraBets = action.payload.loggedUserExtraBets;
    },
    betsUpdated: (state, action) => {
      state.extraBets = action.payload.extraBets;
      state.loggedUserExtraBets = action.payload.loggedUserExtraBets;
    }
  }
});

export const { betsLoading, betsSet, betsUpdated } = betSlice.actions;
export default betSlice.reducer;
