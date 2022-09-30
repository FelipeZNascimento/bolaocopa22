import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { useDispatch, useSelector } from 'react-redux';
import { getBetPoints } from 'services/betCalculator';

// Components
import {
  FINISHED_GAME,
  FOOTBALL_MATCH_STATUS,
  Loading,
  Match
} from '@omegafox/components';

// Types
import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';
import { TBet } from 'store/bet/types';
import { ITeamProps, TBetValues } from '@omegafox/components';

// Store
import { RootState } from 'store';
import { useOnListAllMatchesQuery } from 'store/match/actions';
import { matchesSet } from 'store/match/reducer';
import { QueryHandler } from 'services/queryHandler';

// Styles and images
import styles from './Home.module.scss';
import spinner from 'img/spinner.png';
import { returnCountdownObject, TCountdownObject } from 'services/countdown';

export const Home = () => {
  const [needsToUpdateMatches, setNeedsToUpdateMatches] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [countdownObject, setCountdownObject] =
    useState<TCountdownObject | null>(null);
  const dispatch = useDispatch();

  const { data, error, isLoading, isFetching } = useOnListAllMatchesQuery(
    null,
    {
      pollingInterval: 10000,
      skip: isMobile
    }
  );

  const matches = useSelector(
    (state: RootState) => state.match.matches
  ) as unknown as TMatch[];

  const seasonStart = useSelector(
    (state: RootState) => state.match.seasonStart
  ) as unknown as null | number;

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  useEffect(() => {
    if (isFetching) {
      setNeedsToUpdateMatches(true);
    }
  }, [isFetching]);

  useEffect(() => {
    if (!isLoading && !error && data && needsToUpdateMatches) {
      setNeedsToUpdateMatches(false);
      const result = QueryHandler(data);
      dispatch(matchesSet(result));
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (!seasonStart) {
      return;
    }

    const interval = setInterval(function () {
      const timestamp = parseInt((new Date().getTime() / 1000).toFixed(0));

      setCurrentTimestamp(timestamp);
      setCountdownObject(returnCountdownObject(seasonStart, timestamp));
    }, 1000); // 60 * 1000 milsec

    return () => clearInterval(interval);
  }, [seasonStart]);

  const previousMatches =
    matches &&
    matches
      .filter((match) => {
        const matchTimestamp = parseInt(
          (new Date(match.timestamp).getTime() / 1000).toFixed(0)
        );

        if (
          matchTimestamp < currentTimestamp &&
          match.status === FOOTBALL_MATCH_STATUS.FINAL
        ) {
          return match;
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp);

  const currentMatches =
    matches &&
    matches
      .filter((match) => {
        const matchTimestamp = parseInt(
          (new Date(match.timestamp).getTime() / 1000).toFixed(0)
        );

        if (
          matchTimestamp < currentTimestamp &&
          match.status !== FOOTBALL_MATCH_STATUS.FINAL
        ) {
          return match;
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp);

  const nextMatches =
    matches &&
    matches
      .filter((match) => {
        const matchTimestamp = parseInt(
          (new Date(match.timestamp).getTime() / 1000).toFixed(0)
        );

        if (matchTimestamp > currentTimestamp) {
          return match;
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp);

  const renderMatch = (match: TMatch) => {
    const matchTimestamp = new Date(match.timestamp).getTime() / 1000;
    let points: TBetValues | null = null;

    const loggedUserBet: TBet | null = loggedUser
      ? match.bets.find((bet) => bet.user.id === loggedUser.id) || null
      : null;

    if (loggedUserBet) {
      points = getBetPoints(loggedUserBet, match);
    }
    const homeTeam: ITeamProps = {
      id: match.homeTeam.id,
      align: 'left',
      bet:
        loggedUser && match.loggedUserBets
          ? match.loggedUserBets.goalsHome
          : null,
      colors: match.homeTeam.colors,
      isEditable: false,
      logo: `https://assets.omegafox.me/img/countries_crests/${match.homeTeam.abbreviationEn.toLowerCase()}.png`,
      matchId: match.id,
      name: match.homeTeam.abbreviation,
      score: matchTimestamp < currentTimestamp ? match.homeTeam.goals : null
    };

    const awayTeam: ITeamProps = {
      id: match.awayTeam.id,
      align: 'right',
      bet:
        loggedUser && match.loggedUserBets
          ? match.loggedUserBets.goalsAway
          : null,
      colors: match.awayTeam.colors,
      isEditable: false,
      logo: `https://assets.omegafox.me/img/countries_crests/${match.awayTeam.abbreviationEn.toLowerCase()}.png`,
      matchId: match.id,
      name: match.awayTeam.abbreviation,
      score: matchTimestamp < currentTimestamp ? match.awayTeam.goals : null
    };

    return (
      <div className={styles.match}>
        <Match
          key={match.id}
          betValue={points}
          id={match.id}
          isEditable={false}
          isExpandable={false}
          isHideClock={
            FINISHED_GAME.includes(match.status) ||
            match.status === FOOTBALL_MATCH_STATUS.NOT_STARTED
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
    );
  };

  return (
    <main className={styles.app}>
      <div className={styles.topSection}>
        <h1>Bem-vindos ao Bolão da Copa do Mundo 2022</h1>
        <img src={spinner} />
        {countdownObject && (
          <h2>
            Faltam {countdownObject.days} dias, {countdownObject.hours} horas,{' '}
            {countdownObject.minutes} minutos e {countdownObject.seconds}{' '}
            segundos para o início da Copa
          </h2>
        )}
      </div>
      {!isMobile && (
        <div className={styles.bottomSection}>
          {isLoading && <Loading image={spinner} text="" />}

          {previousMatches && previousMatches.length > 0 && (
            <div className={styles.column}>
              <p>Finalizadas</p>
              {previousMatches.slice(0, 2).map((match) => renderMatch(match))}
            </div>
          )}
          {currentMatches && currentMatches.length > 0 && (
            <div className={styles.column}>
              <p>Em andamento</p>
              {currentMatches.slice(0, 2).map((match) => renderMatch(match))}
            </div>
          )}
          {nextMatches && nextMatches.length > 0 && (
            <div className={styles.column}>
              <p>Próximas</p>
              {nextMatches.slice(0, 2).map((match) => renderMatch(match))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};
