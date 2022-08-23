import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teams: null,
  teamsLoading: false
};

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: initialState,
  reducers: {
    teamsLoading: (state, action) => {
      state.teamsLoading = action.payload;
    },
    teamsSet: (state, action) => {
      state.teams = action.payload;
    }
  }
});

export const { teamsLoading, teamsSet } = teamsSlice.actions;
export default teamsSlice.reducer;
