import React from 'react';
import { Selector as SelectorOmegafox } from '@omegafox/components';

const mockItems = [
  {
    id: 0,
    value: 1,
    text: 'Rodada 1'
  },
  {
    id: 1,
    value: 2,
    text: 'Rodada 2'
  },
  {
    id: 2,
    value: 3,
    text: 'Rodada 3'
  },
  {
    id: 3,
    value: 4,
    text: 'Oitavas'
  },
  {
    id: 4,
    value: 5,
    text: 'Quartas'
  },
  {
    id: 5,
    value: 6,
    text: 'Semis'

  },
  {
    id: 6,
    value: 7,
    text: 'Final'
  }
];

interface ISelector {
  onClick: (itemId: number) => void;
  selectedRound: number | null;
}

export const Selector = ({ selectedRound, onClick }: ISelector) => {

  const handleClick = (itemId: number) => {
    onClick(itemId);
  };

  return (
    <SelectorOmegafox
      items={mockItems}
      selectedItem={selectedRound}
      onClick={handleClick}
    />
  );
};
