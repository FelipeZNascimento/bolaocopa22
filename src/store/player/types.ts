import { ITeam } from 'store/team/types';

export interface IPosition {
  id: number;
  description: string;
  abbreviation: string;
}

interface IClubCountry {
  id: number;
  abbreviation: string;
  abbreviationEn: string;
  isoCode: string;
  name: string;
  nameEn: string;
}

interface IPlayerClub {
  name: string;
  country: IClubCountry;
}

export interface IPlayer {
  id: number;
  idFifa: number;
  idFifaPicture: string;
  name: string;
  number: number;
  birth: string;
  height: number;
  weigth: number;
  position: IPosition;
  team: ITeam;
  club?: IPlayerClub;
}
