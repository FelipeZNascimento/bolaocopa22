import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Store
import { useGetConfigQuery } from 'store/base/base';
import { userLoggedIn, userLoginLoading } from 'store/user/reducer';
import { QueryHandler } from 'services/queryHandler';
import { teamsLoading, teamsSet } from 'store/team/reducer';
import { seasonStartSet } from 'store/match/reducer';

// Types
import { IStartup } from './types';

export const Startup = ({ children }: IStartup) => {
  const useGetConfigResult = useGetConfigQuery();
  const dispatch = useDispatch();

  // Default config
  useEffect(() => {
    dispatch(userLoginLoading(useGetConfigResult.isLoading));
    dispatch(teamsLoading(useGetConfigResult.isLoading));

    if (
      !useGetConfigResult.error &&
      !useGetConfigResult.isLoading &&
      useGetConfigResult.data
    ) {
      const result = QueryHandler(useGetConfigResult.data);
      if (result) {
        dispatch(userLoggedIn(result.loggedUser));
        dispatch(teamsSet(result.teams));
        dispatch(seasonStartSet(result.seasonStart));
      }
    }
  }, [useGetConfigResult.data, useGetConfigResult.isLoading]);

  return <>{children}</>;
};
