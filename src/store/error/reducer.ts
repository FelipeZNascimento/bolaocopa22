import { createSlice } from '@reduxjs/toolkit';
import { TError } from 'store/base/types';

const initialState = {
  isError: false,
  errors: [] as TError[]
};

export const errorSlice = createSlice({
  name: 'error',
  initialState: initialState,
  reducers: {
    setError: (state, action) => {
      state.isError = true;
      state.errors.push({
        code: action.payload.code,
        message: action.payload.message,
        showToast: action.payload.showToast
      });
    },
    clearError: (state) => {
      state.isError = false;
      state.errors = [];
    }
  }
});

export const { clearError, setError } = errorSlice.actions;
export default errorSlice.reducer;
