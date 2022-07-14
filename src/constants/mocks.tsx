import { IMatchProps, TTeam } from '@omegafox/components';

export const teamLeft: TTeam = {
  id: 0,
  align: 'left',
  colors: ['#FFDC02', '#193375'],
  logo: 'https://teamcolorcodes.com/wp-content/uploads/2021/12/Brazil-National-Football-Team-Logo-211x300.png',
  name: 'Brasil',
  nameShort: 'BRA',
  score: 4
};

export const teamRight: TTeam = {
  id: 1,
  align: 'right',
  colors: ['#FFFFFF', '#43A1D5'],
  logo: 'https://teamcolorcodes.com/wp-content/uploads/2021/12/Argentina-National-Football-Team-Logo-192x300.png',
  name: 'Argentina',
  nameShort: 'ARG',
  score: 0
};

export const matchInfo: IMatchProps = {
  timestamp: 1662682800,
  location: 'Curitiba, Paraná',
  stadium: 'Vila Capanema',
  teams: [teamLeft, teamRight]
};
