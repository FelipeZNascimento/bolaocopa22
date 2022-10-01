import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Toast } from '@omegafox/components';

import { RootState } from 'store';
import { clearError } from 'store/error/reducer';

export const ErrorToast = () => {
  const dispatch = useDispatch();

  const isError = useSelector(
    (state: RootState) => state.error.isError
  ) as unknown as boolean;

  const status = useSelector(
    (state: RootState) => state.error.status
  ) as unknown as boolean;

  const text = useSelector(
    (state: RootState) => state.error.text
  ) as unknown as string;

  if (!isError) {
    return null;
  }

  const onClose = () => {
    dispatch(clearError());
  };

  return (
    <Toast text={`${text} (${status})`} variant="error" onClose={onClose} />
  );
};
