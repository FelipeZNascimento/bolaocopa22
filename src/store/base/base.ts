import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TQuery } from './types';
import {
  apiBaseUrl,
  config as configEndpoint,
  listRanking as listRankingEndpoint
} from 'services/endpoints';

export const baseApi = createApi({
  reducerPath: 'bolaoApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    getConfig: builder.query<TQuery, void>({
      query: () => {
        return { url: configEndpoint(), credentials: 'include' };
      }
    }),
    updateConfig: builder.mutation<TQuery, void>({
      query: () => {
        return { url: configEndpoint(), credentials: 'include' };
      }
    }),
    getRanking: builder.query<TQuery, null>({
      query: () => {
        return { url: listRankingEndpoint(), credentials: 'include' };
      }
    })
  })
});

export const {
  useGetConfigQuery,
  useUpdateConfigMutation,
  useGetRankingQuery
} = baseApi;
