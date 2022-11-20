import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';
import { getBetPoints } from 'services/betCalculator';

// Components
import {
  Match,
  Loading,
  FOOTBALL_MATCH_STATUS,
  ITeamProps,
  TBetValues
} from '@omegafox/components';
import { Selector } from 'components/index';
import { Ranking } from 'sections/index';

// Store
import { RootState } from 'store';
import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';

// Styles and images
import styles from './Results.module.scss';
import spinner from 'img/spinner.png';
import logo from 'img/logo_translucid10.png';

// Constants
import { WEEKDAY } from 'constants/weekdays';
import { MatchInternal } from './MatchInternal';

export const Results = () => {
  const [selectedRound, setSelectedRound] = useState(1);
  const [currentTimestamp, setCurrentTimestamp] = useState(
    parseInt((new Date().getTime() / 1000).toFixed(0))
  );

  useEffect(() => {
    const interval = setInterval(function () {
      const timestamp = parseInt((new Date().getTime() / 1000).toFixed(0));

      setCurrentTimestamp(timestamp);
    }, 1000); // 60 * 1000 milsec

    return () => clearInterval(interval);
  }, []);

  const matches = useSelector(
    (state: RootState) => state.match.matches
  ) as unknown as TMatch[];

  const isMatchesLoading = useSelector(
    (state: RootState) => state.match.matchesLoading
  ) as unknown as TMatch[];

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const loginLoading = useSelector(
    (state: RootState) => state.user.loginLoading
  ) as unknown as boolean;

  const containerClass = classNames(styles.container, {
    [styles.containerBrowser]: !isMobile,
    [styles.containerMobile]: isMobile
  });

  const leftSectionClass = classNames(styles.leftSection, {
    [styles.leftSectionBrowser]: !isMobile,
    [styles.leftSectionMobile]: isMobile
  });

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

      let points: TBetValues | null = null;
      if (match.loggedUserBets) {
        points = getBetPoints(match.loggedUserBets, match);
      }

      const newDate = new Date(match.timestamp);
      const matchTimestamp = newDate.getTime() / 1000;
      const isMatchStarted = matchTimestamp < currentTimestamp;

      if (!shownDate || newDate.getDate() !== shownDate.getDate()) {
        shownDate = new Date(match.timestamp);
        isDate = true;
      } else {
        isDate = false;
      }

      const homeTeam: ITeamProps = {
        id: match.homeTeam.id,
        align: 'left',
        abbreviationEn: match.homeTeam.abbreviationEn,
        bet:
          loggedUser && match.loggedUserBets
            ? match.loggedUserBets.goalsHome
            : null,
        colors: match.homeTeam.colors,
        isEditable: false,
        logo: `https://assets.omegafox.me/img/countries_crests/${match.homeTeam.abbreviationEn.toLowerCase()}_small.png`,
        matchId: match.id,
        name: isMobile ? match.homeTeam.abbreviation : match.homeTeam.name,
        score: isMatchStarted ? match.homeTeam.goals : null
      };

      const awayTeam: ITeamProps = {
        id: match.awayTeam.id,
        align: 'right',
        abbreviationEn: match.awayTeam.abbreviationEn,
        bet:
          loggedUser && match.loggedUserBets
            ? match.loggedUserBets.goalsAway
            : null,
        colors: match.awayTeam.colors,
        isEditable: false,
        logo: `https://assets.omegafox.me/img/countries_crests/${match.awayTeam.abbreviationEn.toLowerCase()}_small.png`,
        matchId: match.id,
        name: isMobile ? match.awayTeam.abbreviation : match.awayTeam.name,
        score: isMatchStarted ? match.awayTeam.goals : null
      };

      return (
        <span key={match.id}>
          {isDate && (
            <p className={styles.date}>
              {WEEKDAY[shownDate.getDay()]}, {shownDate.toLocaleDateString()}
            </p>
          )}
          <div className={styles.match}>
            <Match
              isExpandable
              key={match.id}
              betValue={points}
              id={match.id}
              isEditable={false}
              expandableContent={() => (
                <MatchInternal
                  key={match.id}
                  isMatchStarted={isMatchStarted}
                  match={match}
                />
              )}
              clock={{
                time: match.clock,
                status:
                  match.status === FOOTBALL_MATCH_STATUS.NOT_STARTED &&
                  isMatchStarted
                    ? FOOTBALL_MATCH_STATUS.FIRST_HALF
                    : match.status
              }}
              timestamp={parseInt(
                (new Date(match.timestamp).getTime() / 1000).toFixed(0)
              )}
              teams={[homeTeam, awayTeam]}
            />
          </div>
        </span>
      );
    });
  };

  return (
    <main className={containerClass}>
      <div className={leftSectionClass}>
        <Selector onClick={(itemId: number) => setSelectedRound(itemId)} />
        {(isMatchesLoading || loginLoading || !matches) && (
          <Loading image={spinner} />
        )}
        {!isMatchesLoading && !loginLoading && renderMatches()}
      </div>
      {!isMobile && <Ranking isHeader isMinified backgroundImage={logo} />}
    </main>
  );
};
