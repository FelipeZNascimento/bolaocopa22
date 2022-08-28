import React from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Match, Ranking, ITeamProps, Loading } from '@omegafox/components';
import { tableConfig } from 'constants/mocks';
import { RootState } from 'store';
import { TMatch } from 'store/match/types';

// Styles and images
import styles from './Results.module.scss';
import spinner from 'img/spinner.png';
import logo from 'img/logo_translucid10.png';
import { WEEKDAY } from 'constants/weekdays';

export const Results = () => {
  const isLoading = useSelector(
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
              id={match.id}
              isEditable={false}
              expandableContent={() => {
                return (
                  <>
                    <p>
                      Estádio: {match.stadium.name}
                      <br />
                      Cidade: {match.stadium.city}
                      <br />
                      Capacidade: {match.stadium.capacity}
                      <br />
                      Árbitro: {match.referee.name}
                    </p>
                  </>
                );
              }}
              clock={{ time: 0, status: match.status }}
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
