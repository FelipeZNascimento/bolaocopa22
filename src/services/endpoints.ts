// export const apiBaseUrl = 'https://localhost:63768/copa2022';
export const apiBaseUrl = 'https://api.omegafox.me/copa2022';

export const config = () => '/general/config';

// User
export const register = () => '/user/register';
export const login = () => '/user/login';
export const logout = () => '/user/logout';
export const updateInfo = () => '/user/updateInfo';
export const updatePass = () => '/user/updatePassword';
export const forgotPassword = (email: string) =>
  `/user/forgotPassword?email=${email}`;
export const recoverPassword = () => '/user/recoverPassword';

// Match
export const listAllMatches = () => '/match';
export const listAllMatchesWithUserBets = () => '/match/userBets';

// Bet
export const updateBet = () => '/bet';
export const listAllExtraBets = () => '/extraBets';
export const updateExtraBet = () => '/extraBets';

// Team
export const listAllTeams = () => '/team/';
export const listTeamById = (id: number) => `/team/${id}`;

// Ranking
export const listRanking = () => '/ranking/';
export const listRankingByRound = (round: number) => `/ranking/${round}`;
