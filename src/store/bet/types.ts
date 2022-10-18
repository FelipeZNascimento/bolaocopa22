import { EXTRA_TYPES } from 'constants/extraTypes';
import { IPlayer } from 'store/player/types';
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
  id: number | null;
  idExtraType: EXTRA_TYPES;
  idTeam?: number | null;
  idPlayer?: number | null;
  user: TUser;
  team: ITeam | null;
  player: IPlayer | null;
  timestamp: string | null;
};
