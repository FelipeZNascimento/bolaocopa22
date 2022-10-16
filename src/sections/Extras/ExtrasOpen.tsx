import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Components
import {
  Autocomplete,
  Loading,
  TDropdownItem,
  TitleContainer
} from '@omegafox/components';
import { ExtrasTeams } from './ExtrasTeams';

// Store
import { useOnListAllPlayersQuery } from 'store/player/actions';
import { playersLoading, setPlayers } from 'store/player/reducer';

// Services
import { QueryHandler } from 'services/queryHandler';

// Types
import { IExtrasOpen } from './types';

// Styles
import styles from './Extras.module.scss';
import spinner from 'img/spinner.png';

// Constants
import { EXTRA_TYPES } from 'constants/extraTypes';

export const ExtrasOpen = ({
  champion,
  defense,
  offense,
  selectedExtra,
  teamsLoading,
  teams,
  onStrikerSelect,
  onTeamClick
}: IExtrasOpen) => {
  const [dropdownList, setDropdownList] = useState<TDropdownItem[]>([]);

  // Queries and Mutations
  const listAllPlayersResult = useOnListAllPlayersQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(playersLoading(listAllPlayersResult.isLoading));
    if (!listAllPlayersResult.isLoading && listAllPlayersResult.data) {
      const result = QueryHandler(listAllPlayersResult.data);
      if (result && result.players) {
        dispatch(setPlayers(result.players));
        setDropdownList(
          result.players.map((player) => ({
            id: player.id,
            name: player.name,
            details: {
              nameShort: player.team.abbreviation,
              colors: player.team.colors,
              id: player.team.id,
              name: player.team.name
            }
          }))
        );
      }
    }
  }, [listAllPlayersResult.isLoading, listAllPlayersResult.data]);

  return (
    <>
      {selectedExtra !== null && teamsLoading && <Loading image={spinner} />}
      {teams && selectedExtra === EXTRA_TYPES.CHAMPION && (
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
      {teams && selectedExtra === EXTRA_TYPES.OFFENSE && (
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
      {teams && selectedExtra === EXTRA_TYPES.DEFENSE && (
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
      {teams && selectedExtra === EXTRA_TYPES.STRIKER && (
        <>
          {listAllPlayersResult.isFetching && <Loading image={spinner} />}
          {!listAllPlayersResult.isFetching && (
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
      )}
    </>
  );
};
