import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';

// Components
import {
  Autocomplete,
  Card,
  Loading,
  TeamButton,
  TitleContainer,
  TDropdownItem
} from '@omegafox/components';

import { QueryHandler } from 'services/queryHandler';
import { ExtrasTeams } from './ExtrasTeams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Store
import { RootState } from 'store';
import {
  useOnListAllExtrasQuery as listAllBetsQuery,
  useOnUpdateExtraBetMutation as updateExtraBetMutation
} from 'store/bet/actions';
import { extraBetsLoading, extraBetsSet } from 'store/bet/reducer';

// Types
import { ITeam } from 'store/team/types';
import { TUser } from 'store/user/types';

// Styles
import styles from './Extras.module.scss';
import spinner from 'img/spinner.png';
import { TExtraBet } from 'store/bet/types';
import { dropdownList } from 'constants/mocks';

enum EXTRA_TYPES {
  CHAMPION,
  OFFENSE,
  DEFENSE,
  STRIKER
}

const extrasInfo = [
  { id: EXTRA_TYPES.CHAMPION, title: 'Campeão', status: null },
  { id: EXTRA_TYPES.STRIKER, title: 'Artilheiro', status: null },
  {
    id: EXTRA_TYPES.OFFENSE,
    title: 'Melhor Ataque',
    subtitle: 'Apenas primeira fase',
    status: null
  },
  {
    id: EXTRA_TYPES.DEFENSE,
    title: 'Melhor Defesa',
    subtitle: 'Apenas primeira fase',
    status: null
  }
];

type TExtraBets = {
  champion: ITeam | null;
  offense: ITeam | null;
  defense: ITeam | null;
  striker: TDropdownItem | null;
};
const emptyExtraBets: TExtraBets = {
  champion: null,
  offense: null,
  defense: null,
  striker: null
};

export const Extras = () => {
  const [selectedExtra, setSelectedExtra] = useState<number | null>(null);
  const [updateExtraTrigger, updateExtraResult] = updateExtraBetMutation();

  const [extraBets, setExtraBets] = useState(emptyExtraBets);
  const { data, error, isLoading, isUninitialized } = listAllBetsQuery();
  const dispatch = useDispatch();

  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  const teamsLoading = useSelector(
    (state: RootState) => state.team.teamsLoading
  ) as unknown as boolean;

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  // const allExtraBets = useSelector(
  //   (state: RootState) => state.bet.extraBets
  // ) as unknown as TExtraBet[];

  const loggedUserExtraBets = useSelector(
    (state: RootState) => state.bet.loggedUserExtraBets
  ) as unknown as TExtraBet[];

  useEffect(() => {
    dispatch(extraBetsLoading(isLoading));

    if (!error && !isLoading && data) {
      const result = QueryHandler(data);
      if (result) {
        dispatch(extraBetsSet(result));
      }
    }
  }, [data, isLoading]);

  useEffect(() => {
    const updatedExtraBets = cloneDeep(extraBets);
    if (loggedUserExtraBets === null) {
      setExtraBets(emptyExtraBets);
    } else if (loggedUserExtraBets.length > 0) {
      loggedUserExtraBets.forEach((bet) => {
        if (bet.idExtraType === 0) {
          updatedExtraBets.champion = bet.team;
        } else if (bet.idExtraType === EXTRA_TYPES.CHAMPION) {
          updatedExtraBets.champion = bet.team;
        } else if (bet.idExtraType === EXTRA_TYPES.OFFENSE) {
          updatedExtraBets.offense = bet.team;
        } else if (bet.idExtraType === EXTRA_TYPES.DEFENSE) {
          updatedExtraBets.defense = bet.team;
        } else if (bet.idExtraType === EXTRA_TYPES.STRIKER) {
          updatedExtraBets.striker = null;
        }
      });
      setExtraBets(updatedExtraBets);
    }
  }, [loggedUserExtraBets]);

  const onStrikerSelect = (player: TDropdownItem) => {
    const updatedExtraBets = { ...extraBets, striker: player };
    updateExtraTrigger({
      betId: null,
      extraType: EXTRA_TYPES.CHAMPION,
      userId: loggedUser.id,
      teamId: null,
      playerId: player.id
    });

    setExtraBets(updatedExtraBets);
  };

  const handleTeamClick = (team: ITeam) => {
    switch (selectedExtra) {
      case EXTRA_TYPES.CHAMPION: {
        const updatedExtraBets = { ...extraBets, champion: team };
        updateExtraTrigger({
          betId: null,
          extraType: EXTRA_TYPES.CHAMPION,
          userId: loggedUser.id,
          teamId: team.id,
          playerId: null
        });

        setExtraBets(updatedExtraBets);
        break;
      }
      case EXTRA_TYPES.OFFENSE: {
        const updatedExtraBets = { ...extraBets, offense: team };
        updateExtraTrigger({
          betId: null,
          extraType: EXTRA_TYPES.OFFENSE,
          userId: loggedUser.id,
          teamId: team.id,
          playerId: null
        });

        setExtraBets(updatedExtraBets);
        break;
      }
      case EXTRA_TYPES.DEFENSE: {
        const updatedExtraBets = { ...extraBets, defense: team };
        updateExtraTrigger({
          betId: null,
          extraType: EXTRA_TYPES.DEFENSE,
          userId: loggedUser.id,
          teamId: team.id,
          playerId: null
        });

        setExtraBets(updatedExtraBets);
        break;
      }
    }
  };

  const renderLoading = () => {
    return <Loading image={spinner} size="small" isOverlay />;
  };

  const renderPlayer = (player: TDropdownItem | null) => {
    if (!player) {
      return <FontAwesomeIcon icon={faQuestionCircle} size="lg" />;
    } else if (player && updateExtraResult.isLoading) {
      return renderLoading();
    } else {
      return (
        <div className={styles.status}>
          <TeamButton
            fontSize={'small'}
            isHoverable={false}
            isBig={false}
            colors={player.details.colors}
            logo={`https://assets.omegafox.me/img/countries_crests/${player.details.nameShort.toLowerCase()}.png`}
            name={player.name}
            nameShort={player.name}
          />
        </div>
      );
    }
  };

  const renderTeam = (team: ITeam | null) => {
    if (!team) {
      return <FontAwesomeIcon icon={faQuestionCircle} size="lg" />;
    } else if (team && updateExtraResult.isLoading) {
      return renderLoading();
    } else {
      return (
        <div className={styles.status}>
          <TeamButton
            isHoverable={false}
            isBig={false}
            colors={team.colors}
            logo={`https://assets.omegafox.me/img/countries_crests/${team.abbreviationEn.toLowerCase()}.png`}
            name={team.abbreviation}
            nameShort={team.abbreviation}
          />
        </div>
      );
    }
  };

  const renderStatus = (extraType: number) => {
    if (!isUninitialized && isLoading) {
      return renderLoading();
    }

    switch (extraType) {
      case EXTRA_TYPES.CHAMPION:
        return renderTeam(extraBets.champion);
      case EXTRA_TYPES.OFFENSE:
        return renderTeam(extraBets.offense);
      case EXTRA_TYPES.DEFENSE:
        return renderTeam(extraBets.defense);
      case EXTRA_TYPES.STRIKER:
        return renderPlayer(extraBets.striker);
      default:
        return null;
    }
  };

  return (
    <main className={styles.container}>
      {!loggedUser && (
        <p className={styles.titleContainer}>
          <TitleContainer text="Você precisa estar logado para ter acesso a essa seção." />
        </p>
      )}
      {loggedUser && (
        <>
          <div className={styles.topSection}>
            <div className={styles.cardsContainer}>
              {extrasInfo.map((item) => {
                return (
                  <div className={styles.card} key={item.id}>
                    <Card
                      isForceMobile
                      isSelected={selectedExtra === item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      onClick={() => setSelectedExtra(item.id)}
                      renderingStatusFunction={() => renderStatus(item.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.teamsContainer}>
            {selectedExtra !== null && teamsLoading && (
              <Loading image={spinner} />
            )}
            {teams && selectedExtra === 0 && (
              <>
                <p className={styles.titleContainer}>
                  <TitleContainer text="Campeão" />
                </p>
                <ExtrasTeams
                  options={teams}
                  isLoading={teamsLoading}
                  selectedTeam={extraBets.champion}
                  onClick={handleTeamClick}
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
                  selectedTeam={extraBets.offense}
                  onClick={handleTeamClick}
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
                  selectedTeam={extraBets.defense}
                  onClick={handleTeamClick}
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
          </div>
        </>
      )}
    </main>
  );
};
