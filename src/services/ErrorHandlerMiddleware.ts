import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { clearError, setError } from 'store/error/reducer';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn('We got a rejected action!');
      console.log(action.payload);
      if (action.payload.data) {
        api.dispatch(
          setError({
            message: action.payload.data.result.errors[0].message,
            code: action.payload.data.result.errors[0].code,
            showToast: action.meta.arg.originalArgs.skipToast ? false : true
          })
        );

        setTimeout(function () {
          api.dispatch(clearError());
        }, 6000); // 6 * 1000 milsec
      } else {
        api.dispatch(
          setError({
            message: 'Erro inesperado. Reinicie a página.',
            code: action.payload.error,
            showToast: true
          })
        );

        setTimeout(function () {
          api.dispatch(clearError());
        }, 20000); // 20 * 1000 milsec
      }
    }

    return next(action);
  };
