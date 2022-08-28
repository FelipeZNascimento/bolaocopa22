import { baseApi } from 'store/base/base';

import {
  listAllExtraBets as listAllExtraBetsEndpoint,
  updateExtraBet as updateExtraBetEndpoint
} from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
    onListAllExtras: builder.query<TQuery, void>({
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

export const { useOnUpdateExtraBetMutation, useOnListAllExtrasQuery } = extendedApi;
