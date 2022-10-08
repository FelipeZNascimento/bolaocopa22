import { createSlice } from '@reduxjs/toolkit';
import { TInitialState } from 'store/ranking/types';

const initialState: TInitialState = {
  rankingLoading: false,
  rankingResult: null
};

export const rankingSlice = createSlice({
  name: 'match',
  initialState: initialState,
  reducers: {
    rankingLoading: (state, action) => {
      state.rankingLoading = action.payload;
    },
    rankingSet: (state, action) => {
      state.rankingResult = action.payload;
    }
  }
});

export const { rankingLoading, rankingSet } = rankingSlice.actions;
export default rankingSlice.reducer;
