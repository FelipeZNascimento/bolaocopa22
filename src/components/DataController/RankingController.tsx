import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

// Actions
import { useGetRankingQuery } from 'store/ranking/actions';

// Reducers
import { rankingSet } from 'store/ranking/reducer';

// Utilities
import { QueryHandler } from 'services/queryHandler';

// Constants
import ROUTES from 'constants/routes';

export const RankingController = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const skipRankingQuery =
    (isMobile && !pathname.includes(ROUTES.RANKING.url)) ||
    pathname.includes(ROUTES.EXTRAS.url) ||
    pathname.includes(ROUTES.RULES.url) ||
    pathname.includes(ROUTES.TEAMS.url);

  const { data, error, isLoading } = useGetRankingQuery(null, {
    pollingInterval: 10000,
    skip: skipRankingQuery
  });

  useEffect(() => {
    if (!isLoading && data && data.isSuccess) {
      const rankingResult = QueryHandler(data);
      dispatch(rankingSet(rankingResult));
    }
  }, [data, isLoading, error]);

  return null;
};
