import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';
import { QueryHandler } from 'services/queryHandler';
import { getBetPoints, getBetStatus } from 'services/betCalculator';

// Components
import {
  Match,
  ITeamProps,
  Loading,
  Selector,
  TBetStatus,
  FOOTBALL_MATCH_STATUS
} from '@omegafox/components';
import { Ranking } from 'sections/index';

// Store
import { RootState } from 'store';
import { useOnListAllMatchesQuery } from 'store/match/actions';
import { matchesSet } from 'store/match/reducer';
import { TMatch } from 'store/match/types';
import { TBet } from 'store/bet/types';
import { TUser } from 'store/user/types';

// Styles and images
import styles from './Results.module.scss';
import spinner from 'img/spinner.png';
import logo from 'img/logo_translucid10.png';

// Constants
import { WEEKDAY } from 'constants/weekdays';
import { BET_VALUES } from 'constants/bets';

export const Results = () => {
  const [selectedRound, setSelectedRound] = useState(1);
  const dispatch = useDispatch();

  const { data, error, isLoading } = useOnListAllMatchesQuery(null, {
    pollingInterval: 10000
  });

  let currentTimestamp = new Date().getTime() / 1000;
  setInterval(function () {
    currentTimestamp = new Date().getTime() / 1000;
  }, 1000); // 60 * 1000 milsec

  useEffect(() => {
    if (!isLoading && !error && data) {
      const result = QueryHandler(data);
      dispatch(matchesSet(result));
    }
  }, [data, isLoading]);

  const matches = useSelector(
    (state: RootState) => state.match.matches
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
      const loggedUserBet: TBet | null = loggedUser
        ? match.bets.find((bet) => bet.user.id === loggedUser.id) || null
        : null;
      let betStatus: TBetStatus = 'neutral';

      if (loggedUserBet) {
        const points = getBetPoints(loggedUserBet, match);
        betStatus = getBetStatus(points);
      }

      const newDate = new Date(match.timestamp);
      const matchTimestamp = newDate.getTime() / 1000;

      if (!shownDate || newDate.getDate() !== shownDate.getDate()) {
        shownDate = new Date(match.timestamp);
        isDate = true;
      } else {
        isDate = false;
      }

      const homeTeam: ITeamProps = {
        id: match.homeTeam.id,
        align: 'left',
        colors: match.homeTeam.colors,
        isEditable: false,
        logo: `https://assets.omegafox.me/img/countries_crests/${match.homeTeam.abbreviationEn.toLowerCase()}.png`,
        matchId: match.id,
        name: match.homeTeam.name,
        nameShort: match.homeTeam.abbreviation,
        score: match.homeTeam.goals
      };

      const awayTeam: ITeamProps = {
        id: match.awayTeam.id,
        align: 'right',
        colors: match.awayTeam.colors,
        isEditable: false,
        logo: `https://assets.omegafox.me/img/countries_crests/${match.awayTeam.abbreviationEn.toLowerCase()}.png`,
        matchId: match.id,
        name: match.awayTeam.name,
        nameShort: match.awayTeam.abbreviation,
        score: match.awayTeam.goals
      };

      const renderMatchInfo = () => {
        return (
          <div className={styles.expandableNotStarted}>
            <div className={styles.expandableNotStartedContent}>
              <img
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
        const points = getBetPoints(bet, match);
        const betContainerClass = classNames(styles.singleBetContainer, {
          [styles.singleBetContainerUser]: userBet
        });

        const betClass = classNames({
          [styles.singleBetGreen]: points === BET_VALUES.FULL,
          [styles.singleBetBlue]: points === BET_VALUES.HALF,
          [styles.singleBetLightBlue]: points === BET_VALUES.MINIMUN,
          [styles.singleBetRed]: points === BET_VALUES.MISS
        });

        return (
          <div className={betContainerClass}>
            <div className={styles.singleBetOwner}>
              {userBet ? '>' : ''} {bet.user.nickname}
            </div>
            <div
              className={`${betClass} ${styles.singleBetScore}`}
            >{`${bet.goalsHome} x ${bet.goalsAway}`}</div>
            <div className={`${betClass} ${styles.singleBetPoints}`}>
              {points} Pts.
            </div>
          </div>
        );
      };

      const renderBets = () => {
        return (
          <div className={styles.expandableStarted}>
            {!isMobile && (
              <div className={styles.expandableStartedStadium}>
                <img
                  src={`https://assets.omegafox.me/img/stadiums/${match.stadium.id}.png`}
                />
              </div>
            )}
            <div className={styles.expandableStartedBets}>
              {loggedUserBet && renderSingleBet(loggedUserBet, true)}
              {match.bets.map((bet) => {
                return renderSingleBet(bet);
              })}
            </div>
          </div>
        );
      };

      return (
        <span key={match.id}>
          {isDate && (
            <h2>
              {WEEKDAY[shownDate.getDay()]}, {shownDate.toLocaleDateString()}
            </h2>
          )}
          <div className={styles.match}>
            <Match
              isExpandable
              betStatus={betStatus}
              id={match.id}
              isEditable={false}
              expandableContent={
                matchTimestamp > currentTimestamp ? renderMatchInfo : renderBets
              }
              clock={{
                time: 0,
                status:
                  match.status === FOOTBALL_MATCH_STATUS.NOT_STARTED &&
                  matchTimestamp < currentTimestamp
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

  const mockItems = [
    {
      id: 0,
      value: 1,
      text: 'Rodada 1'
    },
    {
      id: 1,
      value: 2,
      text: 'Rodada 2'
    },
    {
      id: 2,
      value: 3,
      text: 'Rodada 3'
    },
    {
      id: 3,
      value: 4,
      text: '2a Fase'
    }
  ];

  return (
    <main className={containerClass}>
      <div className={leftSectionClass}>
        <Selector
          items={mockItems}
          selectedItem={selectedRound}
          onClick={(itemId: number) => setSelectedRound(itemId)}
        />
        {!isLoading && renderMatches()}
        {isLoading && <Loading image={spinner} />}
      </div>
      {!isMobile && <Ranking isHeader isMinified backgroundImage={logo} />}
    </main>
  );
};
