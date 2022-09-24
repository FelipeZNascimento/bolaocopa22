import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Store
import { useGetConfigQuery } from 'store/base/base';
import { userLoggedIn, userLoginLoading } from 'store/user/reducer';
import { IStartup } from './types';
import { QueryHandler } from 'services/queryHandler';
import { teamsSet } from 'store/team/reducer';

export const Startup = ({ children }: IStartup) => {
  const { data, error, isLoading } = useGetConfigQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userLoginLoading(isLoading));

    if (!error && !isLoading && data) {
      const result = QueryHandler(data);
      if (result) {
        dispatch(userLoggedIn(result.loggedUser));
        dispatch(teamsSet(result.teams));
      }
    }
  }, [data, isLoading]);

  return <>{children}</>;
};
