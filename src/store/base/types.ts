import { TMatch } from 'store/matches/types';
import { TUser } from 'store/user/types';

interface IResult {
  loggedUser: TUser[];
  matches: TMatch[];
}

export type TQuery = {
  timestamp: string;
  result: IResult; // Could be matches, users
  isSuccess: boolean;
  code: number;
};
