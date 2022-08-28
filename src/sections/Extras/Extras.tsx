import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';

// Components
import { Card, Loading, TeamButton } from '@omegafox/components';
import { QueryHandler } from 'services/queryHandler';
import { ExtrasTeams } from './ExtrasTeams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Store
import { RootState } from 'store';
import { useOnListAllTeamsQuery as listAllTeamsQuery } from 'store/team/actions';
import {
  useOnListAllExtrasQuery as listAllBetsQuery,
  useOnUpdateExtraBetMutation as updateExtraBetMutation
} from 'store/bet/actions';
import { teamsLoading, teamsSet } from 'store/team/reducer';
import { betsLoading, betsSet } from 'store/bet/reducer';

// Types
import { ITeam } from 'store/team/types';
import { TUser } from 'store/user/types';

// Styles
import styles from './Extras.module.scss';
import spinner from 'img/spinner.png';

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
  striker: null;
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

  const allBetsQueryResult = listAllBetsQuery();
  const allTeamsQueryResult = listAllTeamsQuery();
  const dispatch = useDispatch();

  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  const loggedUser: TUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  useEffect(() => {
    dispatch(teamsLoading(allTeamsQueryResult.isLoading));

    if (
      !allTeamsQueryResult.error &&
      !allTeamsQueryResult.isLoading &&
      allTeamsQueryResult.data
    ) {
      const result = QueryHandler(allTeamsQueryResult.data);
      if (result) {
        dispatch(teamsSet(result));
      }
    }
  }, [allTeamsQueryResult.data, allTeamsQueryResult.isLoading]);

  useEffect(() => {
    dispatch(betsLoading(allBetsQueryResult.isLoading));

    if (
      !allBetsQueryResult.error &&
      !allBetsQueryResult.isLoading &&
      allBetsQueryResult.data
    ) {
      const result = QueryHandler(allBetsQueryResult.data);
      if (result) {
        dispatch(betsSet(result));
        const updatedExtraBets = cloneDeep(extraBets);

        if (result.loggedUserExtraBets.length > 0) {
          result.loggedUserExtraBets.forEach((bet) => {
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
      }
    }
  }, [allBetsQueryResult.data, allBetsQueryResult.isLoading]);

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
    // return renderLoading();
    if (!allBetsQueryResult.isUninitialized && allBetsQueryResult.isLoading) {
      return renderLoading();
    }

    switch (extraType) {
      case EXTRA_TYPES.CHAMPION:
        return renderTeam(extraBets.champion);
      case EXTRA_TYPES.OFFENSE:
        return renderTeam(extraBets.offense);
      case EXTRA_TYPES.DEFENSE:
        return renderTeam(extraBets.defense);
      default:
        return null;
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.topSection}>
        <p className={styles.title}>
          Escolha um campeão, os melhores ataque e defesa (considerando apenas a
          primeira fase) e um artilheiro.
        </p>

        <div className={styles.cardsContainer}>
          {extrasInfo.map((item) => {
            return (
              <div className={styles.card} key={item.id}>
                <Card
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
        {selectedExtra !== null && allTeamsQueryResult.isLoading && (
          <Loading image={spinner} />
        )}
        {teams && selectedExtra === 0 && (
          <>
            <p className={styles.titleContainer}>
              <span className={styles.title}>Campeão</span>
            </p>
            <ExtrasTeams
              options={teams}
              isLoading={allTeamsQueryResult.isLoading}
              selectedTeam={extraBets.champion}
              onClick={handleTeamClick}
            />
          </>
        )}
        {teams && selectedExtra === 1 && (
          <>
            <p className={styles.titleContainer}>
              <span className={styles.title}>Melhor Ataque</span>
            </p>
            <ExtrasTeams
              options={teams}
              isLoading={allTeamsQueryResult.isLoading}
              selectedTeam={extraBets.offense}
              onClick={handleTeamClick}
            />
          </>
        )}
        {teams && selectedExtra === 2 && (
          <>
            <p className={styles.titleContainer}>
              <span className={styles.title}>Melhor Defesa</span>
            </p>
            <ExtrasTeams
              options={teams}
              isLoading={allTeamsQueryResult.isLoading}
              selectedTeam={extraBets.defense}
              onClick={handleTeamClick}
            />
          </>
        )}
        {teams && selectedExtra === 3 && (
          <>
            <p className={styles.titleContainer}>
              <span className={styles.title}>Artilheiro</span>
            </p>
          </>
        )}
      </div>
    </main>
  );
};
