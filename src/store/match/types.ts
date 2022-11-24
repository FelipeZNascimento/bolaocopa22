import { ITeam } from 'store/team/types';
import { TBet } from 'store/bet/types';

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

export type TMatch = {
  id: number;
  timestamp: string;
  round: number;
  status: number;
  clock: string;
  bets: TBet[];
  loggedUserBets: TBet | null;
  homeTeam: ITeam;
  awayTeam: ITeam;
  stadium: IStadium;
  referee: IReferee;
};
