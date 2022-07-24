import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import { Ranking as Rank } from '@omegafox/components';
import { tableConfig } from 'constants/mocks';
import styles from './Ranking.module.scss';
import logo from 'img/logo_translucid10.png';

export const Ranking = () => {
  const containerClass = classNames(styles.container, {
    [styles.containerBrowser]: !isMobile,
    [styles.containerMobile]: isMobile
  });

  return (
    <main className={containerClass}>
      <div className={styles.rankingContainer}>
        <Rank
          isHeader
          backgroundImage={logo}
          columns={tableConfig.columns}
          rows={tableConfig.rows}
        />
      </div>
    </main>
  );
};
