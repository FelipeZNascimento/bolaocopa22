import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import {
  Loading,
  Ranking as Rank,
  TRankingColumn,
  TRankingRow
} from '@omegafox/components';
import styles from './Ranking.module.scss';
import spinner from 'img/spinner.png';
import logo from 'img/logo_translucid10.png';
import { useGetRankingQuery } from 'store/base/base';
import { TRankingProps } from './types';

export const Ranking = ({
  backgroundImage = logo,
  isHeader = true,
  isMinified = false
}: TRankingProps) => {
  const [rows, setRows] = useState<TRankingRow[]>([]);
  const { data, error, isLoading } = useGetRankingQuery(null, {
    pollingInterval: 10000
  });

  useEffect(() => {
    if (!isLoading && data && data.isSuccess) {
      const rankingResult = data.result;
      const rankingRows = rankingResult.users.map((user) => {
        return [
          { id: 0, renderingFunction: () => <div>01.</div> },
          {
            id: 1,
            renderingFunction: () => <div>{user.nickname}</div>
          },
          { id: 2, renderingFunction: () => <div>{user.points}</div> },
          {
            id: 3,
            renderingFunction: () => (
              <div>
                {user.full} | {user.half} | {user.minimun}
              </div>
            )
          }
        ];
      });

      setRows(rankingRows);
    }
  }, [data, isLoading, error]);

  const containerClass = classNames(styles.container, {
    [styles.containerBrowser]: !isMobile,
    [styles.containerMobile]: isMobile
  });

  const columns: TRankingColumn[] = [
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
      align: isMinified ? 'right' : 'center',
      flex: 1,
      renderingFunction: () => <div>Pts.</div>
    }
  ];

  if (!isMinified) {
    columns.push({
      id: 3,
      align: 'right',
      flex: 1,
      renderingFunction: () => <div>&nbsp;</div>
    });
  }

  const renderRanking = () => {
    if (isLoading) {
      return <Loading image={spinner} />;
    }

    return (
      <Rank
        isHeader={isHeader}
        backgroundImage={backgroundImage}
        columns={columns}
        rows={rows}
      />
    );
  };

  if (isMinified) {
    return <div className={styles.rightSection}>{renderRanking()}</div>;
  }

  return (
    <main className={containerClass}>
      <div className={styles.rankingContainer}>{renderRanking()}</div>
    </main>
  );
};
