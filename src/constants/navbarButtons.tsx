import { TNavbarButton } from '@omegafox/components';

import ROUTES from 'constants/routes';

export const navbarButtons = Object.entries(ROUTES).map(([_, obj]) => ({
  ...obj
}));

export const loginButton: TNavbarButton = {
  id: 0,
  text: 'Entrar',
  url: '#entrar'
};
