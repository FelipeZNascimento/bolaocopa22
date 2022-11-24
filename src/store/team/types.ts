export interface ITeam {
  id: number;
  isoCode: string;
  goals: number;
  penalties: number;
  name: string;
  nameEn: string;
  colors: string[];
  abbreviation: string;
  abbreviationEn: string;
  confederation: IConfederation;
  group: string;
  possession: string;
}

export interface IConfederation {
  id: number;
  abbreviation: string;
  name: string;
  nameEn: string;
}
