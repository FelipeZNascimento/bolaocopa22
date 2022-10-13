import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

// Services
import { stringNormalizer } from 'services/helpers';

// Styles and images
import styles from './Rules.module.scss';

// Constants
import { RULES_SECTIONS } from 'constants/rulesSections';
import ROUTES from 'constants/routes';

export const RulesFaq = () => {
  const navigate = useNavigate();

  const internalContainerClass = classNames(styles.internalContainer, {
    [styles.internalContainerDesktop]: !isMobile
  });

  return (
    <div className={internalContainerClass}>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          O Bolão acontecerá apenas durante a fase de grupos ou se estende até à
          Final?
        </p>
        <p>
          Estende-se <b>até à final</b>. As partidas das Oitavas, Quartas, Semis
          e Final serão adicionadas ao Bolão conforme as seleções forem se
          classificando.
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          As partidas das Fases Finais terão o mesmo peso das partidas da Fase
          de Grupos?
        </p>
        <p>
          <b>Não</b>. As partidas das fases finais terão seus pontos aumentados
          por um fator multiplicador (<b>2x</b> nas Oitavas, <b>3x</b> nas
          Quartas, <b>4x</b> nas Semis e Disputa de 3º Lugar e <b>5x</b> na
          Final).
        </p>
        <p>
          Para mais detalhes, ver a tabela <b>Multiplicador</b> e a seção{' '}
          <b>Pontuações Dinâmicas</b> em{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.POINTS.text
                )}`
              )
            }
          >
            Pontuação
          </a>
          .
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          Todo o valor da inscrição será revertido em premiação?
        </p>
        <p>
          <b>Não</b>. 10% do valor total será direcionado ao pagamento de custos
          de manutenção (servidor, hospedagem e desenvolvimento) e premiações
          adicionais. Os 90% restantes serão distribuídos entre os vencedores do
          Bolão.
        </p>
        <p>
          Para mais detalhes, acesse{' '}
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
          .
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          Moro em outro país. Também posso participar?
        </p>
        <p>
          <b>Sim</b>, contanto que o participante possa efetuar o pagamento da
          inscrição (e receber premiações) em Real ou Euro. Caso o participante
          escolha Euro, será usada a cotação do dia e horário de início da Copa.
          <p>
            Entre em{' '}
            <a
              onClick={() =>
                navigate(
                  `${ROUTES.RULES.url}#${stringNormalizer(
                    RULES_SECTIONS.CONTATO.text
                  )}`
                )
              }
            >
              Contato
            </a>{' '}
            com os administradores para maiores informações.
          </p>
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>O que são Apostas Extras?</p>
        <p>
          Além de receber pontos por acertos numa partida (
          <span className={styles.mint}>Total</span>,{' '}
          <span className={styles.blue}>Parcial</span> ou{' '}
          <span className={styles.lightBlue}>Mínimo</span>), o participante
          também tem a oportunidade de apostar quais seleções terão o Melhor
          Ataque e a Melhor Defesa (na primeira fase), quem será o Artilheiro da
          Copa e qual seleção será a grande Campeã.
        </p>
        <p>
          Essas apostas deverão ser feitas antes do início da Copa e os pontos
          serão calculados e somados à pontuação total quando os vencedores das
          categorias estiverem decididos.
        </p>
        <p>
          Para mais detalhes, acesse{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.EXTRAS.text
                )}`
              )
            }
          >
            Apostas Extras
          </a>
          .
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          Não consigo fazer apostas extras. O que aconteceu?
        </p>
        <p>As Apostas Extras ficarão abertas somente até o início da Copa.</p>
        <p>
          Se a Copa ainda não começou e está com dificuldades em fazer suas
          Apostas Extras, entre em{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.CONTATO.text
                )}`
              )
            }
          >
            Contato
          </a>{' '}
          com os administradores para maiores informações.
        </p>
        <p>
          Para mais detalhes, acesse{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.EXTRAS.text
                )}`
              )
            }
          >
            Apostas Extras
          </a>
          .
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          E se uma partida for para a prorrogação? E se for para os pênaltis?
        </p>
        <p>
          Para efeitos de pontuação, apenas o{' '}
          <b>placar ao fim da prorrogação</b> será considerado. As disputas de
          pênaltis não serão consideradas.
        </p>
        <p>
          Para mais detalhes, acesse{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.POINTS.text
                )}`
              )
            }
          >
            Pontuação
          </a>
          .
        </p>
      </div>

      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          Uma partida está com o placar errado. E agora?
        </p>
        <p>
          As partidas serão atualizadas automaticamente e em tempo real. Caso
          haja falhas técnicas, faremos uma atualização manual ao menos uma vez
          por dia, ao fim do dia.
        </p>
        <p>
          Se a partida ainda estiver com placar errado no dia seguinte ao seu
          término, entre em{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.CONTATO.text
                )}`
              )
            }
          >
            Contato
          </a>{' '}
          com os administradores para relatar o problema.
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          Encontrei um erro ou comportamento inesperado. Como devo proceder?
        </p>
        <p>
          Entre em{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.CONTATO.text
                )}`
              )
            }
          >
            Contato
          </a>{' '}
          com os administradores.
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>Não reconheço uma aposta! O que faço?</p>
        <p>
          Entre em{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.CONTATO.text
                )}`
              )
            }
          >
            Contato
          </a>{' '}
          com os administradores.
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          Não consigo fazer minhas apostas. Quero meu dinheiro de volta!
        </p>
        <p>
          Caso a plataforma apresente falhas técnicas que impossibilitem o
          participante de salvar suas apostas, ainda há a opção de enviar suas
          apostas aos administradores por e-mail. Essa é apenas uma medida de
          precaução.
        </p>
        <p>
          Para mais detalhes, ver <b>Segunda Chance</b> em{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.BETS.text
                )}`
              )
            }
          >
            Apostas
          </a>
          .
        </p>
        <p>
          Se mesmo assim o participante se sentir lesado de alguma forma,
          pedimos que entre em{' '}
          <a
            onClick={() =>
              navigate(
                `${ROUTES.RULES.url}#${stringNormalizer(
                  RULES_SECTIONS.CONTATO.text
                )}`
              )
            }
          >
            Contato
          </a>{' '}
          com os administradores, que farão a análise da situação.
        </p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.subTitle}>
          Também haverá Bolão para outras competições? E outros esportes?
        </p>
        <p>
          <b>Sim e sim</b>! Atualmente, temos um{' '}
          <a
            href="https://bolaonfl.omegafox.me/"
            target={'_blank'}
            rel="noreferrer"
          >
            Bolão da NFL
          </a>{' '}
          já na sua 10ª temporada. Caso haja um número mínimo de interessados,
          também planejamos fazer Bolão das Olimpíadas, Bolão do Brasileirão,
          Bolão da Liga dos Campeões, Bolão de Rocket League... até Bolão do
          Nome do Filho do Vizinho se a vizinhança estiver interessada.
        </p>
        <p>
          Demonstre seu interesse nos canais oficiais (WhatsApp ou Telegram)
          para podermos iniciar os trabalhos!
        </p>
      </div>
    </div>
  );
};
