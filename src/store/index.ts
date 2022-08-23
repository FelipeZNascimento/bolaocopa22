import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from 'store/base/base';
import { userSlice } from 'store/user/reducer';
import { matchesSlice } from './match/reducer';
import { teamsSlice } from './team/reducer';

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userSlice.reducer,
    matches: matchesSlice.reducer,
    teams: teamsSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
