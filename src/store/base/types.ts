import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';
import { TExtraBet } from 'store/bet/types';
import { ITeam } from 'store/team/types';
import { TUserRanking } from 'store/ranking/types';
import { TNews } from 'store/news/types';
import { IPlayer } from 'store/player/types';

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
  players: IPlayer[];
  seasonStart: number;
  teams: ITeam[];
  round: number;
  users: TUserRanking[];
  news: TNews[];
}

export type TQuery = {
  timestamp: string;
  result: IResult; // Could be matches, users, bets
  isSuccess: boolean;
  code: number;
};
