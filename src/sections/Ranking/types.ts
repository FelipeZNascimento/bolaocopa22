import { TRankingColumn, TRankingRow } from '@omegafox/components';

export type TRankingProps = {
  isMinified?: boolean;
  backgroundImage?: string;
  isHeader?: boolean;
  columns?: TRankingColumn[];
  rows?: TRankingRow[];
};
