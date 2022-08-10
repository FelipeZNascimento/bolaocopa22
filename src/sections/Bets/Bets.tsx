import React from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Match, Ranking, ITeamProps, Loading } from '@omegafox/components';
import { tableConfig } from 'constants/mocks';
import { RootState } from 'store';
import { TMatch } from 'store/matches/types';

// Styles and images
import styles from './Bets.module.scss';
import logo from 'img/logo_translucid10.png';
import spinner from 'img/spinner.png';

export const Bets = () => {
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

  const renderMatches = () => {
    if (!matches) {
      return null;
    }

    let shownDate: Date;
    let isDate: boolean;

    return matches.map((match) => {
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
        isEditable: true,
        logo: 'https://teamcolorcodes.com/wp-content/uploads/2021/12/Brazil-National-Football-Team-Logo-211x300.png',
        name: match.homeTeam.name,
        nameShort: match.homeTeam.abbreviation,
        score: match.loggedUserBets ? match.loggedUserBets.goalsHome : null
      };

      const awayTeam: ITeamProps = {
        id: match.awayTeam.id,
        align: 'right',
        colors: match.awayTeam.colors,
        isEditable: true,
        logo: 'https://teamcolorcodes.com/wp-content/uploads/2021/12/Brazil-National-Football-Team-Logo-211x300.png',
        name: match.awayTeam.name,
        nameShort: match.awayTeam.abbreviation,
        score: match.loggedUserBets ? match.loggedUserBets.goalsAway : null
      };

      return (
        <>
          {isDate && <h2>{shownDate.toLocaleDateString()}</h2>}

          <div key={match.id} className={styles.match}>
            <Match
              key={match.id}
              isEditable={true}
              clock={{ time: 0, status: match.status }}
              timestamp={parseInt(
                (new Date(match.timestamp).getTime() / 1000).toFixed(0)
              )}
              teams={[homeTeam, awayTeam]}
            />
          </div>
        </>
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
