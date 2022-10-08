import { TNavbarButton } from '@omegafox/components';

import ROUTES from 'constants/routes';

export const navbarButtons = Object.entries(ROUTES)
  .filter(([_, obj]) => !obj.isHidden)
  .map(([_, obj]) => ({
    ...obj
  }));

export const loginButton: TNavbarButton = {
  id: 0,
  text: 'Entrar',
  url: '#entrar'
};
