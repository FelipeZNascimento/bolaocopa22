export type TRequest = {
  id: string;
  endpoint: string;
  params: string;
  cancel: () => void;
};
