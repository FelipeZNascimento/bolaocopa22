import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  matches: null,
  matchesLoading: false
};

export const matchSlice = createSlice({
  name: 'match',
  initialState: initialState,
  reducers: {
    matchesLoading: (state, action) => {
      state.matchesLoading = action.payload;
    },
    matchesSet: (state, action) => {
      state.matches = action.payload;
    },
    matchesUpdated: (state, action) => {
      state.matches = action.payload;
    }
  }
});

export const { matchesLoading, matchesSet, matchesUpdated } =
matchSlice.actions;
export default matchSlice.reducer;
