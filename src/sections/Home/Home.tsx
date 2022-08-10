import React from 'react';
import { Loading } from '@omegafox/components';
import styles from './Home.module.scss';
import spinner from 'img/spinner.png';

export const Home = () => {
  return (
    <main className={styles.app}>
      <Loading image={spinner} text="" />
    </main>
  );
};
