import React from 'react';
import { render } from '@testing-library/react';
import { Groups } from './Groups';

describe('Groups', () => {
  const renderComponent = () => render(<Groups />);

  it('should render', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
