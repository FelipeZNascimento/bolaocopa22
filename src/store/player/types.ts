import { ITeam } from 'store/team/types';

export interface IPosition {
  id: number;
  description: string;
  abbreviation: string;
}

export interface IPlayer {
  id: number;
  name: string;
  number: number;
  birth: string;
  height: number;
  weigth: number;
  position: IPosition;
  team: ITeam;
}
