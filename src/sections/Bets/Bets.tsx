import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Ranking, Loading } from '@omegafox/components';
import { tableConfig } from 'constants/mocks';
import { MatchForBets } from 'components';
import { IBetObject } from 'components/MatchForBets/types';

// Store
import { RootState } from 'store';
import { TMatch } from 'store/match/types';
import { matchesUpdated } from 'store/match/reducer';

// Styles and images
import styles from './Bets.module.scss';
import logo from 'img/logo_translucid10.png';
import spinner from 'img/spinner.png';
import { cloneDeep } from 'lodash';

export const Bets = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(
    (state: RootState) => state.matches.matchesLoading
  ) as boolean;

  const matches = useSelector(
    (state: RootState) => state.matches.matches
  ) as unknown as TMatch[];

  const containerClass = classNames(styles.container, {
    [styles.containerBrowser]: !isMobile,
    [styles.containerMobile]: isMobile
  });

  const leftSectionClass = classNames(styles.leftSection, {
    [styles.leftSectionBrowser]: !isMobile,
    [styles.leftSectionMobile]: isMobile
  });

  const updateStoreWithNewBets = (betObject: IBetObject) => {
    const updatedMatches = cloneDeep(matches).map((match) => {
      if (match.id === betObject.matchId) {
        return {
          ...match,
          loggedUserBets: {
            goalsAway: betObject.goalsAway,
            goalsHome: betObject.goalsHome
          }
        };
      }

      return match;
    });

    dispatch(matchesUpdated(updatedMatches));
  };

  const renderMatches = () => {
    if (!matches) {
      return null;
    }

    let shownDate: Date;
    let isDate: boolean;

    return matches.map((match) => {
      if (match.awayTeam.id === 0 || match.homeTeam.id === 0) {
        return null;
      }

      const newDate = new Date(match.timestamp);
      if (!shownDate || newDate.getDate() !== shownDate.getDate()) {
        shownDate = new Date(match.timestamp);
        isDate = true;
      } else {
        isDate = false;
      }

      return (
        <MatchForBets
          key={match.id}
          match={match}
          shownDate={isDate ? shownDate : null}
          onChange={updateStoreWithNewBets}
        />
      );
    });
  };

  return (
    <main className={containerClass}>
      {isLoading && <Loading image={spinner} />}
      {!isLoading && <div className={leftSectionClass}>{renderMatches()}</div>}
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
