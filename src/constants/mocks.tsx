import {
  TClockFootball,
  TDropdownItem,
  FOOTBALL_MATCH_STATUS
} from '@omegafox/components';

export const footballClock: TClockFootball = {
  time: 45,
  status: FOOTBALL_MATCH_STATUS.FIRST_HALF
};

export const dropdownList: TDropdownItem[] = [
  {
    id: 0,
    name: 'Lionel Messi',
    details: {
      nameShort: 'ARG',
      colors: ['#FFFFFF', '#43A1D5'],
      id: 3,
      name: 'Argentina'
    }
  },
  {
    id: 1,
    name: 'Cristiano Ronaldo',
    details: {
      nameShort: 'POR',
      colors: ['#FFFFFF', '#E42518'],
      id: 27,
      name: 'Portugal'
    }
  },
  {
    id: 2,
    name: 'Mbappé',
    details: {
      nameShort: 'FRA',
      colors: ['#FFFFFF', '#21304D'],
      id: 17,
      name: 'França'
    }
  },
  {
    id: 3,
    name: 'Caio Jr.',
    details: {
      nameShort: 'BRA',
      colors: ['#193375', '#FFDC02'],
      id: 6,
      name: 'Brasil'
    }
  },
  {
    id: 4,
    name: 'Darwin Nuñez',
    details: {
      nameShort: 'URU',
      colors: ['#000000', '#55B5E5'],
      id: 32,
      name: 'Uruguai'
    }
  }
];
