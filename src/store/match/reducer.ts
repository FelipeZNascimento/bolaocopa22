import { createSlice } from '@reduxjs/toolkit';
import { TInitialState, TMatch } from 'store/match/types';

const initialState: TInitialState = {
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
    },
    matchesUserLoggedOut: (state) => {
      state.matches = state.matches
        ? (state.matches as TMatch[]).map((match) => {
            return { ...match, loggedUserBets: null };
          })
        : null;
    }
  }
});

export const {
  matchesLoading,
  matchesSet,
  matchesUpdated,
  matchesUserLoggedOut
} = matchSlice.actions;
export default matchSlice.reducer;
