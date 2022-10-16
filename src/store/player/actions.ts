import { baseApi } from 'store/base/base';

import {
  listAllPlayers as listAllPlayersEndpoint
  // listTeamById as listTeamByIdEndpoint
} from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onListAllPlayers: builder.query<TQuery, void>({
      query: () => {
        return {
          url: listAllPlayersEndpoint(),
          method: 'get',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    })
    // onListById: builder.mutation<TQuery, { id: number }>({
    //   query: (arg) => {
    //     const { id } = arg;
    //     return {
    //       url: listTeamByIdEndpoint(id),
    //       method: 'get',
    //       headers: {
    //         'Content-type': 'application/json; charset=UTF-8'
    //       },
    //       credentials: 'include'
    //     };
    //   }
    // })
  })
});

export const { useOnListAllPlayersQuery } = extendedApi;
