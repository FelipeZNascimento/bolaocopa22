import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

// Components
import { TitleContainer } from '@omegafox/components';

// Services
import { stringNormalizer } from 'services/helpers';

// Constants
import ROUTES from 'constants/routes';
import { RULES_SECTIONS } from 'constants/rulesSections';

// Styles and images
import styles from './Rules.module.scss';

export const RulesSubscription = () => {
  const navigate = useNavigate();

  const internalContainerClass = classNames({
    [styles.internalContainer]: !isMobile
  });

  const columnsContainerClass = classNames(styles.columnsContainer, {
    [styles.columnsContainerDesktop]: !isMobile,
    [styles.columnsContainerMobile]: isMobile
  });

  return (
    <div className={internalContainerClass}>
      <div className={styles.titlesContainer}>
        <TitleContainer
          borderPosition="bottomLeft"
          size="small"
          text="Valor: R$50"
        />
        <TitleContainer
          borderPosition="bottomRight"
          size="small"
          text="1 inscrição por pessoa"
        />
      </div>
      <p className="align-center">
        As inscrições estarão abertas até o início da Copa. Seu cadastro será
        liberado para apostar apenas <b>após confirmação de pagamento</b>.<br />
        Se o pagamento não for feito até o início da Copa, a participação ficará
        vetada.
      </p>
      <div className="align-center">
        <p className={styles.subTitle}>Chave PIX para pagamento</p>
        395.825.028-94 (Nelson Gimenez da Motta)
        <p className={styles.subTitle}>
          Encaminhe o comprovante para um dos contatos abaixo
        </p>
        <div className={columnsContainerClass}>
          <div className={styles.column}>
            <p className={styles.fullWidth}>
              <b>Felipe Zanon do Nascimento</b>
              <br />
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
            <p className={styles.fullWidth}>
              <b>Nelson Gimenez da Motta</b>
              <br />
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
      <p className='align-center'>
        Obs.: 10% do valor arrecadado será revertido para gastos com domínio,
        hospedagem e desenvolvimento do site do bolão, além dos R$100,00 em
        prêmios adicionais (mais informações em{' '}
        <a
          onClick={() =>
            navigate(
              `${ROUTES.RULES.url}#${stringNormalizer(
                RULES_SECTIONS.PRIZES.text
              )}`
            )
          }
        >
          Premiação
        </a>
        ).
      </p>
    </div>
  );
};
