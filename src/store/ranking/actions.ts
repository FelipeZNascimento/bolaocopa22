import { baseApi } from 'store/base/base';

import { listRanking as listRankingEndpoint } from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRanking: builder.query<TQuery, null>({
      query: () => {
        return { url: listRankingEndpoint(), credentials: 'include' };
      }
    })
  })
});

export const { useGetRankingQuery } = extendedApi;
