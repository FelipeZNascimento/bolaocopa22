import { baseApi } from 'store/base/base';
import sha256 from 'crypto-js/sha256';

import {
  login as loginEndpoint,
  logout as logoutEndpoint,
  register as registerEndpoint,
  updateInfo as updateInfoEndpoint,
  updatePass as updatePassEndpoint
} from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onLogin: builder.mutation<TQuery, { email: string; password: string }>({
      query: (arg) => {
        const { email, password } = arg;
        return {
          url: loginEndpoint(),
          method: 'post',
          body: { email, password: sha256(password).toString() },
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onRegister: builder.mutation<
      TQuery,
      { email: string; password: string; nickname: string }
    >({
      query: (arg) => {
        const { email, password, nickname } = arg;
        return {
          url: registerEndpoint(),
          method: 'post',
          body: { email, nickname, password: sha256(password).toString() },
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onLogout: builder.mutation<TQuery, void>({
      query: () => {
        return {
          url: logoutEndpoint(),
          method: 'get',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onUpdateInfo: builder.mutation<
      TQuery,
      { id: number; name: string; nickname: string }
    >({
      query: (arg) => {
        const { id, name, nickname } = arg;
        return {
          url: updateInfoEndpoint(),
          method: 'post',
          body: {
            id,
            name,
            nickname
          },
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onUpdatePass: builder.mutation<
      TQuery,
      { id: number; password: string; newPassword: string }
    >({
      query: (arg) => {
        const { id, password, newPassword } = arg;
        return {
          url: updatePassEndpoint(),
          method: 'post',
          body: {
            id,
            password: sha256(password).toString(),
            newPassword: sha256(newPassword).toString()
          },
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
  useOnLoginMutation,
  useOnLogoutMutation,
  useOnRegisterMutation,
  useOnUpdateInfoMutation,
  useOnUpdatePassMutation
} = extendedApi;
