import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Loading, TitleContainer } from '@omegafox/components';
import { MatchForBets, Selector } from 'components';
import { IBetObject } from 'components/MatchForBets/types';
import { Ranking } from 'sections/index';

// Store
import { RootState } from 'store';
import { TMatch } from 'store/match/types';
import { matchesUpdated } from 'store/match/reducer';
import { TUser } from 'store/user/types';

// Styles and images
import styles from './Bets.module.scss';
import logo from 'img/logo_translucid10.png';
import spinner from 'img/spinner.png';
import { cloneDeep } from 'lodash';

export const Bets = () => {
  const [selectedRound, setSelectedRound] = useState(1);
  const dispatch = useDispatch();

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const loginLoading = useSelector(
    (state: RootState) => state.user.loginLoading
  ) as unknown as boolean;

  const isMatchesLoading = useSelector(
    (state: RootState) => state.match.matchesLoading
  ) as boolean;

  const matches = useSelector(
    (state: RootState) => state.match.matches
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
      if (
        match.awayTeam.id === 0 ||
        match.homeTeam.id === 0 ||
        match.round !== selectedRound
      ) {
        return null;
      }

      const newDate = new Date(match.timestamp);
      if (!shownDate || newDate.getDate() !== shownDate.getDate()) {
        shownDate = new Date(match.timestamp);
        isDate = true;
      } else {
        isDate = false;
      }

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const matchTimestamp = Math.floor(newDate.getTime() / 1000);
      return (
        <MatchForBets
          isEditable={
            loggedUser !== null &&
            loggedUser.isActive &&
            currentTimestamp < matchTimestamp
          }
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
      <div className={leftSectionClass}>
        <Selector onClick={(itemId: number) => setSelectedRound(itemId)} />
        {!loggedUser && (
          <div className={styles.titleContainer}>
            <TitleContainer text="Você precisa estar logado para ter acesso a essa seção." />
          </div>
        )}
        {loggedUser && !loggedUser.isActive && (
          <div className={styles.titleContainer}>
            <TitleContainer text="As apostas serão liberadas após confirmação de pagamento." />
          </div>
        )}
        {(loginLoading || !matches) && <Loading image={spinner} />}

        {!isMatchesLoading &&
          !loginLoading &&
          loggedUser &&
          loggedUser.isActive &&
          renderMatches()}
      </div>
      {!isMobile && <Ranking isHeader isMinified backgroundImage={logo} />}
    </main>
  );
};
