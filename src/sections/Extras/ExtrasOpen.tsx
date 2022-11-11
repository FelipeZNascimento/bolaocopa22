import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Components
import {
  Autocomplete,
  Loading,
  TDropdownItem,
  TextContainer,
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
import { PLAYER_POSITIONS } from 'constants/playerPositions';

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
        const playersFiltered = result.players.filter((player) => player.position.id !== PLAYER_POSITIONS.UNDEFINED && player.position.id !== PLAYER_POSITIONS.COACH);
        dispatch(setPlayers(playersFiltered));
        setDropdownList(
          playersFiltered.map((player) => ({
            id: player.id,
            name: player.name,
            details: {
              nameShort: player.team.abbreviationEn,
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
          {!listAllPlayersResult.isFetching && dropdownList.length <= 1 && (
            <TextContainer borderPosition="bottomLeft">
              <>
                <p className='align-center'>
                  A Extra de Artilheiros será liberada assim que <b>todas</b> as
                  seleções tiverem feito suas convocações finais para a Copa do
                  Mundo.
                </p>
                <p className='align-center'>Espera-se que isso aconteça por volta do dia 07/11.</p>
              </>
            </TextContainer>
          )}
          {!listAllPlayersResult.isFetching && dropdownList.length > 1 && (
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
