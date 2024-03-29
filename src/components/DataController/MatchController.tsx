import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// Store
import { RootState } from 'store';

// Actions
import {
  useOnListAllMatchesQuery,
  useOnFetchAllMatchesMutation
} from 'store/match/actions';

// Reducers
import { matchesLoading, matchesSet } from 'store/match/reducer';

// Utilities
import { usePrevious } from 'services/hooks';
import { QueryHandler } from 'services/queryHandler';

// Types
import { TUser } from 'store/user/types';
import ROUTES from 'constants/routes';

export const MatchController = () => {
  const { pathname } = useLocation();
  const skipAllMatchesQuery =
    pathname.includes(ROUTES.BETS.url) ||
    pathname.includes(ROUTES.EXTRAS.url) ||
    pathname.includes(ROUTES.RULES.url) ||
    pathname.includes(ROUTES.TEAMS.url);

  const [listAllMatchesTrigger, listAllMatchesResult] =
    useOnFetchAllMatchesMutation();
  const dispatch = useDispatch();

  const allMatchesQueryResult = useOnListAllMatchesQuery(null, {
    pollingInterval: 10000,
    skip: skipAllMatchesQuery
  });

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const prevLoggedUser = usePrevious(loggedUser);

  // Trigger matches mutation if user just logged in
  useEffect(() => {
    if (loggedUser !== prevLoggedUser && loggedUser) {
      listAllMatchesTrigger();
    }
  }, [loggedUser]);

  // On match mutation result
  useEffect(() => {
    if (!listAllMatchesResult.isLoading && listAllMatchesResult.data) {
      const result = QueryHandler(listAllMatchesResult.data);
      dispatch(matchesSet(result));
    }
  }, [listAllMatchesResult.isLoading]);

  // On match query result
  useEffect(() => {
    dispatch(matchesLoading(allMatchesQueryResult.isLoading));

    if (!allMatchesQueryResult.isFetching && allMatchesQueryResult.data) {
      const result = QueryHandler(allMatchesQueryResult.data);
      dispatch(matchesSet(result));
    }
  }, [allMatchesQueryResult.isFetching, allMatchesQueryResult.isLoading]);

  return null;
};
