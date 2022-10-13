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
        <a href="https://wa.me/5511966031088">
          +55 11 96603-1088{' '}
          <img
            height={20}
            src="https://assets.omegafox.me/img/social_icons/whatsapp.png"
          />
        </a>
        <br />
        <a href="https://wa.me/351916166514">
          +351 916 166 514{' '}
          <img
            height={20}
            src="https://assets.omegafox.me/img/social_icons/whatsapp.png"
          />
        </a>
        <br />
        <a href="https://t.me/nelsonmotta">
          @nelsonmotta{' '}
          <img
            height={20}
            src="https://assets.omegafox.me/img/social_icons/telegram.png"
          />
        </a>
        <br />
        <a href="https://t.me/FelipeZanon">
          @FelipeZanon{' '}
          <img
            height={20}
            src="https://assets.omegafox.me/img/social_icons/telegram.png"
          />
        </a>
        <br />
        <a href="mailto:ngm.motta@gmail.com">
          ngm.motta@gmail.com{' '}
          <img
            height={20}
            src="https://assets.omegafox.me/img/social_icons/gmail.png"
          />
        </a>
        <br />
        <a href="mailto:felipe@omegafox.me">
          felipe@omegafox.me{' '}
          <img
            height={20}
            src="https://assets.omegafox.me/img/social_icons/gmail.png"
          />
        </a>
      </div>
      <p>
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
