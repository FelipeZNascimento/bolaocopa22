import { ITeam } from 'store/team/types';
import { TUser } from 'store/user/types';

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

interface IBet {
  id: number;
  idMatch: number;
  goalsHome: number;
  goalsAway: number;
  timestamp: number;
  user: TUser;
}

export type TMatch = {
  id: number;
  timestamp: number;
  round: number;
  status: number;
  bets: IBet[];
  loggedUserBets: IBet | null;
  homeTeam: ITeam;
  awayTeam: ITeam;
  stadium: IStadium;
  referee: IReferee;
};
