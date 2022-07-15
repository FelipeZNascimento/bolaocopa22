import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Match, FOOTBALL_MATCH_STATUS } from '@omegafox/components';
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
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{ time: 39, status: FOOTBALL_MATCH_STATUS.FIRST_HALF }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{ time: 39, status: FOOTBALL_MATCH_STATUS.HALFTIME }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{ time: 46, status: FOOTBALL_MATCH_STATUS.SECOND_HALF }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{
              time: 46,
              status: FOOTBALL_MATCH_STATUS.AWAITING_OVERTIME
            }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{
              time: 13,
              status: FOOTBALL_MATCH_STATUS.FIRST_HALF_OVERTIME
            }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{
              time: 46,
              status: FOOTBALL_MATCH_STATUS.HALFTIME_OVERTIME
            }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{
              time: 15,
              status: FOOTBALL_MATCH_STATUS.SECOND_HALF_OVERTIME
            }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{ time: 46, status: FOOTBALL_MATCH_STATUS.FINAL_OVERTIME }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{
              time: 46,
              status: FOOTBALL_MATCH_STATUS.AWAITING_PENALTIES
            }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
        <div className={styles.match}>
          <Match
            isExpandable
            isEditable={false}
            expandableContent={() => {
              return <p>Vila Capanema</p>;
            }}
            clock={{ time: 0, status: FOOTBALL_MATCH_STATUS.PENALTIES }}
            timestamp={matchInfo.timestamp}
            teams={matchInfo.teams}
          />
        </div>
      </div>
      {!isMobile && <div className={styles.rightSection}>Ranking talvez</div>}
    </div>
  );
};
