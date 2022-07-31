import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Store
import { useGetConfigQuery } from 'store/base/baseSplit';
import { userLoggedIn, userLoginLoading } from 'store/user/reducer';
import { IStartup } from './types';

export const Startup = ({ children }: IStartup) => {
  const { data, error, isLoading } = useGetConfigQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userLoginLoading(isLoading));

    if (!error && !isLoading && data) {
      dispatch(userLoggedIn(data.loggedUser));
      console.log(data.loggedUser);
    }
  }, [data, isLoading]);

  return <>{children}</>;
};
