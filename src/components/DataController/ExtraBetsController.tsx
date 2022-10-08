import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import { useOnListAllExtrasMutation as listAllBetsMutation } from 'store/bet/actions';

// Reducers
import { extraBetsLoading, extraBetsSet } from 'store/bet/reducer';

// Utilities
import { QueryHandler } from 'services/queryHandler';
import { usePrevious } from 'services/hooks';
import { RootState } from 'store';

// Types
import { TUser } from 'store/user/types';

export const ExtraBetsController = () => {
  const [listAllBetsTrigger, listAllBetsResult] = listAllBetsMutation();

  const dispatch = useDispatch();
  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;
  const prevLoggedUser = usePrevious(loggedUser);

  useEffect(() => {
    listAllBetsTrigger();
  }, []);

  useEffect(() => {
    if (loggedUser && loggedUser !== prevLoggedUser) {
      listAllBetsTrigger();
    }
  }, [loggedUser]);

  useEffect(() => {
    dispatch(extraBetsLoading(listAllBetsResult.isLoading));

    if (!listAllBetsResult.isLoading && listAllBetsResult.data) {
      const result = QueryHandler(listAllBetsResult.data);
      dispatch(extraBetsSet(result));
    }
  }, [listAllBetsResult.isLoading]);

  return null;
};
