import { Button, Loading, Table, TextContainer } from '@omegafox/components';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import {
  useOnGetAllMutation,
  useOnUpdateIsActiveMutation
} from 'store/user/actions';
import { TUser } from 'store/user/types';
import spinner from 'img/spinner.png';
import { QueryHandler } from 'services/queryHandler';
import styles from './Admin.module.scss';
import { TTableColumn } from '@omegafox/components';
import { TTableRow } from '@omegafox/components';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

export const Admin = () => {
  const [users, setUsers] = useState<TUser[]>([]);

  // Queries and Mutations
  const [getAllTrigger, getAllResult] = useOnGetAllMutation();
  const [updateIsActiveTrigger, updateIsActiveResult] =
    useOnUpdateIsActiveMutation();

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

  useEffect(() => {
    if (loggedUser && (loggedUser.id === 9 || loggedUser.id === 17)) {
      getAllTrigger();
    }
  }, [loggedUser]);

  useEffect(() => {
    if (getAllResult.isSuccess) {
      const result = QueryHandler(getAllResult.data);
      if (result && result.users) {
        setUsers(result.users);
      }
    }
  }, [getAllResult.isSuccess]);

  useEffect(() => {
    if (updateIsActiveResult.isSuccess) {
      getAllTrigger();
    }
  }, [updateIsActiveResult]);

  const handleButtonClick = (user: TUser) => {
    updateIsActiveTrigger({ id: user.id, isActive: user.isActive });
  };

  const renderUsers = () => {
    const columns: TTableColumn[] = [
      {
        id: 0,
        align: 'left',
        flex: 1,
        renderingFunction: () => (
          <div>
            <b>ID</b>
          </div>
        )
      },
      {
        id: 1,
        align: 'left',
        flex: 3,
        renderingFunction: () => (
          <div>
            <b>Nickname | Email</b>
          </div>
        )
      },
      {
        id: 2,
        align: 'right',
        flex: 2,
        renderingFunction: () => (
          <div>
            <b>Ações</b>
          </div>
        )
      }
    ];

    let rows: TTableRow[] = [];

    if (users) {
      rows = users
        .slice()
        .sort((a, b) => b.id - a.id)
        .map((user) => {
          return [
            {
              id: 0,
              renderingFunction: () => <div>{user.id}.</div>
            },
            {
              id: 1,
              renderingFunction: () => (
                <div>
                  {user.nickname} | {user.email}
                </div>
              )
            },
            {
              id: 2,
              renderingFunction: () => (
                <div className={styles.buttonContainer}>
                  <Button
                    size="medium"
                    variant={user.isActive ? 'danger' : 'confirm'}
                    onClick={() => handleButtonClick(user)}
                  >
                    {user.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              )
            }
          ];
        });
    }

    const contentClass = classNames(styles.content, {
      [styles.contentDesktop]: !isMobile,
      [styles.contentMobile]: isMobile
    });

    return (
      <div className={contentClass}>
        <TextContainer>
          <Table isHeader={true} columns={columns} rows={rows} />
        </TextContainer>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <p>
        {users.length} cadastrados |{' '}
        {users.filter((item) => item.isActive).length} ativos
      </p>
      {(getAllResult.isLoading || updateIsActiveResult.isLoading) && (
        <Loading image={spinner} />
      )}
      {!getAllResult.isLoading &&
        !updateIsActiveResult.isLoading &&
        getAllResult.data &&
        renderUsers()}
    </div>
  );
};
