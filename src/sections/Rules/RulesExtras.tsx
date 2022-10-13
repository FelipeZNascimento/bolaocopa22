import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';
import {
  Card,
  Ranking,
  TitleContainer,
  TRankingColumn,
  TRankingRow
} from '@omegafox/components';

// Styles and images
import styles from './Rules.module.scss';

export const RulesExtras = () => {
  const columns: TRankingColumn[] = [
    {
      id: 0,
      align: 'center',
      flex: 1,
      renderingFunction: () => (
        <div>
          <b>Aposta Extra</b>
        </div>
      )
    },
    {
      id: 1,
      align: 'center',
      flex: 1,
      renderingFunction: () => (
        <div>
          <b>Pontuação</b>
        </div>
      )
    }
  ];

  const rows: TRankingRow[] = [
    [
      {
        id: 0,
        renderingFunction: () => <div>Campeão</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>40</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>Artilheiro</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>10</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>Melhor Defesa*</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>10</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>Melhor Ataque*</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>10</div>
      }
    ]
  ];
  const internalContainerClass = classNames(styles.internalContainer, {
    [styles.internalContainerDesktop]: !isMobile
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
          text="Campeão"
        />
        <TitleContainer
          borderPosition="bottomRight"
          size="small"
          text="Artilheiro"
        />
        <TitleContainer
          borderPosition="topRight"
          size="small"
          text="Melhor Defesa"
        />
        <TitleContainer
          borderPosition="topLeft"
          size="small"
          text="Melhor Ataque"
        />
      </div>
      <p className="align-center">
        As Apostas Extras são apostas específicas sobre o Campeão mundial, o
        Artilheiro, o Melhor Ataque e a Melhor Defesa da Copa do Mundo.
        <br />
        <b>Será possível apostar apenas até o início da Copa.</b> Após o apito
        inicial, as Apostas Extras estarão automaticamente bloqueadas.
      </p>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <Card
            title="Pontuação das Apostas Extras"
            isSelected
            renderingStatusFunction={() => (
              <div className={styles.column}>
                <Ranking isHeader columns={columns} rows={rows} />
              </div>
            )}
          />
          <p>
            * Para Melhor Defesa e Melhor Ataque serão considerados apenas os
            gols marcados/sofridos na Fase de Grupos.
          </p>
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.subTitle}>Cadê meus pontos?</p>
          <p>
            Os pontos serão computados quando cada categoria for decidida. Eles
            aparecerão no ranking somados à pontuação total obtida com os jogos.
          </p>
        </div>
        <div className={styles.column}>
          <p className={styles.subTitle}>Desempate</p>
          <p>
            Caso haja empate nas categorias de Artilheiro, Melhor Ataque ou
            Melhor Defesa, não haverá desempate. Ganharão pontos <b>todos</b>{' '}
            que apostaram nos Artilheiros, Melhores Ataques ou Melhores Defesas
            vencedores.
          </p>
        </div>
      </div>
    </div>
  );
};
