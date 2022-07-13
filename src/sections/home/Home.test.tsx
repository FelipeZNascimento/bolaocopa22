import React from 'react';
import { render } from '@testing-library/react';
import { Home } from './Home';

describe('Home', () => {
  const renderComponent = ({}) => render(<Home />);

  it('should render', () => {
    const { container } = renderComponent({});
    expect(container).toMatchSnapshot();
  });
});
