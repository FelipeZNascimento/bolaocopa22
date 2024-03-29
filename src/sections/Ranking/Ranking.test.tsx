import React from 'react';
import { render } from '@testing-library/react';
import { Ranking } from './Ranking';

describe('Ranking', () => {
  const renderComponent = () => render(<Ranking isHeader />);

  it('should render', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
