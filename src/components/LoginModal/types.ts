export type TFormInput = {
  description?: string;
  isValid: boolean;
  isVisible: boolean;
  key: string;
  type: 'text' | 'password';
  placeholder: string;
  value: string | null;
  validationFunction: (param: string | null) => boolean;
};

export interface ILoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}
