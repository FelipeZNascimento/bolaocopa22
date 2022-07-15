import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Match, FOOTBALL_MATCH_STATUS } from '@omegafox/components';
import { matchBetInfo } from 'constants/mocks';
import styles from './Bets.module.scss';

export const Bets = () => {
  let currentTimestamp = Math.floor(Date.now() / 1000);
  setTimeout(function () {
    currentTimestamp = Math.floor(Date.now() / 1000);
  }, 60000);

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
            isEditable={currentTimestamp < matchBetInfo.timestamp}
            isExpandable={false}
            clock={{ time: 0, status: FOOTBALL_MATCH_STATUS.NOT_STARTED }}
            timestamp={matchBetInfo.timestamp}
            teams={matchBetInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isEditable={currentTimestamp < matchBetInfo.timestamp}
            isExpandable={false}
            clock={{ time: 0, status: FOOTBALL_MATCH_STATUS.NOT_STARTED }}
            timestamp={matchBetInfo.timestamp}
            teams={matchBetInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isEditable={currentTimestamp < matchBetInfo.timestamp}
            isExpandable={false}
            clock={{ time: 0, status: FOOTBALL_MATCH_STATUS.NOT_STARTED }}
            timestamp={matchBetInfo.timestamp}
            teams={matchBetInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isEditable={currentTimestamp < matchBetInfo.timestamp}
            isExpandable={false}
            clock={{ time: 0, status: FOOTBALL_MATCH_STATUS.NOT_STARTED }}
            timestamp={matchBetInfo.timestamp}
            teams={matchBetInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isEditable={currentTimestamp < matchBetInfo.timestamp}
            isExpandable={false}
            clock={{ time: 0, status: FOOTBALL_MATCH_STATUS.NOT_STARTED }}
            timestamp={matchBetInfo.timestamp}
            teams={matchBetInfo.teams}
          />
        </div>
      </div>
      {!isMobile && <div className={styles.rightSection}>Ranking talvez</div>}
    </div>
  );
};
