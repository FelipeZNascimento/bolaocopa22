import { baseSplitApi } from 'store/base/baseSplit';
// import { TMatch } from './types';

// import { login as loginEndpoint } from 'services/endpoints';

const extendedApi = baseSplitApi.injectEndpoints({
  endpoints: (builder) => ({})
});

// export const { useOnLoginMutation } = extendedApi;
