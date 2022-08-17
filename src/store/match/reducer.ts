import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  matches: null,
  matchesLoading: false
};

export const matchesSlice = createSlice({
  name: 'matches',
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
  matchesSlice.actions;
export default matchesSlice.reducer;
