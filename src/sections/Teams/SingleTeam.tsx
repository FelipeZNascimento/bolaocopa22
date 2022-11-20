import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import { Button, Loading, TeamButton, Tooltip } from '@omegafox/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAnglesLeft,
  faChevronLeft,
  faChevronRight,
  faTableList
} from '@fortawesome/free-solid-svg-icons';

// Store
import { RootState } from 'store';

// Services
import { stringNormalizer } from 'services/helpers';

// Types and constants
import { ITeam } from 'store/team/types';
import ROUTES from 'constants/routes';

// Styles and images
import styles from './Teams.module.scss';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';
import { useOnListTeamPlayersQuery } from 'store/team/actions';
import spinner from 'img/spinner.png';
import { QueryHandler } from 'services/queryHandler';
import { IPlayer } from 'store/player/types';
import { PLAYER_POSITIONS } from 'constants/playerPositions';

interface ISingleTeam {
  singleTeam: ITeam;
}

interface IClubCountry {
  id: number;
  abbreviation: string;
  abbreviationEn: string;
  isoCode: string;
  name: string;
  nameEn: string;
}
interface IPlayerClub {
  name: string;
  country: IClubCountry;
}

interface ITeamPlayers extends IPlayer {
  club?: IPlayerClub;
}

export const SingleTeam = ({ singleTeam }: ISingleTeam) => {
  const [frameId, setFrameId] = useState<string>('');
  const [teamPlayers, setTeamPlayers] = useState<ITeamPlayers[]>([]);

  const teamPlayersQueryResult = useOnListTeamPlayersQuery({ id: singleTeam.id });

  const navigate = useNavigate();

  (function (el) {
    window.addEventListener('message', (event) => {
      if (event.origin.startsWith('https://www.sofascore')) {
        if (el && el.id === event.data.id) {
          el.style.height = event.data.height + 'px';
        }
      }
    });
  })(document.getElementById(`sofa-standings-embed-${frameId}-41087`));

  useEffect(() => {

    if (!teamPlayersQueryResult.isFetching
      && !teamPlayersQueryResult.isLoading
      && teamPlayersQueryResult.data
    ) {
      const result = QueryHandler(teamPlayersQueryResult.data);
      if (result) {
        setTeamPlayers(result.players);
      }
    }
  }, [teamPlayersQueryResult.data]);

  useEffect(() => {
    if (singleTeam) {
      if (singleTeam.group === 'A') {
        setFrameId('3954');
      } else if (singleTeam.group === 'B') {
        setFrameId('3955');
      } else if (singleTeam.group === 'C') {
        setFrameId('3956');
      } else if (singleTeam.group === 'D') {
        setFrameId('3957');
      } else if (singleTeam.group === 'E') {
        setFrameId('3958');
      } else if (singleTeam.group === 'F') {
        setFrameId('3959');
      } else if (singleTeam.group === 'G') {
        setFrameId('3960');
      } else if (singleTeam.group === 'H') {
        setFrameId('3961');
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
    let selectedTeam;
    if (teamId <= 0) {
      selectedTeam = teams.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
    } else {
      selectedTeam = teams.find((team) => team.id === teamId);
      if (selectedTeam === undefined) {
        selectedTeam = teams.reduce((prev, current) =>
          prev.id < current.id ? prev : current
        );
      }
    }

    if (selectedTeam) {
      navigate({
        pathname: `${ROUTES.TEAMS.url}/${stringNormalizer(selectedTeam.name)}`
      });
    }
  };

  const renderPositionPlayers = (players: ITeamPlayers[]) => {
    if (players.length === 0) {
      return;
    }

    const positionDescription = players[0].position.description;
    return (
      <>
        <h2>{positionDescription}</h2>
        {players.map((player) => <p className={styles.playerName} key={player.id}>{player.name}</p>)}
      </>
    );
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
          <Tooltip text="Voltar à página anterior">
            <Button
              icon={<FontAwesomeIcon icon={faAnglesLeft} size="lg" />}
              isShadowed={false}
              size="small"
              variant="neutral"
              onClick={() => navigate(-1)}
            />
          </Tooltip>
        </div>

        <div className={styles.button}>
          <Tooltip text="Ver anterior">
            <Button
              icon={<FontAwesomeIcon icon={faChevronLeft} size="lg" />}
              isShadowed={false}
              size="small"
              variant="neutral"
              onClick={() => handleTeamClick(singleTeam.id - 1)}
            />
          </Tooltip>
        </div>
        <TeamButton
          isBig
          isHoverable={false}
          colors={singleTeam.colors}
          logo={`https://assets.omegafox.me/img/countries_crests/${singleTeam.abbreviationEn.toLowerCase()}.png`}
          name={singleTeam.name}
        />
        <div className={styles.button}>
          <Tooltip text="Ver próxima">
            <Button
              icon={<FontAwesomeIcon icon={faChevronRight} size="lg" />}
              isShadowed={false}
              size="small"
              variant="neutral"
              onClick={() => handleTeamClick(singleTeam.id + 1)}
            />
          </Tooltip>
        </div>
        <div className={styles.button}>
          <Tooltip text="Ver todas seleções">
            <Button
              icon={<FontAwesomeIcon icon={faTableList} size="lg" />}
              isShadowed={false}
              size="small"
              variant="neutral"
              onClick={handleBackClick}
            />
          </Tooltip>
        </div>
      </div>
      <div className={contentContainerClass}>
        <div className={contentClass}>
          <p className={styles.title}>{singleTeam.name}</p>
          <p>
            <img
              alt="Country flag"
              src={`https://flagcdn.com/h40/${singleTeam.isoCode.toLowerCase()}.png`}
            />
          </p>
          <img
            alt="National football federation crest"
            src={`https://assets.omegafox.me/img/countries_crests/${singleTeam.abbreviationEn.toLowerCase()}.png`}
          />
        </div>
        {!isMobile && (
          <div className={contentClass}>
            <p className={styles.title}>Grupo {singleTeam.group}</p>
            {groupTeams.map((team) => (
              <div
                className={styles.teamGroup}
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
              >
                <TeamButton
                  isHoverable
                  key={team.id}
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
          <p className={styles.title}>
            {singleTeam.confederation.name} (
            {singleTeam.confederation.abbreviation})
          </p>
          <img
            alt="Confederation crest"
            src={`https://assets.omegafox.me/img/confederations_logos/${singleTeam.confederation.abbreviation.toLowerCase()}.png`}
          />
        </div>
      </div>
      {frameId && (
        <div className={contentContainerClass}>
          <div className={contentClass}>
            <iframe
              id={`sofa-standings-embed-${frameId}-41087`}
              width="100%"
              height="330"
              src={`https://www.sofascore.com/tournament/${frameId}/41087/standings/tables/embed`}
              frameBorder="0"
              scrolling="no"
            ></iframe>
            <div>
              Standings provided by{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.sofascore.com/"
              >
                Sofascore
              </a>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className={contentContainerClass}>
          <div className={contentClass}>
            {teamPlayersQueryResult.isLoading && <Loading image={spinner} />}
            <p>{renderPositionPlayers(teamPlayers.filter((item) => item.position.id === PLAYER_POSITIONS.GOALKEEPER))}</p>
            <p>{renderPositionPlayers(teamPlayers.filter((item) => item.position.id === PLAYER_POSITIONS.CENTRE_BACK))}</p>
            <p>{renderPositionPlayers(teamPlayers.filter((item) => item.position.id === PLAYER_POSITIONS.FULL_BACK))}</p>
            <p>{renderPositionPlayers(teamPlayers.filter((item) => item.position.id === PLAYER_POSITIONS.MIDFIELDER))}</p>
            <p>{renderPositionPlayers(teamPlayers.filter((item) => item.position.id === PLAYER_POSITIONS.FORWARD))}</p>
          </div>
        </div>

      </div>
    </div >
  );
};
