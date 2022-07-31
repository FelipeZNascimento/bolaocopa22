export type TFormInput = {
  description?: string;
  isDisabled: boolean;
  isValid: boolean;
  isVisible: boolean;
  key: string;
  type: 'text' | 'password';
  placeholder: string;
  value: string;
  validationFunction: (param: string | null) => boolean;
};

export interface IUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}
