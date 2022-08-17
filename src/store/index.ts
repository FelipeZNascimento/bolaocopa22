import { configureStore } from '@reduxjs/toolkit';
import { baseSplitApi } from 'store/base/baseSplit';
import { userSlice } from 'store/user/reducer';
import { matchesSlice } from './match/reducer';

const store = configureStore({
  reducer: {
    [baseSplitApi.reducerPath]: baseSplitApi.reducer,
    user: userSlice.reducer,
    matches: matchesSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseSplitApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
