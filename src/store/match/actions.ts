import { baseApi } from 'store/base/base';
// import { TMatch } from './types';

import {
  listAllMatchesWithUserBets as listAllMatchesWithUserBetsEndpoint,
  listAllMatches as listAllMatchesEndpoint
} from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onListAllMatches: builder.query<TQuery, null>({
      query: () => {
        return { url: listAllMatchesEndpoint(), credentials: 'include' };
      }
    }),

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
    })
  })
});

export const {
  useOnListAllMatchesWithUserBetsMutation,
  useOnListAllMatchesQuery
} = extendedApi;
