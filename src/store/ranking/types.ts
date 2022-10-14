import { TUser } from 'store/user/types';

export type TUserRanking = TUser & {
  position: number;
  points: number;
  full: number;
  half: number;
  minimun: number;
  extras: number;
};

export type TRankingResult = {
  round: number;
  users: TUserRanking[];
};
export type TInitialState = {
  rankingLoading: boolean;
  rankingResult: TRankingResult | null;
};
