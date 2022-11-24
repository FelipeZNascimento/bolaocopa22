import React from 'react';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import { TeamButton } from '@omegafox/components';

// Store
import { RootState } from 'store';

// Types
import { TExtraBet } from 'store/bet/types';
import { ITeam } from 'store/team/types';
import { IExtrasClosed } from './types';
import { IPlayer } from 'store/player/types';
import { TUser } from 'store/user/types';

// Constants
import { EXTRA_TYPES } from 'constants/extraTypes';
import ROUTES from 'constants/routes';

// Styles
import classNames from 'classnames';
import styles from './Extras.module.scss';

// Helpers
import { stringNormalizer } from 'services/helpers';
import _ from 'lodash';

export const ExtrasClosed = ({ selectedExtra }: IExtrasClosed) => {
  const navigate = useNavigate();
  const allExtraBets = useSelector(
    (state: RootState) => state.bet.extraBets
  ) as unknown as TExtraBet[];

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  if (!allExtraBets) {
    return null;
  }

  const allChampions = allExtraBets
    .filter((extraBet) => extraBet.idExtraType === EXTRA_TYPES.CHAMPION)
    .sort((a, b) =>
      (a.team as ITeam).name.localeCompare((b.team as ITeam).name)
    );

  const allOfenses = allExtraBets
    .filter((extraBet) => extraBet.idExtraType === EXTRA_TYPES.OFFENSE)
    .sort((a, b) =>
      (a.team as ITeam).name.localeCompare((b.team as ITeam).name)
    );

  const allDefenses = allExtraBets
    .filter((extraBet) => extraBet.idExtraType === EXTRA_TYPES.DEFENSE)
    .sort((a, b) =>
      (a.team as ITeam).name.localeCompare((b.team as ITeam).name)
    );

  const allStrikers = allExtraBets
    .filter((extraBet) => extraBet.idExtraType === EXTRA_TYPES.STRIKER)
    .sort((a, b) =>
      (a.team as ITeam).name.localeCompare((b.team as ITeam).name)
    );

  const teamClass = classNames(styles.teamWithExtras, {
    [styles.teamWithExtrasMobile]: isMobile
  });

  const handleTeamClick = (team: ITeam | null) => {
    if (team !== null && teams && teams.find((item) => item.id === team.id)) {
      navigate({
        pathname: `${ROUTES.TEAMS.url}/${stringNormalizer(team.name)}`
      });
    }
  };

  const renderTeam = (extraBet: TExtraBet, users: TUser[]) => {
    if (extraBet.team === null) {
      return;
    }

    const hasLoggedUserBet =
      loggedUser && users.some((user) => user.id === loggedUser.id);

    let teamButtonName = isMobile
      ? extraBet.team.abbreviation
      : extraBet.team.name;
    if (
      extraBet.idExtraType === EXTRA_TYPES.STRIKER &&
      extraBet.player &&
      extraBet.player.id
    ) {
      teamButtonName = extraBet.player.name;
    }

    return (
      <div className={teamClass} key={extraBet.team.id}>
        <div onClick={() => handleTeamClick(extraBet.team)}>
          <TeamButton
            isHoverable
            isSelected={hasLoggedUserBet}
            colors={extraBet.team.colors}
            logo={`https://assets.omegafox.me/img/countries_crests/${extraBet.team.abbreviationEn.toLowerCase()}.png`}
            name={teamButtonName}
          />
        </div>
        <div className={styles.betsContainer}>
          {users.map((user) => {
            const userBetClass = classNames({
              [styles.loggedUserBet]: loggedUser && loggedUser.id === user.id
            });

            return (
              <p className={userBetClass} key={user.id}>
                {user.nickname}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  const renderExtraBetsStriker = (extraBets: TExtraBet[]) => {
    const groupedBets = Object.values(_.groupBy(extraBets, extraBet => extraBet.player?.id)).sort((a, b) => b.length - a.length);
    return groupedBets.map((groupedBet) => {
      const usersPerPlayer = groupedBet.map((bet) => bet.user).sort((a, b) => a.nickname.localeCompare((b.nickname)));
      return renderTeam(groupedBet[0], usersPerPlayer);
    });
  };

  const renderExtraBets = (extraBets: TExtraBet[]) => {
    const groupedBets = Object.values(_.groupBy(extraBets, extraBet => extraBet.team?.id)).sort((a, b) => b.length - a.length);
    return groupedBets.map((groupedBet) => {
      const usersPerTeam = groupedBet.map((bet) => bet.user).sort((a, b) => a.nickname.localeCompare((b.nickname)));
      return renderTeam(groupedBet[0], usersPerTeam);
    });
  };

  return (
    <>
      {selectedExtra === EXTRA_TYPES.CHAMPION && renderExtraBets(allChampions)}
      {selectedExtra === EXTRA_TYPES.OFFENSE && renderExtraBets(allOfenses)}
      {selectedExtra === EXTRA_TYPES.DEFENSE && renderExtraBets(allDefenses)}
      {selectedExtra === EXTRA_TYPES.STRIKER &&
        renderExtraBetsStriker(allStrikers)}
    </>
  );
};
