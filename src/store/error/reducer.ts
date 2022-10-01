import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isError: false,
  status: null,
  text: ''
};

export const errorSlice = createSlice({
  name: 'error',
  initialState: initialState,
  reducers: {
    setError: (state, action) => {
      state.isError = true;
      state.status = action.payload.status;
      state.text = action.payload.text;
    },
    clearError: (state) => {
      state.isError = false;
      state.status = null;
      state.text = '';
    }
  }
});

export const { clearError, setError } = errorSlice.actions;
export default errorSlice.reducer;
