import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';

// Store
import { RootState } from 'store';
import { TError } from 'store/base/types';
import { useOnUpdatePassTokenMutation } from 'store/user/actions';
import { TUser } from 'store/user/types';

// Utilities
import { validateEmail } from 'services/helpers';
import { cloneDeep } from 'lodash';

// Components
import { Button, Loading, TextField } from '@omegafox/components';
import { TTextField, TToastMessage } from 'components/types';

// Styles
import styles from './ForgotPassword.module.scss';
import spinner from 'img/spinner.png';
import ROUTES from 'constants/routes';

const emptyForm: TTextField[] = [
  {
    isDisabled: true,
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
    placeholder: 'Nova senha',
    type: 'password',
    value: null,
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 6
  },
  {
    description: '6+ caracteres',
    isValid: true,
    isVisible: true,
    key: 'confirmPassword',
    placeholder: 'Confirme sua nova senha',
    type: 'password',
    value: null,
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 6
  }
];

export const ForgotPassword = () => {
  const [form, setForm] = useState<TTextField[]>(cloneDeep(emptyForm));

  const [toastMessage, setToastMessage] = useState<TToastMessage | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { email, token } = useParams();
  const [updatePassTrigger, updatePassResult] = useOnUpdatePassTokenMutation();

  const errors: TError[] = useSelector(
    (state: RootState) => state.error.errors
  ) as unknown as TError[];

  const loggedUser: TUser[] = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser[];

  useEffect(() => {
    if (token && email) {
      setForm(
        form.map((item) => {
          if (item.key === 'token') {
            return { ...item, value: token };
          } else if (item.key === 'email') {
            return { ...item, value: email };
          } else {
            return item;
          }
        })
      );
    }
  }, [token, email]);

  useEffect(() => {
    setIsLoading(updatePassResult.isLoading);
    if (updatePassResult.isError) {
      let message = '';
      errors.forEach(
        (error) => (message += `${error.message} (${error.code}) `)
      );

      setToastMessage({ text: message, isError: true });
    } else if (updatePassResult.isSuccess) {
      setToastMessage({ text: 'Operação feita com sucesso', isError: false });
    }
  }, [
    updatePassResult.isLoading,
    updatePassResult.isError,
    updatePassResult.isSuccess
  ]);

  const passwordsMatch = () => {
    const newPassword = form.find((item) => item.key === 'password')?.value;
    const confirmNewPassword = form.find(
      (item) => item.key === 'confirmPassword'
    )?.value;
    return newPassword === confirmNewPassword;
  };

  const isFormValid = () => {
    let isValid = true;
    setForm(
      form.map((item) => {
        if (item.isVisible) {
          if (item.value === null) {
            isValid = false;
          } else {
            const isItemValid = item.validationFunction(item.value);

            if (item.key === 'confirmPassword' || item.key === 'password') {
              item.isValid = isItemValid && passwordsMatch();
            } else {
              item.isValid = isItemValid;
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

  const handleConfirm = () => {
    const isFormDisabled = !isFormValid();
    setIsDisabled(isFormDisabled);
    setToastMessage(null);

    if (isFormDisabled) {
      return;
    }
    const newPassword = form.find((item) => item.key === 'password');

    updatePassTrigger({
      email: email || '',
      token: token || '',
      newPassword: newPassword?.value || '',
      skipToast: true
    });
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

  const renderTextfield = (item: TTextField) => {
    if (!item.isVisible) {
      return null;
    }

    return (
      <TextField
        defaultValue={item.value || ''}
        isDisabled={item.isDisabled}
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
  };

  const messageClass = classNames(styles.message, {
    [styles.messageError]: toastMessage?.isError,
    [styles.messageSuccess]: !toastMessage?.isError
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {loggedUser && <p className={styles.title}>Você já está logado.</p>}
        {isLoading && <Loading image={spinner} />}
        {!loggedUser && (
          <>
            <p className={styles.title}>Recuperar Senha</p>
            {!updatePassResult.isSuccess && form.map(renderTextfield)}
            {updatePassResult.isSuccess && (
              <p className={styles.title}>
                Senha alterada com sucesso! Clique{' '}
                <Link to={`${ROUTES.HOME.url}#entrar`}>aqui</Link> para fazer
                login.
              </p>
            )}
            {toastMessage !== null && (
              <p className={messageClass}>{toastMessage.text}</p>
            )}
            <Button
              isDisabled={isDisabled}
              isShadowed={false}
              variant="confirm"
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
