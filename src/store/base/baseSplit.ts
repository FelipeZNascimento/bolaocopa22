import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TConfig } from './types';
import { apiBaseUrl, config as configEndpoint } from 'services/endpoints';

export const baseSplitApi = createApi({
  reducerPath: 'bolaoApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    getConfig: builder.query<TConfig, void>({
      query: () => {
        return { url: configEndpoint(), credentials: 'include' };
      }
    })
  })
});

export const { useGetConfigQuery } = baseSplitApi;
