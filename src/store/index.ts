import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from 'store/base/base';
import { betSlice } from './bet/reducer';
import { errorSlice } from './error/reducer';
import { matchSlice } from './match/reducer';
import { newsSlice } from './news/reducer';
import { rankingSlice } from './ranking/reducer';
import { teamSlice } from './team/reducer';
import { userSlice } from 'store/user/reducer';
import { rtkQueryErrorLogger } from 'services/ErrorHandlerMiddleware';

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    bet: betSlice.reducer,
    error: errorSlice.reducer,
    match: matchSlice.reducer,
    news: newsSlice.reducer,
    ranking: rankingSlice.reducer,
    team: teamSlice.reducer,
    user: userSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, rtkQueryErrorLogger)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
