import { TQuery } from 'store/base/types';

export const QueryHandler = (query: TQuery) => {
  if (!query.isSuccess) {
    console.log(`Error on the query [${query.code}]`);
    return null;
    // dispatch action that triggers render of error
  }

  return query.result;
};
