import React from 'react';
import { Loading } from '@omegafox/components';
import styles from './Home.module.scss';
import logo from 'img/spinner.png';

export const Home = () => {
  return (
    <main className={styles.app}>
      <Loading image={logo} text="" />
    </main>
  );
};
