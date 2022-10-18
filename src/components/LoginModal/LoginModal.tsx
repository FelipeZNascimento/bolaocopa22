import React, { useEffect, useState } from 'react';
import { Button, Loading, Modal, TextField } from '@omegafox/components';
import { cloneDeep } from 'lodash';

import { validateEmail } from 'services/helpers';
import { TTextField, IModalProps, TToastMessage } from 'components/types';
import styles from './LoginModal.module.scss';
import logo from 'img/spinner.png';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Store
import {
  useOnForgotPasswordMutation,
  useOnLoginMutation,
  useOnRegisterMutation
} from 'store/user/actions';
import { userLoggedIn, userLoginLoading } from 'store/user/reducer';
import { TError, TQuery } from 'store/base/types';
import type { RootState } from 'store/index';
import classNames from 'classnames';

const emptyForm: TTextField[] = [
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

export const LoginModal = ({ isOpen, onClose }: IModalProps) => {
  // Mutation Triggers
  const [loginTrigger, loginResult] = useOnLoginMutation();
  const [registerTrigger, registerResult] = useOnRegisterMutation();
  const [forgotPassTrigger, forgotPassResult] = useOnForgotPasswordMutation();

  // UseState
  const [toastMessage, setToastMessage] = useState<TToastMessage | null>(null);
  const [form, setForm] = useState<TTextField[]>(cloneDeep(emptyForm));
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [status, setStatus] = useState<'login' | 'register' | 'forgotPassword'>(
    'login'
  );
  const [hasSeasonStarted, setHasSeasonStarted] = useState<boolean | null>(
    null
  );

  const dispatch = useDispatch();

  const seasonStart = useSelector(
    (state: RootState) => state.match.seasonStart
  ) as unknown as number;

  const loginLoading = useSelector(
    (state: RootState) => state.user.loginLoading
  ) as boolean;

  const errors: TError[] = useSelector(
    (state: RootState) => state.error.errors
  ) as unknown as TError[];

  let intervalId: NodeJS.Timer;

  useEffect(() => {
    if (!seasonStart) {
      return;
    }

    intervalId = setInterval(function () {
      const timestamp = parseInt((new Date().getTime() / 1000).toFixed(0));
      setHasSeasonStarted(timestamp > seasonStart);
    }, 1000); // 60 * 1000 milsec

    return () => clearInterval(intervalId);
  }, [seasonStart]);

  useEffect(() => {
    if (hasSeasonStarted) {
      clearInterval(intervalId);
    }
  }, [hasSeasonStarted]);

  useEffect(() => {
    dispatch(userLoginLoading(loginResult.isLoading));

    if (loginResult.isSuccess && loginResult.data) {
      const queryData: TQuery = loginResult.data;

      dispatch(userLoggedIn(queryData.result.loggedUser));
      handleClose();
    } else if (loginResult.isError && errors.length > 0) {
      let message = '';
      errors.forEach(
        (error) => (message += `${error.message} (${error.code}) `)
      );

      setToastMessage({ text: message, isError: true });
    }
  }, [loginResult.isSuccess, loginResult.isError]);

  useEffect(() => {
    if (registerResult.isSuccess && !registerResult.isLoading) {
      const queryData: TQuery = registerResult.data;

      dispatch(userLoggedIn(queryData.result.loggedUser));
      handleClose();
    } else if (registerResult.isError && errors.length > 0) {
      let message = '';
      errors.forEach(
        (error) => (message += `${error.message} (${error.code}) `)
      );

      setToastMessage({ text: message, isError: true });
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
    setToastMessage(null);

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
    setToastMessage(null);
    onClose();
  };

  const onLogin = () => {
    const email = form.find((item: TTextField) => item.key === 'email')?.value;
    const password = form.find(
      (item: TTextField) => item.key === 'password'
    )?.value;

    loginTrigger({
      email: email as string,
      password: password as string,
      skipToast: true
    });
  };

  const onRegister = () => {
    const email = form.find((item: TTextField) => item.key === 'email')
      ?.value as string;
    const password = form.find((item: TTextField) => item.key === 'password')
      ?.value as string;
    const nickname = form.find((item: TTextField) => item.key === 'nickname')
      ?.value as string;

    registerTrigger({
      email: email,
      password: password,
      nickname: nickname,
      skipToast: true
    });
  };

  const onForgotPassword = () => {
    const email = form.find((item: TTextField) => item.key === 'email')
      ?.value as string;

    forgotPassTrigger({ email: email, skipToast: true });
    setToastMessage({
      text: 'Se esse endereço de email estiver cadastrado, você receberá instruções para configurar sua nova senha.',
      isError: false
    });
    setIsDisabled(true);
  };

  const handleConfirm = () => {
    const isFormDisabled = !isFormValid();
    setIsDisabled(isFormDisabled);
    setToastMessage(null);

    if (isFormDisabled) {
      return;
    }

    if (status === 'login') {
      onLogin();
    } else if (status === 'register') {
      onRegister();
    } else if (status === 'forgotPassword') {
      onForgotPassword();
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
    setToastMessage(null);

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
    setToastMessage(null);

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
    setIsDisabled(!isFormValid());
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

  const messageClass = classNames(styles.message, {
    [styles.messageError]: toastMessage?.isError,
    [styles.messageSuccess]: !toastMessage?.isError
  });

  return (
    <>
      <Modal
        size="small"
        isOpen={isOpen}
        title={renderTitle()}
        onClose={handleClose}
      >
        {loginLoading && <Loading text="" image={logo} />}
        {!loginLoading &&
          form.map((item) => {
            if (!item.isVisible) {
              return null;
            }

            return (
              <TextField
                defaultValue={item.value || ''}
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
        {toastMessage !== null && (
          <p className={messageClass}>{toastMessage.text}</p>
        )}
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
          {status !== 'forgotPassword' && (
            <a onClick={handleForgotPassword}>Esqueci a senha</a>
          )}
          {!hasSeasonStarted && status !== 'register' && (
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
