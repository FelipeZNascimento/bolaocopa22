import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Match } from '@omegafox/components';
import { matchInfo } from 'constants/mocks';
import styles from './Results.module.scss';

export const Results = () => {
  const containerClass = classNames(styles.container, {
    [styles.containerBrowser]: !isMobile,
    [styles.containerMobile]: isMobile
  });

  const leftSectionClass = classNames(styles.leftSection, {
    [styles.leftSectionBrowser]: !isMobile,
    [styles.leftSectionMobile]: isMobile
  });

  return (
    <div className={containerClass}>
      <div className={leftSectionClass}>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            location={matchInfo.location}
            stadium={matchInfo.stadium}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
      </div>
      {!isMobile && <div className={styles.rightSection}>Ranking talvez</div>}
    </div>
  );
};
