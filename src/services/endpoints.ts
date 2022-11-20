// export const apiBaseUrl = 'https://localhost:63768/copa2022';
export const apiBaseUrl = 'https://api.omegafox.me/copa2022';

// General
export const config = () => '/general/config';
export const news = () => '/general/news';

// User
export const getAll = () => '/user/';
export const register = () => '/user/register';
export const login = () => '/user/login';
export const logout = () => '/user/logout';
export const updateInfo = () => '/user/updateInfo';
export const updatePass = () => '/user/updatePassword';
export const forgotPassword = (email: string) =>
  `/user/forgotPassword?email=${email}`;
export const recoverPassword = () => '/user/recoverPassword';
export const updateIsActive = () => '/user/updateIsActive';

// Match
export const listAllMatches = () => '/match';
export const listAllMatchesWithUserBets = () => '/match/userBets';

// Match
export const listAllPlayers = () => '/player';

// Bet
export const updateBet = () => '/bet';
export const listAllExtraBets = () => '/extraBets';
export const updateExtraBet = () => '/extraBets';

// Team
export const listAllTeams = () => '/team/';
export const listTeamById = (id: number) => `/team/${id}`;
export const listTeamPlayers = (id: number) => `/team/${id}/players`;

// Ranking
export const listRanking = () => '/ranking/';
export const listRankingByRound = (round: number) => `/ranking/${round}`;
