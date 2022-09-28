export type TUser = {
  id: number;
  nickname: string;
  name: string;
  email: string;
  password?: string;
  newPassword?: string;
  isActive: boolean;
  lastTimestamp: number;
};

export type TUserRanking = TUser & {
  position: number;
  points: number;
  full: number;
  half: number;
  minimun: number;
};
