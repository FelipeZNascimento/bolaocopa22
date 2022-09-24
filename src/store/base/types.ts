import { TMatch } from 'store/match/types';
import { TUser, TUserRanking } from 'store/user/types';
import { TExtraBet } from 'store/bet/types';
import { ITeam } from 'store/team/types';

export type TError = {
  code: string;
  message: string;
};

interface IResult {
  errors: TError[];
  extraBets: TExtraBet[];
  loggedUser: TUser[];
  loggedUserExtraBets: TExtraBet[];
  matches: TMatch[];
  teams: ITeam[];
  round: number;
  users: TUserRanking[];
}

export type TQuery = {
  timestamp: string;
  result: IResult; // Could be matches, users, bets
  isSuccess: boolean;
  code: number;
};
