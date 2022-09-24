import React from 'react';
import { render } from '@testing-library/react';
import { Ranking } from './Ranking';
import { tableConfig } from 'constants/mocks';

describe('Ranking', () => {
  const renderComponent = () =>
    render(
      <Ranking isHeader columns={tableConfig.columns} rows={tableConfig.rows} />
    );

  it('should render', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
