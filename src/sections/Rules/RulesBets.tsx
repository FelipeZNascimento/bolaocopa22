import React from 'react';
import { TitleContainer } from '@omegafox/components';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';

// Styles and images
import styles from './Rules.module.scss';

export const RulesBets = () => {
  const internalContainerClass = classNames(styles.internalContainer, {
    [styles.internalContainerDesktop]: !isMobile
  });

  return (
    <div className={internalContainerClass}>
      <div className={styles.titlesContainer}>
        <TitleContainer
          borderPosition="bottomLeft"
          size="small"
          text="Bloqueio Automático"
        />
        <TitleContainer
          borderPosition="bottomRight"
          size="small"
          text="Atualizações Diárias"
        />
      </div>

      <p className="align-center">
        As apostas poderão ser feitas até o horário de início de cada jogo. No
        momento do apito inicial, a partida será automaticamente bloqueada para
        novas apostas. Todos os horários dos jogos obedecem ao fuso horário do
        usuário.
        <br />
        Os resultados dos jogos e os gols serão atualizados, no mínimo,
        diariamente.
      </p>
      <p className={styles.subTitle}>Segunda Chance</p>
      <p className="align-center">
        Caso o participante não consiga acessar o site do Bolão por algum motivo
        para realizar suas apostas, serão aceitas apostas enviadas para o e-mail{' '}
        <a href="https://wa.me/5511966031088">
          +55 11 96603-1088{' '}
          <img
            alt="Gmail Icon"
            height={20}
            src="https://assets.omegafox.me/img/social_icons/gmail.png"
          />
        </a>{' '}
        ou{' '}
        <a href="mailto:felipe@omegafox.me">
          felipe@omegafox.me{' '}
          <img
            alt="Gmail Icon"
            height={20}
            src="https://assets.omegafox.me/img/social_icons/gmail.png"
          />
        </a>{' '}
        até o horário de início do jogo em questão.
        <br />
        Caso a aposta por e-mail não esteja clara ou não respeite o horário,
        será desconsiderada.
      </p>
    </div>
  );
};
