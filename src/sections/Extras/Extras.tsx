import React, { useEffect, useState } from 'react';

import { Card, Loading, TeamButton } from '@omegafox/components';
import spinner from 'img/spinner.png';
import { QueryHandler } from 'services/queryHandler';

// Store
import { useOnListAllQuery } from 'store/team/actions';
import { teamsLoading, teamsSet } from 'store/team/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';

import styles from './Extras.module.scss';
import { ITeam } from 'store/team/types';
import { ExtrasTeams } from './ExtrasTeams';

enum EXTRA_TYPES {
  CHAMPION,
  OFFENSE,
  DEFENSE,
  STRIKER
}

const extrasInfo = [
  { id: EXTRA_TYPES.CHAMPION, title: 'Campeão', status: null },
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
  },
  { id: EXTRA_TYPES.STRIKER, title: 'Artilheiro', status: null }
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
  const [extraBets, setExtraBets] = useState(emptyExtraBets);

  const { data, error, isLoading } = useOnListAllQuery();
  const dispatch = useDispatch();

  const teams = useSelector(
    (state: RootState) => state.teams.teams
  ) as unknown as ITeam[];

  useEffect(() => {
    dispatch(teamsLoading(isLoading));

    if (!error && !isLoading && data) {
      const result = QueryHandler(data);
      if (result) {
        dispatch(teamsSet(result));
      }
    }
  }, [data, isLoading]);

  const handleTeamClick = (team: ITeam) => {
    switch (selectedExtra) {
      case EXTRA_TYPES.CHAMPION:
        setExtraBets({ ...extraBets, champion: team });
        break;
      case EXTRA_TYPES.OFFENSE:
        setExtraBets({ ...extraBets, offense: team });
        break;
      case EXTRA_TYPES.DEFENSE:
        setExtraBets({ ...extraBets, defense: team });
        break;
    }
  };

  const renderTeam = (team: ITeam | null) => {
    if (!team) {
      return null;
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
      <h2>Escolha uma categoria</h2>
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
      <div className={styles.teamsContainer}>
        {isLoading && <Loading image={spinner} />}
        {teams && selectedExtra === 0 && (
          <ExtrasTeams
            options={teams}
            isLoading={isLoading}
            selectedTeam={extraBets.champion}
            onClick={handleTeamClick}
          />
        )}
        {teams && selectedExtra === 1 && (
          <ExtrasTeams
            options={teams}
            isLoading={isLoading}
            selectedTeam={extraBets.offense}
            onClick={handleTeamClick}
          />
        )}
        {teams && selectedExtra === 2 && (
          <ExtrasTeams
            options={teams}
            isLoading={isLoading}
            selectedTeam={extraBets.defense}
            onClick={handleTeamClick}
          />
        )}
      </div>
    </main>
  );
};
