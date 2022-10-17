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
  TBET_VALUES,
  ITeamProps,
  TBetValues
} from '@omegafox/components';
import { Selector } from 'components/index';
import { Ranking } from 'sections/index';

// Store
import { RootState } from 'store';
import { TMatch } from 'store/match/types';
import { TBet } from 'store/bet/types';
import { TUser } from 'store/user/types';

// Styles and images
import styles from './Results.module.scss';
import spinner from 'img/spinner.png';
import logo from 'img/logo_translucid10.png';

// Constants
import { WEEKDAY } from 'constants/weekdays';

export const BET_VALUES: TBET_VALUES = {
  FULL: 5,
  HALF: 3,
  MINIMUN: 2,
  MISS: 0
};

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
      const hasMatchStarted = matchTimestamp < currentTimestamp;

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
        score: hasMatchStarted ? match.homeTeam.goals : null
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
        score: hasMatchStarted ? match.awayTeam.goals : null
      };

      const renderMatchInfo = () => {
        return (
          <div key={match.id} className={styles.expandableNotStarted}>
            <div className={styles.expandableNotStartedContent}>
              <img
                alt="Stadium image"
                src={`https://assets.omegafox.me/img/stadiums/${match.stadium.id}.png`}
              />
              <p>{match.stadium.name}</p>
              <p>{match.stadium.city}</p>
              <p>{match.stadium.capacity} pessoas</p>
            </div>
            <div className={styles.expandableNotStartedContent}>
              <p>Árbitro: {match.referee.name}</p>
            </div>
          </div>
        );
      };

      const renderSingleBet = (bet: TBet, userBet = false) => {
        const singleBetPoints = getBetPoints(bet, match);
        const betContainerClass = classNames(styles.singleBetContainer, {
          [styles.singleBetContainerUser]: userBet
        });

        const betClass = classNames({
          [styles.singleBetGreen]: singleBetPoints === BET_VALUES.FULL,
          [styles.singleBetBlue]: singleBetPoints === BET_VALUES.HALF,
          [styles.singleBetLightBlue]: singleBetPoints === BET_VALUES.MINIMUN,
          [styles.singleBetRed]: singleBetPoints === BET_VALUES.MISS
        });

        return (
          <div className={betContainerClass}>
            <div className={styles.singleBetOwner}>
              {userBet ? '>' : ''} {bet.user.nickname}
            </div>
            <div className={`${betClass} ${styles.singleBetScore}`}>{`${
              bet.goalsHome !== null ? bet.goalsHome : 'x'
            } - ${bet.goalsAway !== null ? bet.goalsAway : 'x'}`}</div>
            <div className={`${betClass} ${styles.singleBetPoints}`}>
              {singleBetPoints} Pts.
            </div>
          </div>
        );
      };

      const renderBets = () => {
        const matchBetsFull: TBet[] = [];
        const matchBetsHalf: TBet[] = [];
        const matchBetsMinimun: TBet[] = [];
        const matchBetsMiss: TBet[] = [];

        match.bets.forEach((bet) => {
          if (loggedUser && bet.user.id === loggedUser.id) {
            return;
          }
          const singleBetPoints = getBetPoints(bet, match);
          if (singleBetPoints === BET_VALUES.FULL) {
            matchBetsFull.push(bet);
          } else if (singleBetPoints === BET_VALUES.HALF) {
            matchBetsHalf.push(bet);
          } else if (singleBetPoints === BET_VALUES.MINIMUN) {
            matchBetsMinimun.push(bet);
          } else {
            matchBetsMiss.push(bet);
          }
        });

        matchBetsHalf.sort(
          (a, b) => b.goalsHome - a.goalsHome || b.goalsAway - a.goalsAway
        );
        matchBetsMinimun.sort(
          (a, b) => b.goalsHome - a.goalsHome || b.goalsAway - a.goalsAway
        );
        matchBetsMiss.sort(
          (a, b) => b.goalsHome - a.goalsHome || b.goalsAway - a.goalsAway
        );

        return (
          <div className={styles.expandableStarted}>
            {!isMobile && (
              <div className={styles.expandableStartedStadium}>
                <img
                  alt="Stadium image"
                  src={`https://assets.omegafox.me/img/stadiums/${match.stadium.id}.png`}
                />
              </div>
            )}
            <div className={styles.expandableStartedBets}>
              {match.loggedUserBets &&
                renderSingleBet(match.loggedUserBets, true)}
              {matchBetsFull.map((bet) => {
                return renderSingleBet(bet);
              })}
              {matchBetsHalf.map((bet) => {
                return renderSingleBet(bet);
              })}
              {matchBetsMinimun.map((bet) => {
                return renderSingleBet(bet);
              })}
              {matchBetsMiss.map((bet) => {
                return renderSingleBet(bet);
              })}
            </div>
          </div>
        );
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
              betValue={hasMatchStarted ? points : null}
              id={match.id}
              isEditable={false}
              isHideClock={isMobile}
              expandableContent={
                !hasMatchStarted ? renderMatchInfo : renderBets
              }
              clock={{
                time: 0,
                status:
                  match.status === FOOTBALL_MATCH_STATUS.NOT_STARTED &&
                  hasMatchStarted
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
        {!isMatchesLoading && renderMatches()}
        {isMatchesLoading && <Loading image={spinner} />}
      </div>
      {!isMobile && <Ranking isHeader isMinified backgroundImage={logo} />}
    </main>
  );
};
