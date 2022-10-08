import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';
import { TExtraBet } from 'store/bet/types';
import { ITeam } from 'store/team/types';
import { TUserRanking } from 'store/ranking/types';

export type TError = {
  code: string;
  message: string;
  showToast: boolean;
};

interface IResult {
  errors: TError[];
  extraBets: TExtraBet[];
  loggedUser: TUser[];
  loggedUserExtraBets: TExtraBet[];
  matches: TMatch[];
  seasonStart: number;
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
