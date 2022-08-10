import React from 'react';
import { render } from '@testing-library/react';
import { Extras } from './Extras';

describe('Extras', () => {
  const renderComponent = () => render(<Extras />);

  it('should render', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
