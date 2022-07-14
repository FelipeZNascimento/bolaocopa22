import React from 'react';
import { Loading } from '@omegafox/components';
import styles from './Home.module.scss';
import logo from 'img/spinner.png';

export const Home = () => {
  return (
    <div className={styles.app}>
      <Loading image={logo} text="" />
    </div>
  );
};
