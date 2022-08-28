import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teams: null,
  teamsLoading: false
};

export const teamSlice = createSlice({
  name: 'team',
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

export const { teamsLoading, teamsSet } = teamSlice.actions;
export default teamSlice.reducer;
