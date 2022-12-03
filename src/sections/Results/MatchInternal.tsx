import React, { useState } from 'react';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';

// Components
import {
  BET_VALUES,
  Button,
  NavbarButton,
  TNavbarButton
} from '@omegafox/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsersBetweenLines,
  faCircleInfo,
  faClock,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { PlayerModal } from 'components/PlayerModal/PlayerModal';

// Store
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { IEvent } from 'store/match/types';

// Services
import { getBetPoints } from 'services/betCalculator';

// Types
import { TMatchInternal } from './types';
import { TBet } from 'store/bet/types';
import { TUser } from 'store/user/types';
import { IPlayer } from 'store/player/types';

// Styles and images
import styles from './Results.module.scss';

// Constants
import { MATCH_EVENT_TYPES } from 'constants/matchEvents';

export const MatchInternal = ({ match, isMatchStarted }: TMatchInternal) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);
  const [selectedSection, setSelectedSection] = useState<number>(
    isMatchStarted ? 0 : 1
  );

  const matchInternalSections = [
    {
      id: 0,
      text: 'Apostas',
      url: '',
      isDisabled: !isMatchStarted,
      icon: faUsersBetweenLines
    },
    {
      id: 1,
      text: 'Ficha Técnica',
      url: '',
      isDisabled: false,
      icon: faCircleInfo
    },
    {
      id: 2,
      text: 'Tempo Real',
      url: '',
      isDisabled: !isMatchStarted,
      icon: faClock
    }
  ];

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const renderSingleBet = (bet: TBet, userBet = false) => {
    const singleBetPoints = getBetPoints(bet, match);
    const betContainerClass = classNames(styles.singleBetContainer, {
      [styles.singleBetContainerUser]: userBet
    });

    const betClass = classNames({
      [styles.singleBetGreen]: singleBetPoints === BET_VALUES.FULL,
      [styles.singleBetBlue]: singleBetPoints === BET_VALUES.HALF,
      [styles.singleBetLightBlue]: singleBetPoints === BET_VALUES.MINIMUN,
      [styles.singleBetRed]: singleBetPoints === BET_VALUES.MISS
    });

    return (
      <div className={betContainerClass}>
        <div className={styles.singleBetOwner}>
          {userBet ? (
            <FontAwesomeIcon icon={faUser} />
          ) : (
            ''
          )}{' '}
          {bet.user.nickname}
        </div>
        <div className={`${betClass} ${styles.singleBetScore}`}>{`${bet.goalsHome !== null ? bet.goalsHome : 'x'
          } - ${bet.goalsAway !== null ? bet.goalsAway : 'x'}`}</div>
        <div className={`${betClass} ${styles.singleBetPoints}`}>
          {singleBetPoints} Pts.
        </div>
      </div>
    );
  };

  const renderMatchInfo = () => {
    return (
      <div key={match.id} className={styles.expandableNotStarted}>
        <div className={styles.expandableNotStartedContent}>
          <img
            className={styles.contentImage}
            alt="Stadium image"
            src={`https://assets.omegafox.me/img/stadiums/${match.stadium.id}.png`}
          />
          <p>{match.stadium.name}</p>
          <p>{match.stadium.city}</p>
          <p>{match.stadium.capacity} pessoas</p>
        </div>
        <div className={styles.expandableNotStartedContent}>
          <p>Árbitro: {match.referee.name}</p>
        </div>
      </div>
    );
  };

  const getEventIconUrl = (eventType: number, isHome: boolean) => {
    switch (eventType) {
      case MATCH_EVENT_TYPES.GOAL: {
        return isHome
          ? 'https://assets.omegafox.me/img/icons2018/goal.png'
          : 'https://assets.omegafox.me/img/icons2018/goal_a.png';
      }
      case MATCH_EVENT_TYPES.OWN_GOAL: {
        return isHome
          ? 'https://assets.omegafox.me/img/icons2018/own_goal.png'
          : 'https://assets.omegafox.me/img/icons2018/own_goal_a.png';
      }
      case MATCH_EVENT_TYPES.PENALTY_GOAL: {
        return isHome
          ? 'https://assets.omegafox.me/img/icons2018/penalty_goal.png'
          : 'https://assets.omegafox.me/img/icons2018/penalty_goal_a.png';
      }
    }
  };

  const renderEvent = (event: IEvent) => {
    if (
      (event.idTeam === match.homeTeam.id && event.type !== MATCH_EVENT_TYPES.OWN_GOAL)
      || (event.idTeam === match.awayTeam.id && event.type === MATCH_EVENT_TYPES.OWN_GOAL)
    ) {
      return (
        <div className={styles.eventLeft}>
          <div className={styles.eventIcon}>
            <img src={getEventIconUrl(event.type, true)} />
          </div>
          <div className={styles.eventMinute}>{event.gametime}</div>
          <div className={styles.eventPlayerLeft}>
            <a onClick={() => setSelectedPlayer(event.player)}>{event.player.name}</a>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.eventRight}>
          <div className={styles.eventPlayerRight}>
            <a onClick={() => setSelectedPlayer(event.player)}>{event.player.name}</a>
          </div>
          <div className={styles.eventMinute}>{event.gametime}</div>
          <div className={styles.eventIcon}>
            <img src={getEventIconUrl(event.type, false)} />
          </div>
        </div>
      );
    }
  };

  const renderRealTime = () => {
    return (
      <div key={match.id} className={styles.expandableNotStarted}>
        <div className={styles.expandableNotStartedContent}>
          <h3>Posse de Bola</h3>
          <p>{match.homeTeam.possession}% - {match.awayTeam.possession}%</p>
          <div>{match.events.map(renderEvent)}</div>
        </div>
      </div>
    );
  };

  const renderMatchBets = () => {
    const matchBetsFull: TBet[] = [];
    const matchBetsHalf: TBet[] = [];
    const matchBetsMinimun: TBet[] = [];
    const matchBetsMiss: TBet[] = [];

    if (match.bets && match.bets.length === 0) {
      return;
    }

    match.bets.forEach((bet) => {
      if (loggedUser && bet.user.id === loggedUser.id) {
        return;
      }
      const singleBetPoints = getBetPoints(bet, match);
      if (singleBetPoints === BET_VALUES.FULL) {
        matchBetsFull.push(bet);
      } else if (singleBetPoints === BET_VALUES.HALF) {
        matchBetsHalf.push(bet);
      } else if (singleBetPoints === BET_VALUES.MINIMUN) {
        matchBetsMinimun.push(bet);
      } else {
        matchBetsMiss.push(bet);
      }
    });

    matchBetsFull.sort(
      (a, b) => a.user.nickname.localeCompare((b.user.nickname))
    );
    matchBetsHalf.sort(
      (a, b) => b.goalsHome - a.goalsHome || b.goalsAway - a.goalsAway || (a.user.nickname).localeCompare((b.user.nickname))
    );
    matchBetsMinimun.sort(
      (a, b) => b.goalsHome - a.goalsHome || b.goalsAway - a.goalsAway || (a.user.nickname).localeCompare((b.user.nickname))
    );
    matchBetsMiss.sort(
      (a, b) => b.goalsHome - a.goalsHome || b.goalsAway - a.goalsAway || (a.user.nickname).localeCompare((b.user.nickname))
    );

    return (
      <>
        {match.loggedUserBets && renderSingleBet(match.loggedUserBets, true)}
        {matchBetsFull.map((bet) => {
          return renderSingleBet(bet);
        })}
        {matchBetsHalf.map((bet) => {
          return renderSingleBet(bet);
        })}
        {matchBetsMinimun.map((bet) => {
          return renderSingleBet(bet);
        })}
        {matchBetsMiss.map((bet) => {
          return renderSingleBet(bet);
        })}
      </>
    );
  };

  const handleSectionClick = (item: TNavbarButton) => {
    if (!item.isDisabled) {
      setSelectedSection(item.id);
    }
  };

  return (
    <>
      <PlayerModal
        isOpen={selectedPlayer !== null}
        selectedPlayer={selectedPlayer ? { player: selectedPlayer, index: null } : null}
        onClose={() => setSelectedPlayer(null)}
      />
      <div className={styles.expandableStarted}>
        <div className={styles.expandableStartedBets}>
          <div className={styles.buttonsContainer}>
            {isMobile &&
              matchInternalSections.map((item) => (
                <div className={styles.button} key={item.id}>
                  <Button
                    icon={
                      <FontAwesomeIcon className={styles.icon} icon={item.icon} />
                    }
                    isDisabled={item.isDisabled}
                    isSelected={selectedSection === item.id}
                    size="small"
                    variant="neutral"
                    onClick={() => handleSectionClick(item)}
                  >
                    {isMobile ? '' : item.text}
                  </Button>
                </div>
              ))}
            {!isMobile &&
              matchInternalSections.map((item) => (
                <NavbarButton
                  isShadowed
                  key={item.id}
                  button={{
                    id: item.id,
                    isDisabled: item.isDisabled,
                    text: item.text,
                    url: item.url
                  }}
                  isSelected={selectedSection === item.id}
                  onClick={handleSectionClick}
                />
              ))}
          </div>
          {selectedSection === 0 && renderMatchBets()}
          {selectedSection === 1 && renderMatchInfo()}
          {selectedSection === 2 && renderRealTime()}
        </div>
      </div>
    </>
  );
};
