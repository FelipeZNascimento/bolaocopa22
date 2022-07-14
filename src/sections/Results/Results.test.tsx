import React from 'react';
import { render } from '@testing-library/react';
import { Results } from './Results';

describe('Results', () => {
  const renderComponent = () => render(<Results />);

  it('should render', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
