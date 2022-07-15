import React, { useEffect, useState } from 'react';
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
  const [selectedNavId, setSelectedNavId] = useState<number>(0);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/') {
      setSelectedNavId(ROUTES.HOME.id);
    } else {
      const routesArray = Object.values(ROUTES);
      const currentPath = routesArray.find((item) =>
        pathname.includes(item.url)
      );

      if (currentPath) {
        setSelectedNavId(currentPath.id);
      }
    }
  }, [pathname]);

  const navigate = useNavigate();
  const onButtonClick = (navButton: TNavbarButton) => {
    if (isMobile) {
      if (isSidenavOpen) {
        setIsSidenavOpen(false);
        navigate(navButton.url);
        setSelectedNavId(navButton.id);
      } else {
        setIsSidenavOpen(true);
      }
    } else {
      setSelectedNavId(navButton.id);
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
          selectedId={0}
          onClick={onButtonClick}
        />
        <Sidenav
          isOpen={isSidenavOpen}
          selectedId={selectedNavId}
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
        selectedId={selectedNavId}
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
