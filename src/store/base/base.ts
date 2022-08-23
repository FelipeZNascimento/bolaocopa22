import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TQuery } from './types';
import { apiBaseUrl, config as configEndpoint } from 'services/endpoints';

export const baseApi = createApi({
  reducerPath: 'bolaoApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    getConfig: builder.query<TQuery, void>({
      query: () => {
        return { url: configEndpoint(), credentials: 'include' };
      }
    })
  })
});

export const { useGetConfigQuery } = baseApi;
