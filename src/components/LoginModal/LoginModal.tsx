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
    description: '6+ caracteres',
    isValid: true,
    isVisible: false,
    key: 'confirmPassword',
    placeholder: 'Confirme sua senha',
    type: 'password',
    value: null,
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 6
  },
  {
    description: 'Entre 4 e 14 caracteres',
    isValid: true,
    isVisible: false,
    key: 'nickname',
    placeholder: 'Apelido',
    type: 'text',
    value: null,
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 4 && value.length <= 14
  }
];

export const LoginModal = ({ isOpen, onClose }: ILoginModalProps) => {
  const [form, setForm] = useState<TFormInput[]>(cloneDeep(emptyForm));
  const [status, setStatus] = useState<'login' | 'register' | 'forgotPassword'>(
    'login'
  );
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const passwordsMatch = (value: string) => {
    const password = form.find((item) => item.key === 'password')?.value;
    return password === value;
  };
  const isFormValid = () => {
    let isValid = true;
    setForm(
      form.map((item) => {
        if (item.isVisible) {
          if (item.value === null) {
            isValid = false;
          } else {
            const isitemValid = item.validationFunction(item.value);

            if (item.key === 'confirmPassword') {
              item.isValid = isitemValid && passwordsMatch(item.value);
            } else {
              item.isValid = isitemValid;
            }

            if (isValid && !item.isValid) {
              isValid = item.isValid;
            }
          }
        }

        return item;
      })
    );

    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formKey = e.target.name;
    const formValue = e.target.value;

    setForm(
      form.map((item) => {
        if (item.key === formKey) {
          item.value = formValue;
        }

        return item;
      })
    );

    setIsDisabled(!isFormValid());
  };

  const handleClose = () => {
    setForm(cloneDeep(emptyForm));
    setStatus('login');
    setIsDisabled(true);
    onClose();
  };

  const handleConfirm = () => {
    console.log('confirm');
    setIsDisabled(!isFormValid());

    if (isDisabled) {
      return;
    }

    if (status === 'login') {
      console.log('login');
    } else if (status === 'register') {
      console.log('register');
    } else if (status === 'forgotPassword') {
      console.log('forgotPassword');
    }
  };

  const handleLogin = () => {
    setStatus('login');
    setForm(
      form.map((item) => {
        if (item.key === 'email' || item.key === 'password') {
          item.isVisible = true;
        } else {
          item.isVisible = false;
        }

        return item;
      })
    );

    setIsDisabled(!isFormValid());
  };

  const handleRegister = () => {
    setStatus('register');
    setForm(
      form.map((item) => {
        if (
          item.key === 'email' ||
          item.key === 'password' ||
          item.key === 'nickname' ||
          item.key === 'confirmPassword'
        ) {
          item.isVisible = true;
        } else {
          item.isVisible = false;
        }

        return item;
      })
    );

    setIsDisabled(!isFormValid());
  };

  const handleForgotPassword = () => {
    setStatus('forgotPassword');

    setForm(
      form.map((item) => {
        if (item.key === 'email') {
          item.isVisible = true;
        } else {
          item.isVisible = false;
        }

        return item;
      })
    );
  };

  const renderTitle = () => {
    if (status === 'login') {
      return 'Entrar';
    } else if (status === 'register') {
      return 'Registrar';
    } else {
      return 'Esqueci a senha';
    }
  };

  return (
    <>
      <Modal
        size="small"
        isOpen={isOpen}
        title={renderTitle()}
        onClose={handleClose}
      >
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
          <a onClick={handleForgotPassword}>Esqueci a senha</a>
          {status !== 'register' && (
            <a onClick={() => handleRegister()}>Registre-se</a>
          )}
          {status !== 'login' && (
            <a onClick={() => handleLogin()}>Já tenho uma conta</a>
          )}
        </div>
      </Modal>
    </>
  );
};
