export type TModalTextField = {
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
