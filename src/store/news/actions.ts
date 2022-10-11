import { baseApi } from 'store/base/base';

import { news as newsEndpoint } from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<TQuery, void>({
      query: () => {
        return { url: newsEndpoint(), credentials: 'include' };
      }
    })
  })
});

export const { useGetNewsQuery } = extendedApi;
