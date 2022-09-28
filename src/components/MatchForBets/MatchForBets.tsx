import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Match as MatchOmegafox,
  ITeamProps,
  IBetId
} from '@omegafox/components';
import { IBetObject } from './types';

// Store
import { RootState } from 'store';
import { useOnUpdateBetMutation } from 'store/bet/actions';
import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';

import styles from './MatchForBets.module.scss';
import { WEEKDAY } from 'constants/weekdays';
import { getBetPoints } from 'services/betCalculator';

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

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  let points = null;
  if (loggedUser && match.loggedUserBets) {
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

  const homeTeam: ITeamProps = {
    id: match.homeTeam.id,
    align: 'left',
    bet: match.loggedUserBets ? match.loggedUserBets.goalsHome : null,
    colors: match.homeTeam.colors,
    isEditable: true,
    logo: `https://assets.omegafox.me/img/countries_crests/${match.homeTeam.abbreviationEn.toLowerCase()}.png`,
    matchId: match.id,
    name: match.homeTeam.name,
    nameShort: match.homeTeam.abbreviation,
    score: match.homeTeam.goals
  };

  const awayTeam: ITeamProps = {
    id: match.awayTeam.id,
    align: 'right',
    bet: match.loggedUserBets ? match.loggedUserBets.goalsAway : null,
    colors: match.awayTeam.colors,
    isEditable: true,
    logo: `https://assets.omegafox.me/img/countries_crests/${match.awayTeam.abbreviationEn.toLowerCase()}.png`,
    matchId: match.id,
    name: match.awayTeam.name,
    nameShort: match.awayTeam.abbreviation,
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
          isLoading={isLoading}
          clock={{ time: 0, status: match.status }}
          timestamp={parseInt(
            (new Date(match.timestamp).getTime() / 1000).toFixed(0)
          )}
          teams={[homeTeam, awayTeam]}
          onChange={handleScoreChange}
        />
      </div>
    </>
  );
};
