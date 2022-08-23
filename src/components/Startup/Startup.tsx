import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Store
import { useGetConfigQuery } from 'store/base/base';
import { userLoggedIn, userLoginLoading } from 'store/user/reducer';
import { matchesLoading, matchesSet } from 'store/match/reducer';
import { IStartup } from './types';
import { QueryHandler } from 'services/queryHandler';

export const Startup = ({ children }: IStartup) => {
  const { data, error, isLoading } = useGetConfigQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userLoginLoading(isLoading));
    dispatch(matchesLoading(isLoading));

    if (!error && !isLoading && data) {
      const result = QueryHandler(data);
      if (result) {
        dispatch(userLoggedIn(result.loggedUser));
        dispatch(matchesSet(result.matches));
      }
    }
  }, [data, isLoading]);

  return <>{children}</>;
};
