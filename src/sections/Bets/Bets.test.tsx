import React from 'react';
import { render } from '@testing-library/react';
import { Bets } from './Bets';

describe('Bets', () => {
  const renderComponent = () => render(<Bets />);

  it('should render', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
