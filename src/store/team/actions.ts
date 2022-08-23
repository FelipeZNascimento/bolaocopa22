import { baseApi } from 'store/base/base';

import {
  listAllTeams as listAllTeamsEndpoint,
  listTeamById as listTeamByIdEndpoint
} from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onListAll: builder.query<TQuery, void>({
      query: () => {
        return {
          url: listAllTeamsEndpoint(),
          method: 'get',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onListById: builder.mutation<TQuery, { id: number }>({
      query: (arg) => {
        const { id } = arg;
        return {
          url: listTeamByIdEndpoint(id),
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

export const { useOnListAllQuery, useOnListByIdMutation } = extendedApi;
