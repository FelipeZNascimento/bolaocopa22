import React, { useState } from 'react';
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
    text: '2a Fase'
  }
];

interface ISelector {
  onClick: (itemId: number) => void;
}

export const Selector = ({ onClick }: ISelector) => {
  const [selectedRound, setSelectedRound] = useState(1);

  const handleClick = (itemId: number) => {
    setSelectedRound(itemId);
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
