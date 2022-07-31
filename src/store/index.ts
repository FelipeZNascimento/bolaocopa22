import { configureStore } from '@reduxjs/toolkit';
import { baseSplitApi } from 'store/base/baseSplit';
import { userSlice } from 'store/user/reducer';

// Reducers
// import betsReducer from './store/bets/reducer';
// import matchesReducer from './store/matches/reducer';
// import userReducer from './user/reducer';
// import recordsReducer from './store/records/reducer';

// const store = createStore(rootReducer, composedEnhancer);
const store = configureStore({
  reducer: {
    [baseSplitApi.reducerPath]: baseSplitApi.reducer,
    user: userSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseSplitApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
