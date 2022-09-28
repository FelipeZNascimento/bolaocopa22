import React from 'react';
import { isMobile } from 'react-device-detect';

import { Loading, TeamButton } from '@omegafox/components';
import { ITeam } from 'store/team/types';
import spinner from 'img/spinner.png';

import styles from './Extras.module.scss';
import classNames from 'classnames';

interface IExtrasTeams {
  isLoading: boolean;
  selectedTeam: ITeam | null;
  options: ITeam[];
  onClick: (team: ITeam) => void;
}
export const ExtrasTeams = ({
  isLoading,
  selectedTeam,
  options,
  onClick
}: IExtrasTeams) => {
  const teamClass = classNames(styles.team, {
    [styles.teamMobile]: isMobile
  });

  return (
    <>
      {isLoading && <Loading image={spinner} />}
      {options &&
        options.map((team) => {
          return (
            <div className={teamClass} key={team.id}>
              <TeamButton
                colors={team.colors}
                isSelected={team.id === selectedTeam?.id}
                logo={`https://assets.omegafox.me/img/countries_crests/${team.abbreviationEn.toLowerCase()}.png`}
                name={team.name}
                nameShort={team.abbreviation}
                onClick={() => onClick(team)}
              />
            </div>
          );
        })}
    </>
  );
};
