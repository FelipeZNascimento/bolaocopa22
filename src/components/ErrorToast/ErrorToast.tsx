import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Toast } from '@omegafox/components';

import { RootState } from 'store';
import { clearError } from 'store/error/reducer';
import { TError } from 'store/base/types';

export const ErrorToast = () => {
  const dispatch = useDispatch();

  const isError = useSelector(
    (state: RootState) => state.error.isError
  ) as unknown as boolean;

  const errors: TError[] = useSelector(
    (state: RootState) => state.error.errors
  ) as unknown as TError[];

  if (!isError) {
    return null;
  }

  const onClose = () => {
    dispatch(clearError());
  };

  const showError = errors.find((error) => error.showToast);
  if (showError) {
    <Toast
      text={`${showError.message} (${showError.code})`}
      variant="error"
      onClose={onClose}
    />;
  }

  return null;
};
