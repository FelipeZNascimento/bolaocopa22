import { ITeam } from 'store/team/types';
import { TUser } from 'store/user/types';

export type TBet = {
  id: number;
  idMatch: number;
  goalsHome: number;
  goalsAway: number;
  timestamp: number;
  user: TUser;
};

export type TExtraBet = {
  id: number;
  idExtraType: number;
  idTeam?: number | null;
  idPlayer?: number | null;
  user: TUser;
  team: ITeam | null;
  timestamp: string;
};
