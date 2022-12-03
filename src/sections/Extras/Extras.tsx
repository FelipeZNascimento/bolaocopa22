import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  Loading,
  TeamButton,
  TitleContainer,
  TDropdownItem
} from '@omegafox/components';
import { ExtrasClosed } from './ExtrasClosed';
import { ExtrasOpen } from './ExtrasOpen';

// Store
import { RootState } from 'store';
import { useOnUpdateExtraBetMutation as updateExtraBetMutation } from 'store/bet/actions';
import { extraBetsUpdated } from 'store/bet/reducer';

// Types
import { ITeam } from 'store/team/types';
import { TUser } from 'store/user/types';
import { TExtraBets } from './types';
import { TExtraBet, TExtraBetsResults } from 'store/bet/types';

// Constants
import { EXTRA_TYPES } from 'constants/extraTypes';

// Styles
import styles from './Extras.module.scss';
import spinner from 'img/spinner.png';
import { IPlayer } from 'store/player/types';
import { ensureTyping } from 'services/helpers';

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

  const dispatch = useDispatch();

  const seasonStart = useSelector(
    (state: RootState) => state.match.seasonStart
  ) as unknown as number;

  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  const players = useSelector(
    (state: RootState) => state.player.players
  ) as unknown as IPlayer[];

  const teamsLoading = useSelector(
    (state: RootState) => state.team.teamsLoading
  ) as unknown as boolean;

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const loggedUserExtraBets = useSelector(
    (state: RootState) => state.bet.loggedUserExtraBets
  ) as unknown as TExtraBet[];

  const extraBetsResults = useSelector(
    (state: RootState) => state.bet.extraBetsResults
  ) as unknown as TExtraBetsResults;

  const extraBetsLoading = useSelector(
    (state: RootState) => state.bet.extraBetsLoading
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

  const updateStoreWithNewBets = (idExtraType: number, id: number) => {
    let selectedTeam = null;
    let selectedPlayer: IPlayer | null = null;

    if (idExtraType === EXTRA_TYPES.STRIKER) {
      selectedPlayer = players.find((item) => item.id === id) as IPlayer;
      selectedTeam = teams.find((team) => team.id === selectedPlayer?.team.id);
    } else {
      selectedTeam = teams.find((team) => team.id === id);
    }

    const newExtraBet: TExtraBet = {
      id: null,
      idExtraType: idExtraType,
      idTeam: selectedTeam?.id || null,
      idPlayer: selectedPlayer?.id || null,
      user: loggedUser,
      team: selectedTeam || null,
      player: selectedPlayer || null,
      timestamp: null
    };

    const updatedExtraBets = loggedUserExtraBets.filter(
      (item) => item.idExtraType !== idExtraType
    );
    updatedExtraBets.push(newExtraBet);
    dispatch(extraBetsUpdated(updatedExtraBets));
  };

  const handleStrikerSelect = (player: TDropdownItem) => {
    const selectedPlayer = players.find((item) => item.id === player.id);

    if (selectedPlayer) {
      updateExtraTrigger({
        betId: null,
        extraType: EXTRA_TYPES.STRIKER,
        userId: loggedUser.id,
        teamId: selectedPlayer.team.id,
        playerId: selectedPlayer.id
      });
      const updatedExtraBets = { ...extraBets, striker: selectedPlayer };

      setExtraBets(updatedExtraBets);
      updateStoreWithNewBets(EXTRA_TYPES.STRIKER, player.id);
    }
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
        updateStoreWithNewBets(EXTRA_TYPES.CHAMPION, team.id);
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
        updateStoreWithNewBets(EXTRA_TYPES.OFFENSE, team.id);
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
        updateStoreWithNewBets(EXTRA_TYPES.DEFENSE, team.id);
        break;
      }
    }
  };

  const renderLoading = () => {
    return <Loading image={spinner} size="small" isOverlay />;
  };

  const renderPlayer = (team: ITeam | null, playerName: string | null) => {
    if (!playerName || !team) {
      return <FontAwesomeIcon icon={faQuestionCircle} size="lg" />;
    } else if (updateExtraResult.isLoading) {
      return renderLoading();
    } else {
      const statusClass = classNames({
        [styles.statusMobile]: isMobile,
        [styles.statusDesktop]: !isMobile
      });

      return (
        <div className={statusClass}>
          <TeamButton
            fontSize={isMobile ? 'small' : 'big'}
            isHoverable={false}
            isBig={false}
            colors={team.colors}
            logo={`https://assets.omegafox.me/img/countries_crests/${team.abbreviationEn.toLowerCase()}.png`}
            name={playerName}
          />
        </div>
      );
    }
  };

  const renderTeam = (teams: ITeam[] | null) => {
    if (!teams || teams.length === 0) {
      return <FontAwesomeIcon icon={faQuestionCircle} size="lg" />;
    } else if (teams && updateExtraResult.isLoading) {
      return renderLoading();
    } else {
      const statusClass = classNames({
        [styles.statusMobile]: isMobile,
        [styles.statusDesktop]: !isMobile
      });

      return (
        <div className={statusClass}>
          {teams.map((team) => <TeamButton
            key={team.id}
            isHoverable={false}
            isBig={false}
            colors={team.colors}
            logo={`https://assets.omegafox.me/img/countries_crests/${team.abbreviationEn.toLowerCase()}.png`}
            name={isMobile ? team.abbreviation : team.name}
          />)}
        </div>
      );
    }
  };

  const renderStatus = (extraType: number) => {
    if (extraBetsLoading || hasSeasonStarted === null) {
      return renderLoading();
    }

    if (hasSeasonStarted) {
      const offenseTeams = extraBetsResults.offense.map((extraResult) => ensureTyping(teams.find((team) => team.id === extraResult.idTeam)));
      const defenseTeams = extraBetsResults.defense.map((extraResult) => ensureTyping(teams.find((team) => team.id === extraResult.idTeam)));
      const championTeams = extraBetsResults.champion.map((extraResult) => ensureTyping(teams.find((team) => team.id === extraResult.idTeam)));
      const strikersObject = extraBetsResults.striker.map((extraResult) => {
        return {
          team: ensureTyping(teams.find((team) => team.id === extraResult.idTeam)),
          name: extraResult.nameStriker
        };
      });

      switch (extraType) {
        case EXTRA_TYPES.CHAMPION:
          return renderTeam(championTeams.sort((a, b) => a.id - b.id));
        case EXTRA_TYPES.OFFENSE:
          return renderTeam(offenseTeams.sort((a, b) => a.id - b.id));
        case EXTRA_TYPES.DEFENSE:
          return renderTeam(defenseTeams.sort((a, b) => a.id - b.id));
        case EXTRA_TYPES.STRIKER:
          return <>
            {strikersObject.length > 0
              ? strikersObject.map((striker) => renderPlayer(striker.team, striker.name))
              : renderPlayer(null, null)
            }
          </>;
        default:
          return null;
      }
    } else {
      const strikerBet = loggedUserExtraBets.find(
        (extraBet) => extraBet.idExtraType === EXTRA_TYPES.STRIKER
      );

      const championBet = ensureTyping(loggedUserExtraBets.find(
        (extraBet) => extraBet.idExtraType === EXTRA_TYPES.CHAMPION
      )).team;

      const offenseBet = ensureTyping(loggedUserExtraBets.find(
        (extraBet) => extraBet.idExtraType === EXTRA_TYPES.OFFENSE
      )).team;

      const defenseBet = ensureTyping(loggedUserExtraBets.find(
        (extraBet) => extraBet.idExtraType === EXTRA_TYPES.DEFENSE
      )).team;

      switch (extraType) {
        case EXTRA_TYPES.CHAMPION:
          return renderTeam(
            championBet ? [championBet] : null
          );
        case EXTRA_TYPES.OFFENSE:
          return renderTeam(
            offenseBet ? [offenseBet] : null
          );
        case EXTRA_TYPES.DEFENSE:
          return renderTeam(
            defenseBet ? [defenseBet] : null
          );
        case EXTRA_TYPES.STRIKER:
          return renderPlayer(
            strikerBet?.team || null,
            strikerBet?.player?.name || null
          );
        default:
          return null;
      }
    }
  };

  const teamClass = classNames(styles.teamsContainer, {
    [styles.teamsContainerMobile]: isMobile,
    [styles.teamsContainerDesktop]: !isMobile
  });

  const topSectionClass = classNames(styles.topSection, {
    [styles.topSectionDesktop]: !isMobile
  });

  const cardClass = classNames(styles.card, {
    [styles.cardMobile]: isMobile
  });

  return (
    <main className={styles.container}>
      {!loggedUser && (
        <div className={styles.titleContainer}>
          <TitleContainer text="Você precisa estar logado para ter acesso a essa seção." />
        </div>
      )}
      {loggedUser && (
        <>
          <div className={topSectionClass}>
            <div className={styles.cardsContainer}>
              {extrasInfo.map((item) => {
                return (
                  <div className={cardClass} key={item.id}>
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
          <div className={teamClass}>
            {!hasSeasonStarted && !loggedUser.isActive && (
              <div className={styles.titleContainer}>
                <TitleContainer text="As apostas serão liberadas após confirmação de pagamento." />
              </div>
            )}

            {!hasSeasonStarted && loggedUser.isActive && (
              <ExtrasOpen
                champion={extraBets.champion}
                defense={extraBets.defense}
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
