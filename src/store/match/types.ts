import { ITeam } from 'store/team/types';
import { TBet } from 'store/bet/types';
import { IPlayer } from 'store/player/types';

export type TInitialState = {
  matches: null | TMatch[];
  matchesLoading: boolean;
  seasonStart: null | number;
};

interface IStadium {
  id: number;
  name: string;
  city: string;
  capacity: number;
  latitude: string;
  longitude: string;
}

interface ICountry {
  id: number;
  abbreviation: string;
  name: string;
  nameEn: string;
}

interface IReferee {
  id: number;
  name: string;
  birth: string;
  country: ICountry;
}

export interface IEvent {
  description: string;
  gametime: string;
  id: number;
  idMatch: number;
  idTeam: number;
  player: IPlayer;
  playerTwo: IPlayer | null;
  type: number;
}

export type TMatch = {
  awayTeam: ITeam;
  bets: TBet[];
  clock: string;
  events: IEvent[];
  homeTeam: ITeam;
  id: number;
  loggedUserBets: TBet | null;
  referee: IReferee;
  round: number;
  stadium: IStadium;
  status: number;
  timestamp: string;
};
