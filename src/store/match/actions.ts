import { baseApi } from 'store/base/base';
// import { TMatch } from './types';

import {
  updateBet as updateBetEndpoint,
  listAllMatchesWithUserBets as listAllMatchesWithUserBetsEndpoint
} from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onListAllMatchesWithUserBets: builder.mutation<TQuery, void>({
      query: () => {
        return {
          url: listAllMatchesWithUserBetsEndpoint(),
          method: 'get',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onUpdateBet: builder.mutation<
      TQuery,
      {
        betId: number | null;
        matchId: number;
        userId: number;
        goalsHome: number | null;
        goalsAway: number | null;
      }
    >({
      query: (arg) => {
        const { betId, matchId, userId, goalsHome, goalsAway } = arg;
        return {
          url: updateBetEndpoint(),
          method: 'post',
          body: {
            id: betId,
            idMatch: matchId,
            idUser: userId,
            goalsHome: goalsHome,
            goalsAway: goalsAway
          },
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    })
  })
});

export const {
  useOnUpdateBetMutation,
  useOnListAllMatchesWithUserBetsMutation
} = extendedApi;
