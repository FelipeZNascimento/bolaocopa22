import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';

// Components
import {
  Card,
  Loading,
  TeamButton,
  TitleContainer,
  TDropdownItem
} from '@omegafox/components';
import { ExtrasClosed } from './ExtrasClosed';

import { QueryHandler } from 'services/queryHandler';
import { ExtrasOpen } from './ExtrasOpen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Store
import { RootState } from 'store';
import {
  useOnListAllExtrasMutation as listAllBetsMutation,
  useOnUpdateExtraBetMutation as updateExtraBetMutation
} from 'store/bet/actions';
import { extraBetsLoading, extraBetsSet } from 'store/bet/reducer';

// Types
import { ITeam } from 'store/team/types';
import { TUser } from 'store/user/types';
import { TExtraBets } from './types';
import { TExtraBet } from 'store/bet/types';

// Constants
import { EXTRA_TYPES } from 'constants/extraTypes';
import { dropdownList } from 'constants/mocks';

// Styles
import styles from './Extras.module.scss';
import spinner from 'img/spinner.png';

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

const emptyExtraBets: TExtraBets = {
  champion: null,
  offense: null,
  defense: null,
  striker: null
};

export const Extras = () => {
  //useStates
  const [selectedExtra, setSelectedExtra] = useState<number | null>(null);
  const [hasSeasonStarted, setHasSeasonStarted] = useState<boolean | null>(
    null
  );
  const [extraBets, setExtraBets] = useState(emptyExtraBets);

  // Queries and Mutations
  const [updateExtraTrigger, updateExtraResult] = updateExtraBetMutation();
  const [listAllBetsTrigger, listAllBetsResult] = listAllBetsMutation();
  const dispatch = useDispatch();

  const seasonStart = useSelector(
    (state: RootState) => state.match.seasonStart
  ) as unknown as number;

  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  const teamsLoading = useSelector(
    (state: RootState) => state.team.teamsLoading
  ) as unknown as boolean;

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const loggedUserExtraBets = useSelector(
    (state: RootState) => state.bet.loggedUserExtraBets
  ) as unknown as TExtraBet[];

  let intervalId: NodeJS.Timer;
  useEffect(() => {
    if (!seasonStart) {
      return;
    }

    intervalId = setInterval(function () {
      const timestamp = parseInt((new Date().getTime() / 1000).toFixed(0));
      setHasSeasonStarted(timestamp > seasonStart);
    }, 1000); // 60 * 1000 milsec

    return () => clearInterval(intervalId);
  }, [seasonStart]);

  useEffect(() => {
    if (hasSeasonStarted) {
      clearInterval(intervalId);
    }
  }, [hasSeasonStarted]);

  useEffect(() => {
    listAllBetsTrigger();
  }, []);

  useEffect(() => {
    if (loggedUser) {
      listAllBetsTrigger();
    }
  }, [loggedUser]);

  useEffect(() => {
    dispatch(extraBetsLoading(listAllBetsResult.isLoading));

    if (
      !listAllBetsResult.error &&
      !listAllBetsResult.isLoading &&
      listAllBetsResult.data
    ) {
      const result = QueryHandler(listAllBetsResult.data);
      if (result) {
        dispatch(extraBetsSet(result));
      }
    }
  }, [listAllBetsResult.data, listAllBetsResult.isLoading]);

  useEffect(() => {
    const updatedExtraBets = cloneDeep(extraBets);
    if (loggedUserExtraBets === null) {
      setExtraBets(emptyExtraBets);
    } else if (loggedUserExtraBets.length > 0) {
      loggedUserExtraBets.forEach((bet) => {
        if (bet.idExtraType === EXTRA_TYPES.CHAMPION) {
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

  const handleStrikerSelect = (player: TDropdownItem) => {
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
          />
        </div>
      );
    }
  };

  const renderStatus = (extraType: number) => {
    if (
      (!listAllBetsResult.isUninitialized && listAllBetsResult.isLoading) ||
      hasSeasonStarted === null
    ) {
      return renderLoading();
    }

    if (hasSeasonStarted) {
      switch (extraType) {
        case EXTRA_TYPES.CHAMPION:
          return renderTeam(
            loggedUserExtraBets.find(
              (extraBet) => extraBet.idExtraType === EXTRA_TYPES.CHAMPION
            )?.team || null
          );
        case EXTRA_TYPES.OFFENSE:
          return renderTeam(
            loggedUserExtraBets.find(
              (extraBet) => extraBet.idExtraType === EXTRA_TYPES.OFFENSE
            )?.team || null
          );
        case EXTRA_TYPES.DEFENSE:
          return renderTeam(
            loggedUserExtraBets.find(
              (extraBet) => extraBet.idExtraType === EXTRA_TYPES.DEFENSE
            )?.team || null
          );
        case EXTRA_TYPES.STRIKER:
          return renderPlayer(null);
        default:
          return null;
      }
    } else {
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
    }
  };

  return (
    <main className={styles.container}>
      {!loggedUser && (
        <div className={styles.titleContainer}>
          <TitleContainer text="Você precisa estar logado para ter acesso a essa seção." />
        </div>
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
            {!hasSeasonStarted && (
              <ExtrasOpen
                champion={extraBets.champion}
                defense={extraBets.defense}
                dropdownList={dropdownList}
                offense={extraBets.offense}
                selectedExtra={selectedExtra}
                teamsLoading={teamsLoading}
                teams={teams}
                onStrikerSelect={handleStrikerSelect}
                onTeamClick={handleTeamClick}
              />
            )}
            {hasSeasonStarted && <ExtrasClosed selectedExtra={selectedExtra} />}
          </div>
        </>
      )}
    </main>
  );
};
