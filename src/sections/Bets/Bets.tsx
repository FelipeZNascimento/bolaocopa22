import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Match, Ranking, FOOTBALL_MATCH_STATUS } from '@omegafox/components';
import { matchBetInfo, tableConfig } from 'constants/mocks';
import styles from './Bets.module.scss';
import logo from 'img/logo_translucid10.png';

export const Bets = () => {
  // let currentTimestamp = Math.floor(Date.now() / 1000);
  // setTimeout(function () {
  //   currentTimestamp = Math.floor(Date.now() / 1000);
  // }, 60000);

  const containerClass = classNames(styles.container, {
    [styles.containerBrowser]: !isMobile,
    [styles.containerMobile]: isMobile
  });

  const leftSectionClass = classNames(styles.leftSection, {
    [styles.leftSectionBrowser]: !isMobile,
    [styles.leftSectionMobile]: isMobile
  });

  const renderNMatches = (n: number) => {
    return [...Array(n)].map((e, i) => (
      <div key={i} className={styles.match}>
        <Match
          isEditable={true}
          clock={{ time: 0, status: FOOTBALL_MATCH_STATUS.NOT_STARTED }}
          timestamp={matchBetInfo.timestamp}
          teams={matchBetInfo.teams}
        />
      </div>
    ));
  };

  return (
    <main className={containerClass}>
      <div className={leftSectionClass}>{renderNMatches(10)}</div>
      {!isMobile && (
        <div className={styles.rightSection}>
          <Ranking
            isHeader
            backgroundImage={logo}
            columns={tableConfig.columns}
            rows={tableConfig.rows}
          />
        </div>
      )}
    </main>
  );
};
