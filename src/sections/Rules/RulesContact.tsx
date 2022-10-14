import React from 'react';
import { TitleContainer } from '@omegafox/components';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';

// Styles and images
import styles from './Rules.module.scss';

export const RulesContact = () => {
  const internalContainerClass = classNames(styles.internalContainer, {
    [styles.internalContainerDesktop]: !isMobile
  });

  const columnsContainerClass = classNames(styles.columnsContainer, {
    [styles.columnsContainerDesktop]: !isMobile,
    [styles.columnsContainerMobile]: isMobile
  });

  return (
    <div className={internalContainerClass}>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.fullWidth}>
            <a href="https://t.me/+rVP220dgf2o0ZDJh">
              <img
                height={80}
                src="https://assets.omegafox.me/img/social_icons/telegram.png"
              />
            </a>
          </p>
        </div>
        <div className={styles.column}>
          <p className={styles.fullWidth}>
            <a href="https://chat.whatsapp.com/7RkUEwV0fcaJT4TNuzklFN">
              <img
                height={80}
                src="https://assets.omegafox.me/img/social_icons/whatsapp.png"
              />
            </a>
          </p>
        </div>
      </div>
      <p className={styles.subTitle}>Administradores</p>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.fullWidth}>Felipe Zanon do Nascimento</p>
          <p className={styles.fullWidth}>
            <a href="https://wa.me/351916166514">
              <img
                alt="WhatsApp Icon"
                height={20}
                src="https://assets.omegafox.me/img/social_icons/whatsapp.png"
              />{' '}
              +351 916 166 514
            </a>
            <br />
            <a href="https://t.me/FelipeZanon">
              <img
                alt="Telegram Icon"
                height={20}
                src="https://assets.omegafox.me/img/social_icons/telegram.png"
              />{' '}
              @FelipeZanon
            </a>
            <br />
            <a href="mailto:felipe@omegafox.me">
              <img
                alt="Gmail Icon"
                height={20}
                src="https://assets.omegafox.me/img/social_icons/gmail.png"
              />{' '}
              felipe@omegafox.me
            </a>
          </p>
        </div>
        <div className={styles.column}>
          <p className={styles.fullWidth}>Nelson Gimenez da Motta</p>
          <p className={styles.fullWidth}>
            <a href="https://wa.me/5511966031088">
              <img
                alt="WhatsApp Icon"
                height={20}
                src="https://assets.omegafox.me/img/social_icons/whatsapp.png"
              />{' '}
              +55 11 96603-1088
            </a>
            <br />
            <a href="https://t.me/nelsonmotta">
              <img
                alt="Telegram Icon"
                height={20}
                src="https://assets.omegafox.me/img/social_icons/telegram.png"
              />{' '}
              @nelsonmotta
            </a>
            <br />
            <a href="mailto:ngm.motta@gmail.com">
              <img
                alt="Gmail Icon"
                height={20}
                src="https://assets.omegafox.me/img/social_icons/gmail.png"
              />{' '}
              ngm.motta@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
