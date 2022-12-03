import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import { Button, Loading, Table, TeamButton, Tooltip, TTableColumn, TTableRow, TTableRowColumn } from '@omegafox/components';
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
import { PlayerModal } from 'components/PlayerModal/PlayerModal';
import { IPlayer } from 'store/player/types';

interface ISingleTeam {
  singleTeam: ITeam;
}
interface ISelectedPlayer {
  player: IPlayer;
  index: number;
}

export const SingleTeam = ({ singleTeam }: ISingleTeam) => {
  const [frameId, setFrameId] = useState<string>('');
  const [rows, setRows] = useState<TTableRow[]>([]);
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<ISelectedPlayer | null>(null);

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

  const handleModalToggle = (player: IPlayer | null, index: number | null) => {
    if (player === null || index === null) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer({ player: player, index: index });
    }
  };

  useEffect(() => {
    if (!teamPlayersQueryResult.isFetching
      && !teamPlayersQueryResult.isLoading
      && teamPlayersQueryResult.data
    ) {
      const result = QueryHandler(teamPlayersQueryResult.data);
      if (result) {
        setPlayers(result.players);
        const playerRows = result.players.map((player, index) => {
          const singleRow: TTableRowColumn[] = [
            {
              id: 0,
              renderingFunction: () => (
                <div translate="no">
                  <Tooltip text={player.position.description}>
                    <img
                      className={styles.positionIcon}
                      alt="Position icon"
                      src={`https://assets.omegafox.me/img/positions/${player.position.abbreviation.toLowerCase()}.png`}
                    />
                  </Tooltip>
                </div>
              )
            },
            {
              id: 1,
              renderingFunction: () => (
                <div translate="no">{player.position.id === 1 ? '' : player.number}</div>
              )
            },
            {
              id: 2,
              renderingFunction: () => (
                <div className={styles.playerName} translate="no" onClick={() => handleModalToggle(player, index)}>{player.name}</div>
              )
            },
            {
              id: 4,
              renderingFunction: () => (
                <div translate="no">
                  {player.position.id === 1
                    ? ''
                    : <>
                      <img
                        className={styles.positionIcon}
                        alt="Position icon"
                        src={`https://flagcdn.com/h40/${player.club?.country.isoCode.toLowerCase()}.png`}
                      />&nbsp;
                      {player.club?.name}
                    </>
                  }
                </div>
              )
            },
          ];

          if (!isMobile) {
            const heightColumn = {
              id: 3,
              renderingFunction: () => (
                <div translate="no">{player.position.id === 1 ? '' : `${player.height}cm`}</div>
              )
            };
            singleRow.splice(3, 0, heightColumn);
          }

          return singleRow;
        });
        // countries_crests/${singleTeam.abbreviationEn.toLowerCase()}.png
        setRows(playerRows);
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

  const columns: TTableColumn[] = [
    {
      id: 0,
      align: 'left',
      flex: 1,
      renderingFunction: () => (
        <div>
          <b>Pos</b>
        </div>
      )
    },
    {
      id: 1,
      align: 'left',
      flex: 1,
      renderingFunction: () => (
        <div>
          <Tooltip text="Número">
            <b>Nº</b>
          </Tooltip>
        </div>
      )
    },
    {
      id: 2,
      align: 'left',
      flex: 3,
      renderingFunction: () => (
        <div>
          <b>Nome</b>
        </div>
      )
    },
    {
      id: 4,
      align: 'left',
      flex: 3,
      renderingFunction: () => (
        <div>
          <b>Clube</b>
        </div>
      )
    }
  ];

  if (!isMobile) {
    const heightColumn: TTableColumn = {
      id: 3,
      align: 'center',
      flex: 1,
      renderingFunction: () => (
        <div>
          <b>Altura</b>
        </div>
      )
    };
    columns.splice(3, 0, heightColumn);
  }


  const handleBackClick = () => {
    navigate({ pathname: ROUTES.TEAMS.url });
  };

  const handleModalChange = (newIndex: number) => {
    const playersLength = players.length;
    if (newIndex < 0) {
      setSelectedPlayer({ player: players[playersLength - 1], index: playersLength - 1 });
    } else if (newIndex >= playersLength) {
      setSelectedPlayer({ player: players[0], index: 0 });
    } else {
      setSelectedPlayer({ player: players[newIndex], index: newIndex });
    }
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
    <>
      <PlayerModal
        isOpen={selectedPlayer !== null}
        selectedPlayer={selectedPlayer}
        onChange={(newIndex) => handleModalChange(newIndex)}
        onClose={() => handleModalToggle(null, null)}
      />
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
        <div className={contentContainerClass}>
          <div className={contentClass}>
            {teamPlayersQueryResult.isLoading && <Loading image={spinner} />}
            <Table isHeader={true} columns={columns} rows={rows} />
          </div>
        </div>
      </div >
    </>
  );
};
