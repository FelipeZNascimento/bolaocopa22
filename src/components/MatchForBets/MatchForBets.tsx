import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import {
  Match as MatchOmegafox,
  ITeamProps,
  IBetId
} from '@omegafox/components';
import { IBetObject } from './types';

// Store
import { RootState } from 'store';
import { useOnUpdateBetMutation } from 'store/bet/actions';

// Types
import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';
import { ITeam } from 'store/team/types';

// Styles and images
import styles from './MatchForBets.module.scss';
import { WEEKDAY } from 'constants/weekdays';

// Constants and services
import { getBetPoints } from 'services/betCalculator';
import ROUTES from 'constants/routes';

interface IMatchForBets {
  isEditable?: boolean;
  shownDate: Date | null;
  match: TMatch;
  onChange: (currentBet: IBetObject) => void;
}

export const MatchForBets = ({
  isEditable = false,
  match,
  shownDate,
  onChange
}: IMatchForBets) => {
  const [isError, setIsError] = useState<boolean>(false);

  const [updateBetTrigger, updateBetResult] = useOnUpdateBetMutation();

  const { isLoading } = updateBetResult;
  const navigate = useNavigate();

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  let points = null;
  if (loggedUser && loggedUser.isActive && match.loggedUserBets) {
    points = getBetPoints(match.loggedUserBets, match);
  }

  useEffect(() => {
    // If something went wrong, show error and block match. As user to refresh the page.
    if (
      !updateBetResult.isLoading &&
      !updateBetResult.isUninitialized &&
      (!updateBetResult.isSuccess || !updateBetResult.data.isSuccess)
    ) {
      setIsError(true);
    } else if (
      !updateBetResult.isLoading &&
      !updateBetResult.isUninitialized &&
      updateBetResult.isSuccess &&
      updateBetResult.data.isSuccess
    ) {
      setIsError(false);
    }
  }, [updateBetResult]);

  const handleScoreChange = (newBet: IBetId[]) => {
    if (!loggedUser) {
      setIsError(true);
      return;
    }

    const homeTeamBet = newBet.find(
      (item) => item.id === match.homeTeam.id
    )?.bet;
    const awayTeamBet = newBet.find(
      (item) => item.id === match.awayTeam.id
    )?.bet;

    const betObject = {
      betId: match.loggedUserBets ? match.loggedUserBets.id : null,
      matchId: match.id,
      userId: loggedUser.id,
      goalsHome: homeTeamBet === undefined ? null : homeTeamBet,
      goalsAway: awayTeamBet === undefined ? null : awayTeamBet
    };

    updateBetTrigger(betObject);
    onChange(betObject);
  };

  const handleTeamClick = (teamId: number) => {
    const selectedTeam = teams.find((team) => team.id === teamId);
    if (selectedTeam) {
      navigate({
        pathname: `${ROUTES.TEAMS.url}/${selectedTeam.name
          .replace(/\s+/g, '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')}`
      });
    }
  };

  const homeTeam: ITeamProps = {
    id: match.homeTeam.id,
    abbreviationEn: match.homeTeam.abbreviationEn,
    align: 'left',
    bet: match.loggedUserBets ? match.loggedUserBets.goalsHome : null,
    colors: match.homeTeam.colors,
    isEditable: true,
    logo: `https://assets.omegafox.me/img/countries_crests/${match.homeTeam.abbreviationEn.toLowerCase()}_small.png`,
    matchId: match.id,
    name: isMobile ? match.homeTeam.abbreviation : match.homeTeam.name,
    score: match.homeTeam.goals
  };

  const awayTeam: ITeamProps = {
    id: match.awayTeam.id,
    abbreviationEn: match.awayTeam.abbreviationEn,
    align: 'right',
    bet: match.loggedUserBets ? match.loggedUserBets.goalsAway : null,
    colors: match.awayTeam.colors,
    isEditable: true,
    logo: `https://assets.omegafox.me/img/countries_crests/${match.awayTeam.abbreviationEn.toLowerCase()}_small.png`,
    matchId: match.id,
    name: isMobile ? match.awayTeam.abbreviation : match.awayTeam.name,
    score: match.awayTeam.goals
  };

  return (
    <>
      {shownDate && (
        <p className={styles.date}>
          {WEEKDAY[shownDate.getDay()]}, {shownDate.toLocaleDateString()}
        </p>
      )}
      <div className={styles.match}>
        <MatchOmegafox
          betValue={points}
          id={match.id}
          isEditable={isEditable}
          isError={isError}
          isHideClock={isMobile}
          isLoading={isLoading}
          clock={{ time: 0, status: match.status }}
          timestamp={parseInt(
            (new Date(match.timestamp).getTime() / 1000).toFixed(0)
          )}
          teams={[homeTeam, awayTeam]}
          onChange={handleScoreChange}
          onTeamClick={handleTeamClick}
        />
      </div>
    </>
  );
};
