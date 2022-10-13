import { TTableColumn, TTableRow } from '@omegafox/components';

export type TRankingProps = {
  isMinified?: boolean;
  backgroundImage?: string;
  isHeader?: boolean;
  columns?: TTableColumn[];
  rows?: TTableRow[];
};
