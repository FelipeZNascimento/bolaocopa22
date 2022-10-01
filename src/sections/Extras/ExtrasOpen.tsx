import React from 'react';

// Components
import { Autocomplete, Loading, TitleContainer } from '@omegafox/components';
import { ExtrasTeams } from './ExtrasTeams';

// Types
import { IExtrasOpen } from './types';

// Styles
import styles from './Extras.module.scss';
import spinner from 'img/spinner.png';

export const ExtrasOpen = ({
  champion,
  dropdownList,
  defense,
  offense,
  selectedExtra,
  teamsLoading,
  teams,
  onStrikerSelect,
  onTeamClick
}: IExtrasOpen) => {
  return (
    <>
      {selectedExtra !== null && teamsLoading && <Loading image={spinner} />}
      {teams && selectedExtra === 0 && (
        <>
          <p className={styles.titleContainer}>
            <TitleContainer text="Campeão" />
          </p>
          <ExtrasTeams
            options={teams}
            isLoading={teamsLoading}
            selectedTeam={champion}
            onClick={onTeamClick}
          />
        </>
      )}
      {teams && selectedExtra === 1 && (
        <>
          <p className={styles.titleContainer}>
            <TitleContainer text="Melhor Ataque" />
          </p>
          <ExtrasTeams
            options={teams}
            isLoading={teamsLoading}
            selectedTeam={offense}
            onClick={onTeamClick}
          />
        </>
      )}
      {teams && selectedExtra === 2 && (
        <>
          <p className={styles.titleContainer}>
            <TitleContainer text="Melhor Defesa" />
          </p>
          <ExtrasTeams
            options={teams}
            isLoading={teamsLoading}
            selectedTeam={defense}
            onClick={onTeamClick}
          />
        </>
      )}
      {teams && selectedExtra === 3 && (
        <>
          <p className={styles.titleContainer}>
            <TitleContainer text="Artilheiro" />
          </p>
          <div>
            <Autocomplete
              dropdownList={dropdownList}
              onSelect={onStrikerSelect}
            />
          </div>
        </>
      )}
    </>
  );
};
