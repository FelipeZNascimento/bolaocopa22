import React from 'react';
import { render, screen } from '@testing-library/react';
import { Home } from './Home';

describe('Home', () => {
  it('should render', () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it('renders learn react link', () => {
    render(<Home />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});
