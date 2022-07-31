import { baseSplitApi } from 'store/base/baseSplit';
import { TUser } from './types';
import sha256 from 'crypto-js/sha256';

import {
  login as loginEndpoint,
  logout as logoutEndpoint,
  register as registerEndpoint
} from 'services/endpoints';

const extendedApi = baseSplitApi.injectEndpoints({
  endpoints: (builder) => ({
    onAutologin: builder.query<TUser, { email: string; password: string }>({
      query: (arg) => {
        const { email, password } = arg;
        return {
          url: loginEndpoint(),
          method: 'post',
          body: { email, password: sha256(password) },
          credentials: 'include'
        };
      }
    }),
    onLogin: builder.mutation<TUser, { email: string; password: string }>({
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
      TUser,
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
    onLogout: builder.mutation<boolean, void>({
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
    })
  })
});

export const {
  useOnAutologinQuery,
  useOnLoginMutation,
  useOnLogoutMutation,
  useOnRegisterMutation
} = extendedApi;
