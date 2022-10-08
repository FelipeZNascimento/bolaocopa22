import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Actions
import { useGetRankingQuery } from 'store/ranking/actions';

// Reducers
import { rankingSet } from 'store/ranking/reducer';

// Utilities
import { QueryHandler } from 'services/queryHandler';

export const RankingController = () => {
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetRankingQuery(null, {
    pollingInterval: 10000
  });

  useEffect(() => {
    if (!isLoading && data && data.isSuccess) {
      const rankingResult = QueryHandler(data);
      dispatch(rankingSet(rankingResult));
    }
  }, [data, isLoading, error]);

  return null;
};
