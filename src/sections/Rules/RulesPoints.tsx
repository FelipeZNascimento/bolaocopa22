import React from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

// Store & Types
import { RootState } from 'store';
import { ITeam } from 'store/team/types';

// Services
import { getBetPointsByScore } from 'services/betCalculator';

// Styles and images
import styles from './Rules.module.scss';
import {
  Card,
  FOOTBALL_MATCH_STATUS,
  ITeamProps,
  Match,
  Table,
  TTableColumn,
  TTableRow
} from '@omegafox/components';
import match_explained from 'img/match_explained.png';

export const RulesPoints = () => {
  const teams = useSelector(
    (state: RootState) => state.team.teams
  ) as unknown as ITeam[];

  const columns: TTableColumn[] = [
    {
      id: 0,
      align: 'center',
      flex: 1,
      renderingFunction: () => (
        <div>
          <b>Acertos</b>
        </div>
      )
    },
    {
      id: 1,
      align: 'center',
      flex: 1,
      renderingFunction: () => (
        <div>
          <b>Pontos</b>
        </div>
      )
    }
  ];

  const rows: TTableRow[] = [
    [
      {
        id: 0,
        renderingFunction: () => <div className={styles.mint}>Acerto Total</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>5 * (Multiplicador)</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => (
          <div className={styles.blue}>Acerto Parcial</div>
        )
      },
      {
        id: 1,
        renderingFunction: () => <div>3 * (Multiplicador)</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => (
          <div className={styles.lightBlue}>Acerto Mínimo</div>
        )
      },
      {
        id: 1,
        renderingFunction: () => <div>2 * (Multiplicador)</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div className={styles.red}>Erro</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>0</div>
      }
    ]
  ];

  const multiplierColumns: TTableColumn[] = [
    {
      id: 0,
      align: 'left',
      flex: 3,
      renderingFunction: () => (
        <div>
          <b>Acertos</b>
        </div>
      )
    },
    {
      id: 1,
      align: 'center',
      flex: 1,
      renderingFunction: () => (
        <div>
          <b>Pontos</b>
        </div>
      )
    }
  ];

  const multiplierRows: TTableRow[] = [
    [
      {
        id: 0,
        renderingFunction: () => <div>Fase de Grupos</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>1</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>Oitavas de Final</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>2</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>Quartas de Final</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>3</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>Semifinais e Disputa de 3º Lugar</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>4</div>
      }
    ],
    [
      {
        id: 0,
        renderingFunction: () => <div>Final</div>
      },
      {
        id: 1,
        renderingFunction: () => <div>5</div>
      }
    ]
  ];

  const renderMatch = (ids: number[], scores: number[], bets: number[]) => {
    if (!teams || teams.length === 0) {
      return;
    }

    const homeTeam: ITeamProps = {
      id: teams[ids[0]].id,
      abbreviationEn: teams[ids[0]].abbreviationEn,
      align: 'left',
      bet: bets[0],
      colors: teams[ids[0]].colors,
      isEditable: false,
      logo: `https://assets.omegafox.me/img/countries_crests/${teams[
        ids[0]
      ].abbreviationEn.toLowerCase()}.png`,
      matchId: 0,
      name: teams[ids[0]].abbreviation,
      score: scores[0]
    };

    const awayTeam: ITeamProps = {
      id: teams[ids[1]].id,
      align: 'right',
      abbreviationEn: teams[ids[1]].abbreviationEn,
      bet: bets[1],
      colors: teams[ids[1]].colors,
      isEditable: false,
      logo: `https://assets.omegafox.me/img/countries_crests/${teams[
        ids[1]
      ].abbreviationEn.toLowerCase()}.png`,
      matchId: 0,
      name: teams[ids[1]].abbreviation,
      score: scores[1]
    };

    return (
      <div className={styles.match}>
        <Match
          isHideClock
          betValue={getBetPointsByScore(
            homeTeam.score as number,
            awayTeam.score as number,
            homeTeam.bet as number,
            awayTeam.bet as number
          )}
          id={0}
          isEditable={false}
          isExpandable={false}
          clock={{
            time: 0,
            status: FOOTBALL_MATCH_STATUS.FIRST_HALF
          }}
          timestamp={0}
          teams={[homeTeam, awayTeam]}
        />
      </div>
    );
  };
  const internalContainerClass = classNames(styles.internalContainer, {
    [styles.internalContainerDesktop]: !isMobile
  });

  const columnsContainerClass = classNames(styles.columnsContainer, {
    [styles.columnsContainerDesktop]: !isMobile,
    [styles.columnsContainerMobile]: isMobile
  });

  return (
    <div className={internalContainerClass}>
      <p className="align-center">
        <img alt="Match with explanation arrows" src={match_explained} />
      </p>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <Card
            title="Pontuação Base"
            isSelected
            renderingStatusFunction={() => (
              <div className={styles.column}>
                <Table isHeader columns={columns} rows={rows} />
              </div>
            )}
          />
        </div>
        <div className={styles.column}>
          <Card
            title="Multiplicador"
            isSelected
            renderingStatusFunction={() => (
              <div className={styles.column}>
                <Table
                  isHeader={false}
                  columns={multiplierColumns}
                  rows={multiplierRows}
                />
              </div>
            )}
          />
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p>
            <span className={styles.mint}>Acerto Total</span>: Acertar o{' '}
            <b>placar</b> do jogo.
            <br />
            <span className={styles.blue}>Acerto Parcial</span>: Acertar o{' '}
            <b>vencedor</b> do jogo e o número de gols de uma das equipes.
            <br />
            <span className={styles.lightBlue}>Acerto Mínimo</span>: Acertar o{' '}
            <b>vencedor</b> do jogo e <b>errar</b> o número de gols das duas
            equipes.
            <br />
            <span className={styles.red}>Erro</span>: Errar o vencedor resulta
            em 0 ponto para o participante.
          </p>
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.subTitle}>Pontuações Dinâmicas</p>
          <p className={styles.fullWidth}>
            Ao longo da competição, o valor das pontuações cresce de acordo com
            as fases. <br />
            Para entender melhor, veja os exemplos abaixo.
          </p>
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.subTitle}>Acerto Total</p>
          <div className={styles.matchContainer}>
            {renderMatch([0, 1], [3, 0], [3, 0])}
            <p>
              Se essa partida ocorrer na Fase de Grupos, o participante recebe{' '}
              <b>5 pontos</b> pelo{' '}
              <span className={styles.mint}>Acerto Total</span>.<br />
              <p>
                Nas Oitavas, recebe <b>10 pontos</b>.
                <br />
                Nas Quartas, recebe <b>15 pontos</b>.
                <br />
                Nas Semis, recebe <b>20 pontos</b>.
                <br />
                Na Final, recebe <b>25 pontos</b>.
              </p>
            </p>
          </div>
        </div>
        <div className={styles.column}>
          <p className={styles.subTitle}>Acerto Parcial</p>
          <div className={styles.matchContainer}>
            {renderMatch([8, 3], [0, 2], [0, 1])}
            <p>
              Se essa partida ocorrer na Fase de Grupos, o participante recebe{' '}
              <b>3 pontos</b> pelo{' '}
              <span className={styles.blue}>Acerto Parcial</span>.<br />
              <p>
                Nas Oitavas, recebe <b>6 pontos</b>.
                <br />
                Nas Quartas, recebe <b>9 pontos</b>.
                <br />
                Nas Semis, recebe <b>12 pontos</b>.
                <br />
                Na Final, recebe <b>15 pontos</b>.
              </p>
            </p>
          </div>
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.subTitle}>Acerto Mínimo</p>
          <div className={styles.matchContainer}>
            {renderMatch([4, 5], [1, 3], [0, 2])}
            <p>
              Se essa partida ocorrer na Fase de Grupos, o participante recebe{' '}
              <b>2 pontos</b> pelo{' '}
              <span className={styles.lightBlue}>Acerto Mínimo</span>.<br />
              <p>
                Nas Oitavas, recebe <b>4 pontos</b>.
                <br />
                Nas Quartas, recebe <b>6 pontos</b>.
                <br />
                Nas Semis, recebe <b>8 pontos</b>.
                <br />
                Na Final, recebe <b>12 pontos</b>.
              </p>
            </p>
          </div>
        </div>
        <div className={styles.column}>
          <p className={styles.subTitle}>Erro</p>
          <div className={styles.matchContainer}>
            {renderMatch([6, 9], [0, 0], [1, 0])}
            <p>
              Ao errar o vencedor de uma partida, o participante recebe{' '}
              <b>0 pontos</b> pelo <span className={styles.red}>Erro</span>.
            </p>
          </div>
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.subTitle}>Empate</p>
          <p className={styles.fullWidth}>
            Caso uma partida termine empatada, as únicas pontuações possíveis
            são: <span className={styles.red}>Erro</span> (se apostou em um
            vencedor), <span className={styles.lightBlue}>Acerto Mínimo</span>{' '}
            (se apostou em empate mas errou o placar) ou{' '}
            <span className={styles.mint}>Acerto Total</span>.
          </p>
        </div>
      </div>
      <div className={columnsContainerClass}>
        <div className={styles.column}>
          <p className={styles.subTitle}>Tempo Extra e Prorrogação</p>
          <p className={styles.fullWidth}>
            Se uma partida for para a prorrogação, será considerado o resultado
            ao fim do Tempo Extra.
            <br />
            As disputas de pênaltis <b>não serão consideradas</b>.
          </p>
        </div>
      </div>
    </div>
  );
};
