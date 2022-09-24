export type TUser = {
  id: number;
  nickname: string;
  name: string;
  email: string;
  password?: string;
  newPassword?: string;
  isActive: boolean;
};

export type TUserRanking = TUser & {
  points: number;
  full: number;
  half: number;
  minimun: number;
};
