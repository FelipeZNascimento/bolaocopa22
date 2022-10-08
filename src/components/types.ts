export type TTextField = {
  description?: string;
  isDisabled?: boolean;
  isValid: boolean;
  isVisible: boolean;
  key: string;
  type: 'text' | 'password';
  placeholder: string;
  value: string | null;
  validationFunction: (param: string | null) => boolean;
};

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type TToastMessage = {
  text: string;
  isError: boolean;
};
