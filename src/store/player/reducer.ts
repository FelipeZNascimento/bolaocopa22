import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  players: null,
  playersLoading: false
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: initialState,
  reducers: {
    playersLoading: (state, action) => {
      state.playersLoading = action.payload;
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    }
  }
});

export const { playersLoading, setPlayers } = playerSlice.actions;
export default playerSlice.reducer;
