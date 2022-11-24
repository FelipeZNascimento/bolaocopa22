import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import {
  Button,
  FINISHED_GAME,
  FOOTBALL_MATCH_STATUS,
  Loading,
  Match,
  NewsCard,
  TitleContainer
} from '@omegafox/components';

// Types
import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';
import { ITeamProps, TBetValues } from '@omegafox/components';
import { TNews } from 'store/news/types';

// Store
import { RootState } from 'store';
import { QueryHandler } from 'services/queryHandler';
import { useGetNewsQuery } from 'store/news/actions';
import { newsLoading, setNews } from 'store/news/reducer';

// Styles and images
import styles from './Home.module.scss';
import spinner from 'img/spinner.png';

// Services and Constants
import { getBetPoints } from 'services/betCalculator';
import { returnCountdownObject, TCountdownObject } from 'services/countdown';
import ROUTES from 'constants/routes';

export const Home = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState(
    parseInt((new Date().getTime() / 1000).toFixed(0))
  );
  const [countdownObject, setCountdownObject] =
    useState<TCountdownObject | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const useGetNewsResult = useGetNewsQuery();

  const matches = useSelector(
    (state: RootState) => state.match.matches
  ) as unknown as TMatch[];

  const isMatchesLoading = useSelector(
    (state: RootState) => state.match.matchesLoading
  ) as unknown as TMatch[];

  const seasonStart = useSelector(
    (state: RootState) => state.match.seasonStart
  ) as unknown as null | number;

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const isNewsLoading = useSelector(
    (state: RootState) => state.news.isNewsLoading
  ) as unknown as boolean;

  const news = useSelector(
    (state: RootState) => state.news.news
  ) as unknown as TNews[];

  useEffect(() => {
    dispatch(newsLoading(useGetNewsResult.isLoading));
    if (!useGetNewsResult.isLoading && useGetNewsResult.data) {
      const result = QueryHandler(useGetNewsResult.data);
      dispatch(setNews(result));
    }
  }, [useGetNewsResult.isLoading, useGetNewsResult.data]);

  useEffect(() => {
    if (!seasonStart) {
      return;
    }

    const interval = setInterval(function () {
      const timestamp = parseInt((new Date().getTime() / 1000).toFixed(0));

      setCurrentTimestamp(timestamp);
      if (timestamp > seasonStart) {
        setCountdownObject(null);
      } else {
        setCountdownObject(returnCountdownObject(seasonStart, timestamp));
      }
    }, 1000); // 60 * 1000 milsec

    return () => clearInterval(interval);
  }, [seasonStart]);

  const previousMatches =
    matches &&
    matches
      .filter((match) => match.status === FOOTBALL_MATCH_STATUS.FINAL)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const currentMatches =
    matches &&
    matches
      .filter((match) => match.status !== FOOTBALL_MATCH_STATUS.FINAL && match.status !== FOOTBALL_MATCH_STATUS.NOT_STARTED)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const nextMatches =
    matches &&
    matches
      .filter((match) => match.status === FOOTBALL_MATCH_STATUS.NOT_STARTED)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      console.log(nextMatches);

  const renderMatch = (match: TMatch) => {
    const matchTimestamp = new Date(match.timestamp).getTime() / 1000;
    let points: TBetValues | null = null;

    points = getBetPoints(match.loggedUserBets, match);

    const homeTeam: ITeamProps = {
      id: match.homeTeam.id,
      abbreviationEn: match.homeTeam.abbreviationEn,
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
      abbreviationEn: match.awayTeam.abbreviationEn,
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
      <div className={styles.match} key={match.id}>
        <Match
          betValue={points}
          key={match.id}
          id={match.id}
          isEditable={false}
          isExpandable={false}
          isHideClock={
            FINISHED_GAME.includes(match.status) ||
            match.status === FOOTBALL_MATCH_STATUS.NOT_STARTED
          }
          clock={{
            time: match.clock,
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

  const newsContainerClass = classNames(styles.newsContainer, {
    [styles.newsContainerMobile]: isMobile,
    [styles.newsContainerDesktop]: !isMobile
  });

  return (
    <main className={styles.app}>
      <div className={styles.topSection}>
        {countdownObject && (
          <p className={styles.countdown}>
            A Copa começa em {countdownObject.days} dias,{' '}
            {countdownObject.hours} horas, {countdownObject.minutes} minutos e{' '}
            {countdownObject.seconds} segundos
          </p>
        )}
        {countdownObject === null && (<p className={styles.countdown}>Inscrições encerradas com <b>recorde de inscritos</b>! Obrigado!</p>)}

        <p className={styles.title}>Bolão da Copa do Mundo 2022</p>
        <img src={spinner} alt="World Cup Logo" />
        <div>
          {loggedUser && (
            <Button isShadowed onClick={() => navigate(ROUTES.BETS.url)}>
              Apostar
            </Button>
          )}
          {!loggedUser && (
            <Button
              isShadowed
              onClick={() => navigate(`${ROUTES.HOME.url}#entrar`)}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
      <div className={styles.newsSection}>
        <TitleContainer text="Últimas Notícias" />
        <div className={newsContainerClass}>
          {isNewsLoading && <Loading image={spinner} />}
          {!isNewsLoading &&
            news &&
            news.map((item) => (
              <NewsCard
                key={item.link}
                date={''}
                image={item.image}
                link={item.link}
                resume={item.summary}
                title={item.title}
              />
            ))}
        </div>
      </div>
      {!isMobile && (
        <div className={styles.footer}>
          {isMatchesLoading && <Loading image={spinner} text="" />}

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
