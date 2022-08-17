import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';

export type TError = {
  code: string;
  message: string;
};

interface IResult {
  loggedUser: TUser[];
  matches: TMatch[];
  errors: TError[];
}

export type TQuery = {
  timestamp: string;
  result: IResult; // Could be matches, users, bets
  isSuccess: boolean;
  code: number;
};
