import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Match as MatchOmegafox,
  ITeamProps,
  IScoreId
} from '@omegafox/components';
import { IBetObject } from './types';

// Store
import { RootState } from 'store';
import { useOnUpdateBetMutation } from 'store/match/actions';
import { TMatch } from 'store/match/types';
import { TUser } from 'store/user/types';

import styles from './MatchForBets.module.scss';

interface IMatch {
  shownDate: Date | null;
  match: TMatch;
  onChange: (currentBet: IBetObject) => void;
}

export const MatchForBets = ({ match, shownDate, onChange }: IMatch) => {
  const [isError, setIsError] = useState<boolean>(false);
  //   const [currentBet, setCurrentBet] = useState<IBetObject | null>(null);

  const [updateBetTrigger, updateBetResult] = useOnUpdateBetMutation();

  const { isLoading } = updateBetResult;

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  useEffect(() => {
    // If something went wrong, show error and block match. As user to refresh the page.
    if (
      !updateBetResult.isLoading &&
      !updateBetResult.isUninitialized &&
      (!updateBetResult.isSuccess || !updateBetResult.data.isSuccess)
    ) {
      setIsError(true);
    }
  }, [updateBetResult]);

  const handleScoreChange = (newScore: IScoreId[]) => {
    if (!loggedUser) {
      setIsError(true);
      return;
    }

    const homeTeamScore = newScore.find(
      (item) => item.id === match.homeTeam.id
    )?.score;
    const awayTeamScore = newScore.find(
      (item) => item.id === match.awayTeam.id
    )?.score;

    const betObject = {
      betId: match.loggedUserBets ? match.loggedUserBets.id : null,
      matchId: match.id,
      userId: loggedUser.id,
      goalsHome: homeTeamScore === undefined ? null : homeTeamScore,
      goalsAway: awayTeamScore === undefined ? null : awayTeamScore
    };

    updateBetTrigger(betObject);
    onChange(betObject);
  };

  const homeTeam: ITeamProps = {
    id: match.homeTeam.id,
    align: 'left',
    colors: match.homeTeam.colors,
    isEditable: true,
    logo: 'https://teamcolorcodes.com/wp-content/uploads/2021/12/Brazil-National-Football-Team-Logo-211x300.png',
    matchId: match.id,
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
    matchId: match.id,
    name: match.awayTeam.name,
    nameShort: match.awayTeam.abbreviation,
    score: match.loggedUserBets ? match.loggedUserBets.goalsAway : null
  };

  return (
    <>
      {shownDate && <h2>{shownDate.toLocaleDateString()}</h2>}
      <div className={styles.match}>
        <MatchOmegafox
          id={match.id}
          isEditable={!!loggedUser}
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
