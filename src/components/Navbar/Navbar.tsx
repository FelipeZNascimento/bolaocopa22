import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { Sidenav, Navbar as TopNav, TNavbarButton } from '@omegafox/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import logo from 'img/spinner.png';
import ROUTES from 'constants/routes';

const navButtons = Object.entries(ROUTES).map(([_, obj]) => ({ ...obj }));

export const Navbar = () => {
  const [isSidenavOpen, setIsSidenavOpen] = useState<boolean>(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onButtonClick = (navButton: TNavbarButton) => {
    if (isMobile) {
      if (isSidenavOpen) {
        setIsSidenavOpen(false);
        navigate(navButton.url);
      } else {
        setIsSidenavOpen(true);
      }
    } else {
      navigate(navButton.url);
    }
  };

  const renderIcon = () => {
    return (
      <div>
        <FontAwesomeIcon icon={faBars} />
      </div>
    );
  };

  const renderMobileView = () => {
    return (
      <>
        <TopNav
          logo={logo}
          navbarButtons={[
            {
              id: 0,
              text: '',
              url: '',
              renderingFunction: renderIcon
            }
          ]}
          platform="copa"
          onClick={onButtonClick}
        />
        <Sidenav
          isOpen={isSidenavOpen}
          sidenavButtons={navButtons}
          onClick={onButtonClick}
          onClose={() => setIsSidenavOpen(false)}
        />
      </>
    );
  };

  const renderBrowserView = () => {
    return (
      <TopNav
        logo={logo}
        navbarButtons={navButtons}
        platform="copa"
        onClick={onButtonClick}
      />
    );
  };

  return (
    <>
      {isMobile && renderMobileView()}
      {!isMobile && renderBrowserView()}
    </>
  );
};
