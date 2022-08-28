import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { validateEmail } from 'services/helpers';

// Components and styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faCancel,
  faKey,
  faUser,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

import { Button, Loading, Modal, TextField } from '@omegafox/components';
import { TModalTextField, IModalProps } from 'components/types';
import styles from './UserModal.module.scss';

// Redux
import type { RootState } from 'store/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  useOnLogoutMutation,
  useOnUpdateInfoMutation,
  useOnUpdatePassMutation
} from 'store/user/actions';
import { userLoggedIn, userLoggedOut } from 'store/user/reducer';
import { TUser } from 'store/user/types';
import logo from 'img/spinner.png';
import { TError, TQuery } from 'store/base/types';
import classNames from 'classnames';

const emptyForm: TModalTextField[] = [
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

export const UserModal = ({ isOpen, onClose }: IModalProps) => {
  const [logoutTrigger, logoutResult] = useOnLogoutMutation();
  const [updateInfoTrigger, updateInfoResult] = useOnUpdateInfoMutation();
  const [updatePassTrigger, updatePassResult] = useOnUpdatePassMutation();

  const [form, setForm] = useState<TModalTextField[]>(cloneDeep(emptyForm));
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isError, setIsError] = useState<TError[]>([]);

  const loggedUser: TUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const isLoading = updateInfoResult.isLoading || updatePassResult.isLoading;
  const isSuccess =
    (!updateInfoResult.isUninitialized &&
      !updateInfoResult.isLoading &&
      updateInfoResult.isSuccess) ||
    (!updatePassResult.isUninitialized &&
      !updatePassResult.isLoading &&
      updatePassResult.isSuccess);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedUser) {
      fillFormWithUserDetails();
    }
  }, [loggedUser]);

  useEffect(() => {
    if (logoutResult.isSuccess && !logoutResult.isLoading) {
      const queryData: TQuery = logoutResult.data;

      if (queryData.isSuccess) {
        dispatch(userLoggedOut());
        handleClose();
      } else {
        setIsError(queryData.result.errors);
      }
    }
  }, [logoutResult]);

  useEffect(() => {
    if (updateInfoResult.isSuccess && !updateInfoResult.isLoading) {
      const queryData: TQuery = updateInfoResult.data;

      if (queryData.isSuccess) {
        dispatch(userLoggedIn(queryData.result.loggedUser));
      } else {
        setIsError(queryData.result.errors);
      }
    }
  }, [updateInfoResult]);

  useEffect(() => {
    if (updatePassResult.isSuccess && !updatePassResult.isLoading) {
      const queryData: TQuery = updatePassResult.data;

      if (!queryData.isSuccess) {
        setIsError(queryData.result.errors);
      }
    }
  }, [updatePassResult]);

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
    setIsError([]);
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
    onClose();
  };

  const onLogout = () => {
    logoutTrigger();
  };

  const handleConfirm = () => {
    const isFormDisabled = !isFormValid();
    setIsDisabled(isFormDisabled);
    setIsError([]);

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
    setIsError([]);
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
    [styles.messageError]: isError.length > 0,
    [styles.messageSuccess]: isSuccess && isError.length === 0
  });

  return (
    <>
      <Modal
        size="small"
        isOpen={isOpen}
        title={'Área do Usuário'}
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
        <p className={messageClass}>
          {isError.length > 0 && isError[0].message}&nbsp;
          {isSuccess && isError.length === 0 && 'Operação feita com sucesso'}
        </p>
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
