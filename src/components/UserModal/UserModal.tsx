import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField } from '@omegafox/components';
import { cloneDeep } from 'lodash';
// import { useDispatch } from 'react-redux';

import { validateEmail } from 'services/helpers';
import { IUserModalProps, TFormInput } from './types';
import styles from './UserModal.module.scss';
// import { userLoggedIn } from 'store/user/reducer';

// Redux
import type { RootState } from 'store/index';
import { useDispatch, useSelector } from 'react-redux';
import { useOnLogoutMutation } from 'store/user/actions';
import { userLoggedOut } from 'store/user/reducer';
import { TUser } from 'store/user/types';
import { QueryHandler } from 'services/queryHandler';

const emptyForm: TFormInput[] = [
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
  // {
  //   description: '6+ caracteres',
  //   isValid: true,
  //   isVisible: true,
  //   key: 'password',
  //   placeholder: 'Senha',
  //   type: 'password',
  //   value: null,
  //   validationFunction: (value: string | null) =>
  //     value !== null && value.length >= 6
  // },
  // {
  //   description: '6+ caracteres',
  //   isValid: true,
  //   isVisible: false,
  //   key: 'confirmPassword',
  //   placeholder: 'Confirme sua senha',
  //   type: 'password',
  //   value: null,
  //   validationFunction: (value: string | null) =>
  //     value !== null && value.length >= 6
  // },
  {
    description: 'Entre 4 e 14 caracteres',
    isDisabled: false,
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
    isDisabled: false,
    isValid: true,
    isVisible: true,
    key: 'name',
    placeholder: 'Nome',
    type: 'text',
    value: '',
    validationFunction: (value: string | null) => value !== null
  }
];

export const UserModal = ({ isOpen, onClose }: IUserModalProps) => {
  const [logoutTrigger, logoutResult] = useOnLogoutMutation();
  const [form, setForm] = useState<TFormInput[]>(cloneDeep(emptyForm));
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const loggedUser: TUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedUser) {
      fillFormWithUserDetails();
    }
  }, [loggedUser]);

  useEffect(() => {
    if (logoutResult.isSuccess && !logoutResult.isLoading) {
      const result = QueryHandler(logoutResult.data);

      if (result) {
        dispatch(userLoggedOut());
        handleClose();
      }
    }
  }, [logoutResult]);

  const fillFormWithUserDetails = () => {
    setForm(
      form.map((item) => {
        const itemKey = item.key as keyof TUser;
        item.value = loggedUser[itemKey] as string;

        return item;
      })
    );
  };

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
    fillFormWithUserDetails();
    setIsDisabled(true);
    onClose();
  };

  const onLogout = () => {
    logoutTrigger();
  };

  const handleConfirm = () => {
    setIsDisabled(!isFormValid());

    if (isDisabled) {
      return;
    }
  };

  return (
    <>
      <Modal
        size="small"
        isOpen={isOpen}
        title={'Área do Usuário'}
        onClose={handleClose}
      >
        {form.map((item) => {
          if (!item.isVisible) {
            return null;
          }

          return (
            <TextField
              // isDisabled={item.isDisabled}
              isError={!item.isValid}
              description={item.description ? item.description : ''}
              inputName={item.key}
              key={item.key}
              placeholder={item.placeholder}
              type={item.type}
              defaultValue={item.value}
              onChange={handleChange}
              // onKeyDown={handleKeyDown}
            />
          );
        })}
        <div className={styles.buttonContainer}>
          <Button isShadowed={false} variant="neutral" onClick={handleClose}>
            Cancelar
          </Button>
          &nbsp;
          <Button
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
          <Button isShadowed={false} variant="danger" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </Modal>
    </>
  );
};
