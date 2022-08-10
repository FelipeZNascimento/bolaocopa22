import React from 'react';
// import { isMobile } from 'react-device-detect';
// import classNames from 'classnames';

import { Card } from 'components';
import { Loading } from '@omegafox/components';
import styles from './Extras.module.scss';
import spinner from 'img/spinner.png';

export const Extras = () => {
  return (
    <main className={styles.container}>
      <h1>Extras</h1>
      <Card />
      <Loading image={spinner} />
    </main>
  );
};
