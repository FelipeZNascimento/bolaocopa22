import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

// Components
import {
  Loading,
  Table,
  StatusBadge,
  TextContainer,
  Tooltip,
  TTableColumn,
  TTableRow
} from '@omegafox/components';

// Store
import { RootState } from 'store';

// Types
import { TRankingProps } from './types';
import { TRankingResult } from 'store/ranking/types';

// Style and images
import styles from './Ranking.module.scss';
import spinner from 'img/spinner.png';
import logo from 'img/logo_translucid10.png';

export const Ranking = ({
  backgroundImage = logo,
  isHeader = true,
  isMinified = false
}: TRankingProps) => {
  const [rows, setRows] = useState<TTableRow[]>([]);

  const rankingResult = useSelector(
    (state: RootState) => state.ranking.rankingResult
  ) as unknown as TRankingResult;

  const rankingLoading = useSelector(
    (state: RootState) => state.ranking.rankingLoading
  ) as unknown as boolean;

  useEffect(() => {
    if (!rankingLoading && rankingResult) {
      const rankingRows = rankingResult.users.map((user) => {
        const positionClass = classNames({
          [styles.yellow]: user.position === 1,
          [styles.greyThree]: user.position === 2,
          [styles.orange]: user.position === 3
        });

        const renderStatusBadge = () => {
          const currentTimestamp = parseInt(
            (new Date().getTime() / 1000).toFixed(0)
          );

          const isOnline = user.lastTimestamp + 5 * 60 > currentTimestamp;

          return <StatusBadge color={isOnline ? 'green' : 'grey'} />;
        };

        return [
          {
            id: 0,
            renderingFunction: () => (
              <div className={positionClass}>{user.position}.</div>
            )
          },
          {
            id: 1,
            renderingFunction: () => (
              <div className={styles.nickname}>
                &nbsp;{renderStatusBadge()}&nbsp;{user.nickname}
              </div>
            )
          },
          { id: 2, renderingFunction: () => <div>{user.points}</div> },
          {
            id: 3,
            renderingFunction: () => (
              <div className={styles.pointsDetails}>
                <Tooltip text="Acerto completo">
                  <span className={styles.green}>{user.full}</span>
                </Tooltip>
                <Tooltip text="Acerto parcial">
                  <span className={styles.blue}>{user.half}</span>
                </Tooltip>
                <Tooltip text="Acerto mínimo">
                  <span className={styles.lightBlue}>{user.minimun}</span>
                </Tooltip>
              </div>
            )
          }
        ];
      });

      setRows(rankingRows);
    }
  }, [rankingLoading, rankingResult]);

  const containerClass = classNames(styles.container, {
    [styles.containerBrowser]: !isMobile,
    [styles.containerMobile]: isMobile
  });

  const columns: TTableColumn[] = [
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
      flex: 2,
      renderingFunction: () => <div>&nbsp;</div>
    });
  }

  const renderRanking = () => {
    if (rankingLoading) {
      return <Loading image={spinner} />;
    }

    return (
      <TextContainer backgroundImage={backgroundImage}>
        <Table isHeader={isHeader} columns={columns} rows={rows} />
      </TextContainer>
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
