import React from 'react';
import { render } from '@testing-library/react';
import { Rules } from './Rules';

describe('Rules', () => {
  const renderComponent = () => render(<Rules />);

  it('should render', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
