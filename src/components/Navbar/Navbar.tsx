import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar as Nav, TNavbarButton } from '@omegafox/components';

import logo from 'img/spinner.png';
import ROUTES from 'constants/routes';

const navButtons = Object.entries(ROUTES).map(([_, obj]) => ({ ...obj }));

export const Navbar = () => {
  const navigate = useNavigate();
  const onNavClick = (navButton: TNavbarButton) => {
    navigate(navButton.url);
  };

  return (
    <Nav
      logo={logo}
      navbarButtons={navButtons}
      platform="copa"
      onClick={onNavClick}
    />
  );
};
