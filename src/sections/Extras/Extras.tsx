import React, { useEffect } from 'react';
// import { isMobile } from 'react-device-detect';
// import classNames from 'classnames';

import { Loading, Team, Tooltip } from '@omegafox/components';
import spinner from 'img/spinner.png';
import { QueryHandler } from 'services/queryHandler';

// Store
import { useOnListAllQuery } from 'store/team/actions';
import { teamsLoading, teamsSet } from 'store/team/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';

import styles from './Extras.module.scss';
import { ITeam } from 'store/team/types';

export const Extras = () => {
  const { data, error, isLoading } = useOnListAllQuery();
  const dispatch = useDispatch();

  const teams = useSelector(
    (state: RootState) => state.teams.teams
  ) as unknown as ITeam[];

  useEffect(() => {
    dispatch(teamsLoading(isLoading));

    if (!error && !isLoading && data) {
      const result = QueryHandler(data);
      console.log(result);
      if (result) {
        dispatch(teamsSet(result));
      }
    }
  }, [data, isLoading]);

  return (
    <main className={styles.container}>
      <h1>Extras</h1>
      <div className={styles.teamsContainer}>
        {isLoading && <Loading image={spinner} />}
        {teams &&
          teams.map((team) => {
            return (
              <div className={styles.team} key={team.id}>
                <Tooltip position="bottom" text={team.name}>
                  <Team
                    id={team.id}
                    align="left"
                    colors={team.colors}
                    isEditable={false}
                    logo={`https://assets.omegafox.me/img/countries_crests/${team.abbreviationEn.toLowerCase()}.png`}
                    matchId={0}
                    name={team.abbreviation}
                    nameShort={team.abbreviation}
                    score={null}
                  />
                </Tooltip>
              </div>
            );
          })}
      </div>
    </main>
  );
};
