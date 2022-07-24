import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Match, FOOTBALL_MATCH_STATUS, Ranking } from '@omegafox/components';
import { tableConfig, matchInfo } from 'constants/mocks';
import styles from './Results.module.scss';
import logo from 'img/logo_translucid10.png';

export const Results = () => {
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
          isExpandable
          isEditable={false}
          expandableContent={() => {
            return <p>Vila Capanema</p>;
          }}
          clock={{ time: 0, status: FOOTBALL_MATCH_STATUS.NOT_STARTED }}
          timestamp={matchInfo.timestamp}
          teams={matchInfo.teams}
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
