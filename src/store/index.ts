import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from 'store/base/base';
import { betSlice } from './bet/reducer';
import { matchSlice } from './match/reducer';
import { teamSlice } from './team/reducer';
import { userSlice } from 'store/user/reducer';

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    bet: betSlice.reducer,
    match: matchSlice.reducer,
    team: teamSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
