import React from 'react';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

// Components
import { TeamButton } from '@omegafox/components';

// Store
import { RootState } from 'store';

// Types
import { TExtraBet } from 'store/bet/types';
import { ITeam } from 'store/team/types';
import { IExtrasClosed } from './types';

// Constants
import { EXTRA_TYPES } from 'constants/extraTypes';

// Styles
import styles from './Extras.module.scss';
import { TUser } from 'store/user/types';

export const ExtrasClosed = ({ selectedExtra }: IExtrasClosed) => {
  const allExtraBets = useSelector(
    (state: RootState) => state.bet.extraBets
  ) as unknown as TExtraBet[];

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

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

  const renderTeam = (extraBet: TExtraBet, users: TUser[]) => {
    if (extraBet.team === null) {
      return;
    }

    const hasLoggedUserBet =
      loggedUser && users.some((user) => user.id === loggedUser.id);

    return (
      <div className={teamClass} key={extraBet.team.id}>
        <div>
          <TeamButton
            isHoverable={false}
            isSelected={hasLoggedUserBet}
            colors={extraBet.team.colors}
            logo={`https://assets.omegafox.me/img/countries_crests/${extraBet.team.abbreviationEn.toLowerCase()}.png`}
            name={isMobile ? extraBet.team.abbreviation : extraBet.team.name}
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

  const renderExtraBets = (extraBets: TExtraBet[]) => {
    let currentTeam: ITeam | null = null;
    let usersPerTeam: TUser[] = [];

    return extraBets.map((extraBet, index, array) => {
      if (extraBet.team === null) {
        return;
      }

      if (currentTeam === null) {
        currentTeam = extraBet.team;
      }

      if (extraBet.team.id === currentTeam.id) {
        usersPerTeam.push(extraBet.user);

        if (
          index + 1 === array.length ||
          (array[index + 1].team as ITeam).id !== currentTeam.id
        ) {
          return renderTeam(extraBet, usersPerTeam);
        }
      } else {
        currentTeam = extraBet.team;
        usersPerTeam = [extraBet.user];

        if (
          index + 1 === array.length ||
          (array[index + 1].team as ITeam).id !== currentTeam.id
        ) {
          return renderTeam(extraBet, usersPerTeam);
        }
      }
    });
  };

  return (
    <>
      {selectedExtra === EXTRA_TYPES.CHAMPION && renderExtraBets(allChampions)}
      {selectedExtra === EXTRA_TYPES.OFFENSE && renderExtraBets(allOfenses)}
      {selectedExtra === EXTRA_TYPES.DEFENSE && renderExtraBets(allDefenses)}
      {selectedExtra === EXTRA_TYPES.STRIKER && renderExtraBets(allDefenses)}
    </>
  );
};
