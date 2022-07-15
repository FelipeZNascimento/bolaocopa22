import React from 'react';
import {
  IMatchProps,
  ITeamProps,
  TClockFootball,
  FOOTBALL_MATCH_STATUS
} from '@omegafox/components';

export const teamLeft: ITeamProps = {
  id: 0,
  align: 'left',
  colors: ['#FFDC02', '#19AE47'],
  isEditable: false,
  logo: 'https://teamcolorcodes.com/wp-content/uploads/2021/12/Brazil-National-Football-Team-Logo-211x300.png',
  name: 'Brasil',
  nameShort: 'BRA',
  score: 4
};

export const teamRight: ITeamProps = {
  id: 1,
  align: 'right',
  colors: ['#FFFFFF', '#43A1D5'],
  isEditable: false,
  logo: 'https://teamcolorcodes.com/wp-content/uploads/2021/12/Argentina-National-Football-Team-Logo-192x300.png',
  name: 'Argentina',
  nameShort: 'ARG',
  score: 0
};

const teamLeftNoBet = {
  ...teamLeft,
  score: null
};

const teamRightNoBet = {
  ...teamRight,
  score: null
};

export const footballClock: TClockFootball = {
  time: 45,
  status: FOOTBALL_MATCH_STATUS.FIRST_HALF
};

export const matchInfo: IMatchProps = {
  expandableContent: () => {
    return <p>Vila Capanema</p>;
  },
  clock: footballClock,
  timestamp: 1662682800,
  sport: 'football',
  teams: [teamLeft, teamRight]
};

export const matchBetInfo: IMatchProps = {
  ...matchInfo,
  clock: footballClock,
  timestamp: 1662682800,
  sport: 'football',
  teams: [teamLeftNoBet, teamRightNoBet]
};
