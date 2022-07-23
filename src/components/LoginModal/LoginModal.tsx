import React, { useState } from 'react';
import { Button, Modal, TextField } from '@omegafox/components';
import { cloneDeep } from 'lodash';

import { validateEmail } from 'services/helpers';
import { ILoginModalProps, TFormInput } from './types';
import styles from './LoginModal.module.scss';

const emptyForm: TFormInput[] = [
  {
    isValid: true,
    isVisible: true,
    key: 'email',
    placeholder: 'Email',
    type: 'text',
    value: null,
    validationFunction: (value: string | null) => validateEmail(value)
  },
  {
    description: '6+ caracteres',
    isValid: true,
    isVisible: true,
    key: 'password',
    placeholder: 'Senha',
    type: 'password',
    value: null,
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 6
  },
  {
    description: 'Entre 6 e 14 caracteres',
    isValid: true,
    isVisible: false,
    key: 'nickname',
    placeholder: 'Apelido',
    type: 'text',
    value: null,
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 6 && value.length <= 14
  }
];

export const LoginModal = ({ isOpen, onClose }: ILoginModalProps) => {
  const [form, setForm] = useState<TFormInput[]>(cloneDeep(emptyForm));
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const isFormValid = () => {
    let isValid = true;
    setForm(
      form.map((element) => {
        if (element.isVisible) {
          if (element.value === null) {
            isValid = false;
          } else {
            const isElementValid = element.validationFunction(element.value);
            element.isValid = isElementValid;

            if (isValid && !isElementValid) {
              isValid = isElementValid;
            }
          }
        }

        return element;
      })
    );

    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formKey = e.target.name;
    const formValue = e.target.value;

    setForm(
      form.map((element) => {
        if (element.key === formKey) {
          element.value = formValue;
        }

        return element;
      })
    );

    setIsDisabled(!isFormValid());
  };

  const handleClose = () => {
    setForm(cloneDeep(emptyForm));
    setIsRegister(false);
    setIsDisabled(true);
    onClose();
  };

  const handleConfirm = () => {
    console.log('confirm');
    setIsDisabled(!isFormValid());

    if (isDisabled) {
      return;
    }
  };

  const handleRegister = (flag: boolean) => {
    setIsRegister(flag);
    setForm(
      form.map((element) => {
        if (element.key === 'nickname') {
          element.isVisible = flag;
        }

        return element;
      })
    );
  };

  return (
    <>
      <Modal size="small" isOpen={isOpen} title="Entrar" onClose={handleClose}>
        {form.map((item) => {
          if (!item.isVisible) {
            return null;
          }

          return (
            <TextField
              isError={!item.isValid}
              description={item.description ? item.description : ''}
              inputName={item.key}
              key={item.key}
              placeholder={item.placeholder}
              type={item.type}
              onChange={handleChange}
            />
          );
        })}

        <div className={styles.buttonContainer}>
          <Button variant="danger" onClick={handleClose}>
            Cancelar
          </Button>
          &nbsp;
          <Button
            isDisabled={isDisabled}
            variant="confirm"
            onClick={handleConfirm}
          >
            Confirmar
          </Button>
        </div>
        <div className={styles.extraOptions}>
          <a>Esqueci a senha</a>
          {!isRegister && (
            <a onClick={() => handleRegister(true)}>Registre-se</a>
          )}
          {isRegister && (
            <a onClick={() => handleRegister(false)}>Já tenho uma conta</a>
          )}
        </div>
      </Modal>
    </>
  );
};
