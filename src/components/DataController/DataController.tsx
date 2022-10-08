import React from 'react';
import { ExtraBetsController } from './ExtraBetsController';
import { MatchController } from './MatchController';
import { RankingController } from './RankingController';

export const DataController = () => {
  return (
    <>
      <ExtraBetsController />
      <MatchController />
      <RankingController />
    </>
  );
};
