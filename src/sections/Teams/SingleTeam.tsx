import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import { Button, TeamButton } from '@omegafox/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faClose
} from '@fortawesome/free-solid-svg-icons';

// Store
import { RootState } from 'store';

// Types and constants
import { ITeam } from 'store/team/types';
import ROUTES from 'constants/routes';

// Styles and images
import styles from './Teams.module.scss';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

interface ISingleTeam {
  singleTeam: ITeam;
}

export const SingleTeam = ({ singleTeam }: ISingleTeam) => {
  const [frameIds, setFrameIds] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (singleTeam) {
      if (singleTeam.group === 'A') {
        setFrameIds(['3954', '41087']);
      } else if (singleTeam.group === 'B') {
        setFrameIds(['3955', '41087']);
      } else if (singleTeam.group === 'C') {
        setFrameIds(['3956', '41087']);
      } else if (singleTeam.group === 'D') {
        setFrameIds(['3957', '41087']);
      } else if (singleTeam.group === 'E') {
        setFrameIds(['3958', '41087']);
      } else if (singleTeam.group === 'F') {
        setFrameIds(['3959', '41087']);
      } else if (singleTeam.group === 'G') {
        setFrameIds(['3960', '41087']);
      } else if (singleTeam.group === 'H') {
        setFrameIds(['3961', '41087']);
      }
    }
  }, [singleTeam]);

  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  const handleBackClick = () => {
    navigate({ pathname: ROUTES.TEAMS.url });
  };

  const handleTeamClick = (teamId: number) => {
    if (teams.find((team) => team.id === teamId)) {
      navigate({ pathname: `${ROUTES.TEAMS.url}/${teamId}` });
    }
  };

  let groupTeams: ITeam[] = [];
  if (teams) {
    groupTeams = teams.filter((team) => team.group === singleTeam.group);
  }

  const singleTeamHeaderClass = classNames(styles.singleTeamHeader, {
    [styles.singleTeamHeaderMobile]: isMobile
  });

  const contentContainerClass = classNames(styles.contentContainer, {
    [styles.contentContainerMobile]: isMobile
  });

  const contentClass = classNames(styles.content, {
    [styles.contentMobile]: isMobile
  });

  return (
    <div className={styles.singleTeamContainer}>
      <div className={singleTeamHeaderClass}>
        <div className={styles.button}>
          <Button
            icon={<FontAwesomeIcon icon={faClose} size="lg" />}
            isShadowed={false}
            size="small"
            variant="neutral"
            onClick={handleBackClick}
          />
        </div>
        <div className={styles.button}>
          <Button
            icon={<FontAwesomeIcon icon={faChevronLeft} size="lg" />}
            isShadowed={false}
            size="small"
            variant="neutral"
            onClick={() => handleTeamClick(singleTeam.id - 1)}
          />
        </div>
        <TeamButton
          isBig
          isHoverable={false}
          colors={singleTeam.colors}
          logo={`https://assets.omegafox.me/img/countries_crests/${singleTeam.abbreviationEn.toLowerCase()}.png`}
          name={singleTeam.name}
        />
        <div className={styles.button}>
          <Button
            icon={<FontAwesomeIcon icon={faChevronRight} size="lg" />}
            isShadowed={false}
            size="small"
            variant="neutral"
            onClick={() => handleTeamClick(singleTeam.id + 1)}
          />
        </div>
      </div>
      <div className={contentContainerClass}>
        <div className={contentClass}>
          <p>{singleTeam.name}</p>
          <img
            src={`https://assets.omegafox.me/img/countries_crests/${singleTeam.abbreviationEn.toLowerCase()}.png`}
          />
        </div>
        {!isMobile && (
          <div className={contentClass}>
            <p>Grupo {singleTeam.group}</p>
            {groupTeams.map((team) => (
              <div
                className={styles.teamGroup}
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
              >
                <TeamButton
                  isHoverable
                  borderPosition="bottomRight"
                  isBig={false}
                  colors={team.colors}
                  logo={`https://assets.omegafox.me/img/countries_crests/${team.abbreviationEn.toLowerCase()}.png`}
                  name={team.name}
                />
              </div>
            ))}
          </div>
        )}
        <div className={contentClass}>
          <p>
            {singleTeam.confederation.name} (
            {singleTeam.confederation.abbreviation})
          </p>
          <img
            src={`https://assets.omegafox.me/img/confederations_logos/${singleTeam.confederation.abbreviation.toLowerCase()}.png`}
          />
        </div>
      </div>
      {frameIds.length === 2 && (
        <div className={contentContainerClass}>
          <div className={contentClass}>
            <iframe
              id={`sofa-standings-embed-${frameIds[0]}-${frameIds[1]}`}
              width="100%"
              height="269"
              src={`https://www.sofascore.com/tournament/${frameIds[0]}/${frameIds[1]}/standings/tables/embed`}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};
