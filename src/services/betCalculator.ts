import { BET_VALUES } from 'constants/bets';
import { TBet } from 'store/bet/types';
import { TMatch } from 'store/match/types';

const getBetPoints = (bet: TBet, match: TMatch) => {
  if (
    match.awayTeam.goals !== null &&
    match.homeTeam.goals !== null &&
    bet.goalsAway !== null &&
    bet.goalsHome !== null
  ) {
    // valid goals
    if (
      (bet.goalsAway > bet.goalsHome &&
        match.awayTeam.goals > match.homeTeam.goals) ||
      (bet.goalsAway < bet.goalsHome &&
        match.awayTeam.goals < match.homeTeam.goals)
    ) {
      // Acertou o vencedor
      if (
        bet.goalsAway === match.awayTeam.goals &&
        bet.goalsHome === match.homeTeam.goals
      ) {
        // na mosca
        return BET_VALUES.FULL;
      } else {
        if (
          bet.goalsAway === match.awayTeam.goals ||
          bet.goalsHome === match.homeTeam.goals
        ) {
          // acertou 1 placar
          return BET_VALUES.HALF;
        } else {
          // não acertou placar
          return BET_VALUES.MINIMUN;
        }
      }
    } else if (
      bet.goalsAway === bet.goalsHome &&
      match.awayTeam.goals === match.homeTeam.goals
    ) {
      // Acertou empate
      if (bet.goalsAway === match.awayTeam.goals) {
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

export { getBetPoints, getBetStatus };
