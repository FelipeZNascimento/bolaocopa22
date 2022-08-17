import React from 'react';
import {
  IRankingProps,
  TRankingRow,
  TClockFootball,
  FOOTBALL_MATCH_STATUS
} from '@omegafox/components';

export const footballClock: TClockFootball = {
  time: 45,
  status: FOOTBALL_MATCH_STATUS.FIRST_HALF
};

const singleRow: TRankingRow = [
  { id: 0, renderingFunction: () => <div>01.</div> },
  {
    id: 1,
    renderingFunction: () => <div>Felipe Zanon Felipe Zanon Felipe Zanon</div>
  },
  { id: 2, renderingFunction: () => <div>999</div> }
];

export const tableConfig: IRankingProps = {
  isHeader: true,
  columns: [
    {
      id: 0,
      align: 'left',
      flex: 1,
      renderingFunction: () => <div>Pos</div>
    },
    {
      id: 1,
      align: 'left',
      flex: 4,
      renderingFunction: () => <div>Nome</div>
    },
    {
      id: 2,
      align: 'right',
      flex: 1,
      renderingFunction: () => <div>Pts.</div>
    }
  ],
  rows: [
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow,
    singleRow
  ]
};
