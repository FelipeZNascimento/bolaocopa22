import React from 'react';
import { isMobile } from 'react-device-detect';

import { Loading, TeamButton, TBorderPosition } from '@omegafox/components';
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

  let borderPosition: TBorderPosition;

  return (
    <>
      {isLoading && <Loading image={spinner} />}
      {options &&
        options.map((team) => {
          if (team.id % 4 === 1) {
            borderPosition = 'bottomLeft';
          } else if (team.id % 4 === 2) {
            borderPosition = 'bottomRight';
          } else if (team.id % 4 === 3) {
            borderPosition = 'topRight';
          } else {
            borderPosition = 'topLeft';
          }
          return (
            <div className={teamClass} key={team.id}>
              <TeamButton
                borderPosition={borderPosition}
                colors={team.colors}
                isSelected={team.id === selectedTeam?.id}
                logo={`https://assets.omegafox.me/img/countries_crests/${team.abbreviationEn.toLowerCase()}.png`}
                name={isMobile ? team.abbreviation : team.name}
                onClick={() => onClick(team)}
              />
            </div>
          );
        })}
    </>
  );
};
