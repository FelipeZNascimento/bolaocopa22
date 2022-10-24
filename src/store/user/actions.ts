import { baseApi } from 'store/base/base';
import sha256 from 'crypto-js/sha256';

import {
  getAll as getAllEndpoint,
  login as loginEndpoint,
  logout as logoutEndpoint,
  register as registerEndpoint,
  updateInfo as updateInfoEndpoint,
  updatePass as updatePassEndpoint,
  forgotPassword as forgotPasswordEndpoint,
  recoverPassword as recoverPasswordEndpoint,
  updateIsActive as updateIsActiveEndpoint
} from 'services/endpoints';
import { TQuery } from 'store/base/types';

const extendedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onLogin: builder.mutation<
      TQuery,
      { email: string; password: string; skipToast: boolean }
    >({
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
      { email: string; password: string; nickname: string; skipToast: boolean }
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
      { id: number; name: string; nickname: string; skipToast: boolean }
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
    }),
    onForgotPassword: builder.mutation<
      TQuery,
      { email: string; skipToast: boolean }
    >({
      query: (arg) => {
        const { email } = arg;
        return {
          url: forgotPasswordEndpoint(email),
          method: 'get',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onUpdatePassToken: builder.mutation<
      TQuery,
      { email: string; token: string; newPassword: string; skipToast: boolean }
    >({
      query: (arg) => {
        const { email, token, newPassword } = arg;
        return {
          url: recoverPasswordEndpoint(),
          method: 'post',
          body: {
            email,
            token,
            newPassword: sha256(newPassword).toString()
          },
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onGetAll: builder.mutation<TQuery, void>({
      query: () => {
        return {
          url: getAllEndpoint(),
          method: 'get',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          credentials: 'include'
        };
      }
    }),
    onUpdateIsActive: builder.mutation<
      TQuery,
      { id: number; isActive: boolean }
    >({
      query: (arg) => {
        const { id, isActive } = arg;

        return {
          url: updateIsActiveEndpoint(),
          method: 'post',
          body: { id, isActive },
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
  useOnForgotPasswordMutation,
  useOnLoginMutation,
  useOnLogoutMutation,
  useOnRegisterMutation,
  useOnUpdateInfoMutation,
  useOnUpdatePassMutation,
  useOnUpdatePassTokenMutation,
  useOnGetAllMutation,
  useOnUpdateIsActiveMutation
} = extendedApi;
