import { TDropdownItem } from '@omegafox/components';
import { IPlayer } from 'store/player/types';
import { ITeam } from 'store/team/types';

export type TExtraBets = {
  champion: ITeam | null;
  offense: ITeam | null;
  defense: ITeam | null;
  striker: IPlayer | null;
};

export interface IExtrasClosed {
  selectedExtra: number | null;
}

export interface IExtrasOpen {
  champion: ITeam | null;
  defense: ITeam | null;
  offense: ITeam | null;
  selectedExtra: number | null;
  teamsLoading: boolean;
  teams: ITeam[];
  onStrikerSelect: (item: TDropdownItem) => void;
  onTeamClick: (team: ITeam) => void;
}
