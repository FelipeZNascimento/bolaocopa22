import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { validateEmail } from 'services/helpers';

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faCancel,
  faKey,
  faUser,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

import { Button, Loading, Modal, TextField } from '@omegafox/components';
import { TTextField, IModalProps } from 'components/types';

// Redux
import type { RootState } from 'store/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  useOnLogoutMutation,
  useOnUpdateInfoMutation,
  useOnUpdatePassMutation
} from 'store/user/actions';
import { extraBetsUserLoggedOut } from 'store/bet/reducer';
import { userLoggedIn, userLoggedOut } from 'store/user/reducer';
import { matchesUserLoggedOut } from 'store/match/reducer';
import { TUser } from 'store/user/types';
import { TError, TQuery } from 'store/base/types';

// Styles & Images
import styles from './UserModal.module.scss';
import logo from 'img/spinner.png';
import classNames from 'classnames';

const emptyForm: TTextField[] = [
  {
    isDisabled: true,
    isValid: true,
    isVisible: true,
    key: 'email',
    placeholder: 'Email',
    type: 'text',
    value: '',
    validationFunction: (value: string | null) => validateEmail(value)
  },
  {
    description: 'Entre 4 e 14 caracteres',
    isValid: true,
    isVisible: true,
    key: 'nickname',
    placeholder: 'Apelido',
    type: 'text',
    value: '',
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 4 && value.length <= 14
  },
  {
    isValid: true,
    isVisible: true,
    key: 'name',
    placeholder: 'Nome',
    type: 'text',
    value: '',
    validationFunction: (value: string | null) => value !== null
  },
  {
    description: '6+ caracteres',
    isValid: true,
    isVisible: false,
    key: 'password',
    placeholder: 'Senha atual',
    type: 'password',
    value: null,
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 6
  },
  {
    description: '6+ caracteres',
    isValid: true,
    isVisible: false,
    key: 'newPassword',
    placeholder: 'Nova senha',
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
    placeholder: 'Confirme a nova senha',
    type: 'password',
    value: null,
    validationFunction: (value: string | null) =>
      value !== null && value.length >= 6
  }
];

type TToastMessage = {
  text: string;
  isError: boolean;
};

export const UserModal = ({ isOpen, onClose }: IModalProps) => {
  const [logoutTrigger, logoutResult] = useOnLogoutMutation();
  const [updateInfoTrigger, updateInfoResult] = useOnUpdateInfoMutation();
  const [updatePassTrigger, updatePassResult] = useOnUpdatePassMutation();

  const [form, setForm] = useState<TTextField[]>(cloneDeep(emptyForm));
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<TToastMessage | null>(null);

  const loggedUser: TUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const errors: TError[] = useSelector(
    (state: RootState) => state.error.errors
  ) as unknown as TError[];

  const isLoading = updateInfoResult.isLoading || updatePassResult.isLoading;

  const dispatch = useDispatch();

  useEffect(() => {
    if (updatePassResult.isSuccess) {
      setToastMessage({ text: 'Operação feita com sucesso', isError: false });
    } else if (updatePassResult.isError) {
      setToastMessage({ text: 'Erro na operação', isError: true });
    }
  }, [updatePassResult.isSuccess, updatePassResult.isError]);

  useEffect(() => {
    if (updateInfoResult.isSuccess && updateInfoResult.data) {
      const queryData: TQuery = updateInfoResult.data;
      dispatch(userLoggedIn(queryData.result.loggedUser));
      setToastMessage({ text: 'Operação feita com sucesso', isError: false });
    } else if (updateInfoResult.isError && errors.length > 0) {
      let message = '';
      errors.forEach(
        (error) => (message += `${error.message} (${error.code}) `)
      );

      setToastMessage({ text: message, isError: true });
    }
  }, [updateInfoResult.isSuccess, updateInfoResult.isError]);

  useEffect(() => {
    if (loggedUser && isOpen) {
      fillFormWithUserDetails();
    }
  }, [loggedUser, isOpen]);

  useEffect(() => {
    if (logoutResult.isSuccess && !logoutResult.isLoading) {
      const queryData: TQuery = logoutResult.data;

      if (queryData.isSuccess) {
        dispatch(userLoggedOut());
        dispatch(matchesUserLoggedOut());
        dispatch(extraBetsUserLoggedOut());
        handleClose();
      } else {
        setToastMessage({ text: 'Erro na operação', isError: true });
      }
    } else if (logoutResult.isError) {
      setToastMessage({ text: 'Erro na operação', isError: true });
    }
  }, [logoutResult.isSuccess, logoutResult.isLoading]);

  const fillFormWithUserDetails = () => {
    setForm(
      form.map((item) => {
        const itemKey = item.key as keyof TUser;
        item.value = (loggedUser[itemKey] as string) || null;

        return item;
      })
    );
  };

  const passwordsMatch = () => {
    const newPassword = form.find((item) => item.key === 'newPassword')?.value;
    const confirmNewPassword = form.find(
      (item) => item.key === 'confirmPassword'
    )?.value;
    return newPassword === confirmNewPassword;
  };

  const isFormValid = () => {
    let isValid = true;
    setForm(
      form.map((item) => {
        if (item.isVisible && !item.isDisabled) {
          if (item.value === null) {
            isValid = false;
          } else {
            const isItemValid = item.validationFunction(item.value);

            if (item.key === 'confirmPassword' || item.key === 'newPassword') {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToastMessage(null);
    setIsDisabled(false);

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
    setIsDisabled(true);
    setIsChangePassword(false);
    setForm(cloneDeep(emptyForm));
    setToastMessage(null);

    onClose();
  };

  const onLogout = () => {
    logoutTrigger();
  };

  const handleConfirm = () => {
    const isFormDisabled = !isFormValid();
    setIsDisabled(isFormDisabled);
    setToastMessage(null);

    if (isFormDisabled || !loggedUser) {
      return;
    }

    if (isChangePassword) {
      const password = form.find((item) => item.key === 'password');
      const newPassword = form.find((item) => item.key === 'newPassword');

      updatePassTrigger({
        id: loggedUser.id,
        password: password?.value || '',
        newPassword: newPassword?.value || ''
      });
    } else {
      const name = form.find((item) => item.key === 'name');
      const nickname = form.find((item) => item.key === 'nickname');

      updateInfoTrigger({
        skipToast: true,
        id: loggedUser.id,
        name: name?.value || '',
        nickname: nickname?.value || ''
      });
    }
  };

  const handleChangeInputs = () => {
    const renderPasswordInputs = !isChangePassword;
    setIsChangePassword(renderPasswordInputs);
    setIsDisabled(true);
    setToastMessage(null);
    if (renderPasswordInputs) {
      fillFormWithUserDetails();
    }

    setForm(
      form.map((item) => {
        if (item.key === 'email') {
          item.isVisible = true;
        } else if (
          item.key === 'password' ||
          item.key === 'newPassword' ||
          item.key === 'confirmPassword'
        ) {
          item.isVisible = renderPasswordInputs;
        } else {
          item.isVisible = !renderPasswordInputs;
        }
        return item;
      })
    );
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
        subtitle={'Área do Usuário'}
        onClose={handleClose}
      >
        {isLoading && <Loading text="" image={logo} />}
        {!isLoading &&
          form.map((item) => {
            if (!item.isVisible) {
              return null;
            }

            return (
              <TextField
                isDisabled={item.isDisabled}
                isError={!item.isValid}
                description={item.description || ''}
                inputName={item.key}
                key={item.key}
                placeholder={item.placeholder}
                type={item.type}
                defaultValue={item.value || ''}
                onChange={handleChange}
                onEnter={handleConfirm}
              />
            );
          })}
        {toastMessage !== null && (
          <p className={messageClass}>{toastMessage.text}</p>
        )}
        <div className={styles.buttonContainer}>
          <Button
            icon={<FontAwesomeIcon icon={faCancel} size="lg" />}
            isShadowed={false}
            variant="neutral"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          &nbsp;
          <Button
            icon={<FontAwesomeIcon icon={faSave} size="lg" />}
            isDisabled={isDisabled}
            isShadowed={false}
            variant="confirm"
            onClick={handleConfirm}
          >
            Salvar
          </Button>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            icon={
              <FontAwesomeIcon
                icon={isChangePassword ? faUser : faKey}
                size="lg"
              />
            }
            isShadowed={false}
            variant="primary"
            onClick={handleChangeInputs}
          >
            {isChangePassword ? 'Alterar dados' : 'Alterar senha'}
          </Button>
        </div>
        &nbsp;
        <div className={styles.buttonContainer}>
          <Button
            icon={<FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />}
            isShadowed={false}
            variant="danger"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </Modal>
    </>
  );
};
