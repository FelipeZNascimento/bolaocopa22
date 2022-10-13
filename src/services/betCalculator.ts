import { TBet } from 'store/bet/types';
import { TMatch } from 'store/match/types';
import { BET_VALUES } from '@omegafox/components';

const getBetPoints = (bet: TBet, match: TMatch) => {
  return getBetPointsByScore(
    match.homeTeam.goals,
    match.awayTeam.goals,
    bet.goalsHome,
    bet.goalsAway
  );
};

const getBetPointsByScore = (
  scoreHome: number,
  scoreAway: number,
  betHome: number,
  betAway: number
) => {
  if (
    scoreHome !== null &&
    scoreAway !== null &&
    betHome !== null &&
    betAway !== null
  ) {
    // valid goals
    if (
      (betAway > betHome && scoreAway > scoreHome) ||
      (betAway < betHome && scoreAway < scoreHome)
    ) {
      // Acertou o vencedor
      if (betAway === scoreAway && betHome === scoreHome) {
        // na mosca
        return BET_VALUES.FULL;
      } else {
        if (betAway === scoreAway || betHome === scoreHome) {
          // acertou 1 placar
          return BET_VALUES.HALF;
        } else {
          // não acertou placar
          return BET_VALUES.MINIMUN;
        }
      }
    } else if (betAway === betHome && scoreAway === scoreHome) {
      // Acertou empate
      if (betAway === scoreAway) {
        // na mosca
        return BET_VALUES.FULL;
      } else {
        // não acertou placar
        return BET_VALUES.MINIMUN;
      }
    }
  }

  return BET_VALUES.MISS;
};

const getBetStatus = (points: number) => {
  if (points === BET_VALUES.FULL) {
    return 'full';
  } else if (points === BET_VALUES.HALF) {
    return 'half';
    // } else if (points === BET_VALUES.MINIMUN) {
    //   return 'minimun';
  } else {
    return 'miss';
  }
};

export { getBetPoints, getBetPointsByScore, getBetStatus };
