import { baseApi } from 'store/base/base';

import {
  listAllExtraBets as listAllExtraBetsEndpoint,
  updateExtraBet as updateExtraBetEndpoint,
  updateBet as updateBetEndpoint
} from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
    }),
    onUpdateExtraBet: builder.mutation<
      TQuery,
      {
        betId: number | null;
        extraType: number;
        userId: number;
        teamId: number | null;
        playerId: number | null;
      }
    >({
      query: (arg) => {
        const { betId, extraType, userId, teamId, playerId } = arg;
        return {
          url: updateExtraBetEndpoint(),
          method: 'post',
          body: {
            id: betId,
            idExtraType: extraType,
            idUser: userId,
            idTeam: teamId,
            idPlayer: playerId
          },
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onListAllExtras: builder.mutation<TQuery, void>({
      query: () => {
        return {
          url: listAllExtraBetsEndpoint(),
          method: 'get',
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
  useOnUpdateExtraBetMutation,
  useOnListAllExtrasMutation
} = extendedApi;
