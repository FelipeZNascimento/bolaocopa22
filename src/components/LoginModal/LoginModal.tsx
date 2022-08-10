import React, { useEffect, useState } from 'react';
import { Button, Loading, Modal, TextField } from '@omegafox/components';
import { cloneDeep } from 'lodash';

import { validateEmail } from 'services/helpers';
import { ILoginModalProps, TFormInput } from './types';
import styles from './LoginModal.module.scss';
import logo from 'img/spinner.png';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'store/index';

// Store
import { useOnLoginMutation, useOnRegisterMutation } from 'store/user/actions';
import { userLoggedIn, userLoginLoading } from 'store/user/reducer';
import { QueryHandler } from 'services/queryHandler';

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
  // Mutation Triggers
  const [loginTrigger, loginResult] = useOnLoginMutation();
  const [registerTrigger, registerResult] = useOnRegisterMutation();

  // UseState
  const [form, setForm] = useState<TFormInput[]>(cloneDeep(emptyForm));
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [status, setStatus] = useState<'login' | 'register' | 'forgotPassword'>(
    'login'
  );

  const dispatch = useDispatch();
  const loginLoading = useSelector(
    (state: RootState) => state.user.loginLoading
  ) as boolean;

  useEffect(() => {
    dispatch(userLoginLoading(loginResult.isLoading));

    if (loginResult.isSuccess && !loginResult.isLoading) {
      const result = QueryHandler(loginResult.data);
      dispatch(userLoggedIn(result.loggedUser));
      handleClose();
    }
  }, [loginResult]);

  useEffect(() => {
    if (registerResult.isSuccess && !registerResult.isLoading) {
      dispatch(userLoggedIn(registerResult.data));
      handleClose();
    }
  }, [registerResult]);

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

  const onLogin = () => {
    const email = form.find((item: TFormInput) => item.key === 'email')?.value;
    const password = form.find(
      (item: TFormInput) => item.key === 'password'
    )?.value;

    loginTrigger({
      email: email as string,
      password: password as string
    });
  };

  const onRegister = () => {
    const email = form.find((item: TFormInput) => item.key === 'email')
      ?.value as string;
    const password = form.find((item: TFormInput) => item.key === 'password')
      ?.value as string;
    const nickname = form.find((item: TFormInput) => item.key === 'nickname')
      ?.value as string;

    registerTrigger({
      email: email,
      password: password,
      nickname: nickname
    });
  };

  const handleConfirm = () => {
    setIsDisabled(!isFormValid());

    if (isDisabled) {
      return;
    }

    if (status === 'login') {
      onLogin();
    } else if (status === 'register') {
      onRegister();
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
        {loginLoading && <Loading image={logo} />}
        {!loginLoading &&
          form.map((item) => {
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
                onEnter={handleConfirm}
              />
            );
          })}

        <div className={styles.buttonContainer}>
          <Button isShadowed={false} variant="neutral" onClick={handleClose}>
            Cancelar
          </Button>
          &nbsp;
          <Button
            isDisabled={loginLoading || isDisabled}
            isShadowed={false}
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
