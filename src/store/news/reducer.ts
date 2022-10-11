import { createSlice } from '@reduxjs/toolkit';
import { TNews } from './types';

const initialState = {
  isNewsLoading: false,
  news: [] as TNews[]
};

export const newsSlice = createSlice({
  name: 'news',
  initialState: initialState,
  reducers: {
    newsLoading: (state, action) => {
      state.isNewsLoading = action.payload;
    },
    setNews: (state, action) => {
      state.news = action.payload.news;
    }
  }
});

export const { newsLoading, setNews } = newsSlice.actions;
export default newsSlice.reducer;
