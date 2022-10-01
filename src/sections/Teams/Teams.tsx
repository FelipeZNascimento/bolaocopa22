import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { Loading, TBorderPosition, TeamButton } from '@omegafox/components';
import { SingleTeam } from './SingleTeam';

// Store
import { RootState } from 'store';

// Types
import { ITeam } from 'store/team/types';

// Styles and images
import classNames from 'classnames';
import styles from './Teams.module.scss';
import spinner from 'img/spinner.png';
import ROUTES from 'constants/routes';

export const Teams = () => {
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);

  const isLoading = useSelector(
    (state: RootState) => state.team.teamsLoading
  ) as unknown as ITeam[];

  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (teams && params.teamId) {
      const teamId = parseInt(params.teamId);
      const team = teams.find((item) => item.id === teamId);

      if (team) {
        setSelectedTeam(team);
      }
    } else {
      setSelectedTeam(null);
    }
  }, [params, teams]);

  const handleTeamClick = (team: ITeam) => {
    navigate({ pathname: `${ROUTES.TEAMS.url}/${team.id}` });
  };

  const renderAllTeams = () => {
    if (!teams) {
      return;
    }
    const teamClass = classNames(styles.team, {
      [styles.teamMobile]: isMobile
    });

    let borderPosition: TBorderPosition;

    return teams.map((team) => {
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
        <div
          className={teamClass}
          key={team.id}
          onClick={() => handleTeamClick(team)}
        >
          <TeamButton
            isHoverable
            isBig
            borderPosition={borderPosition}
            colors={team.colors}
            logo={`https://assets.omegafox.me/img/countries_crests/${team.abbreviationEn.toLowerCase()}.png`}
            name={isMobile ? team.abbreviation : team.name}
          />
        </div>
      );
    });
  };

  return (
    <>
      {(isLoading || !teams) && <Loading image={spinner} />}
      {selectedTeam === null && (
        <div className={styles.teamsContainer}>{renderAllTeams()}</div>
      )}
      {selectedTeam && <SingleTeam singleTeam={selectedTeam} />}
    </>
  );
};
