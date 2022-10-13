import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

// Components
import {
  Card,
  Table,
  TitleContainer,
  TTableColumn,
  TTableRow
} from '@omegafox/components';

// Styles and images
import styles from './Rules.module.scss';

export const RulesPrizes = () => {
  const columns: TTableColumn[] = [
    {
      id: 0,
      align: 'center',
      flex: 1,
      renderingFunction: () => (
        <div>
          <b>Posição</b>
        </div>
      )
    },
    {
      id: 1,
      align: 'center',
      flex: 2,
      renderingFunction: () => (
        <div>
          <b>% do valor líquido*</b>
        </div>
      )
    }
  ];

  const firstCase: TTableRow[] = [
    [
      {
        id: 0,
        renderingFunction: () => <div>1º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>45%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>2º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>25%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>3º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>15%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>4º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>10%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>5º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>5%</div>
      }
    ]
  ];

  const secondCase: TTableRow[] = [
    [
      {
        id: 0,
        renderingFunction: () => <div>1º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>35%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>2º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>20%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>3º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>15%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>4º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>9%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>5º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>6%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>6º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>5%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>7º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>4%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>8º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>3%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>9º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>2%</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>10º</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>1%</div>
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
          text="Até 112 inscritos: Top 5"
        />
        <TitleContainer
          borderPosition="bottomRight"
          size="small"
          text="Prêmios Adicionais: R$50"
        />
        <TitleContainer
          borderPosition="topRight"
          size="small"
          text="112+ inscritos: Top 10"
        />
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <Card
            title="Menos de 112 inscritos"
            isSelected
            renderingStatusFunction={() => (
              <div className={styles.column}>
                <Table isHeader columns={columns} rows={firstCase} />
              </div>
            )}
          />
        </div>
        <div className={styles.column}>
          <Card
            title="112 ou mais inscritos"
            isSelected
            renderingStatusFunction={() => (
              <div className={styles.column}>
                <Table isHeader columns={columns} rows={secondCase} />
              </div>
            )}
          />
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.subTitle}>Critérios de Desempate</p>
          <p>
            <p>1) Maior número de pontos conquistados;</p>
            <p>
              2) Maior número de{' '}
              <span className={styles.mint}>Acertos Totais</span>;
            </p>
            <p>
              3) Maior número de{' '}
              <span className={styles.blue}>Acertos Parciais</span>;
            </p>
            <p>4) Aposta Extra no campeão correta;</p>
            <p>5) Aposta Extra no artilheiro correta;</p>
            <p>6) Sorteio.</p>
          </p>
        </div>
        <div className={styles.column}>
          <p className={styles.subTitle}>Prêmios Adicionais</p>
          <p className="align-center">
            O 1º colocado após os 48 jogos da primeira fase da Copa do Mundo
            (sem contar Apostas Extras) receberá de volta o valor da inscrição:
            R$ 50,00.
          </p>
          <p className="align-center">
            O 1º colocado após todos os 64 jogos da Copa do Mundo (sem contar as
            Apostas Extras) receberá de volta o valor da inscrição: R$ 50,00.
          </p>
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.subTitle}>*Valor Líquido</p>
          <p className={styles.fullWidth}>
            10% do Total Arrecadado será destinado a custos de manutenção
            (servidor, hospedagem, desenvolvimento). Com isso, o Valor Líquido
            segue a seguinte fórmula:
          </p>
          <p className={styles.fullWidth}>
            Valor Líquido = 90% do Total Arrecadado - R$100 (Prêmios Adicionais)
          </p>
        </div>
      </div>
    </div>
  );
};
