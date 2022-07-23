import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import {
  Button,
  Sidenav,
  Navbar as TopNav,
  TNavbarButton
} from '@omegafox/components';
import { LoginModal } from '../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import logo from 'img/spinner.png';
import ROUTES from 'constants/routes';
import { navbarButtons, loginButton } from 'constants/navbarButtons';
import styles from './Navbar.module.scss';

export const Navbar = () => {
  const [isSidenavOpen, setIsSidenavOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [selectedNavId, setSelectedNavId] = useState<number>(0);
  const { hash, pathname } = useLocation();

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
  }, [hash, pathname]);

  const onModalOpen = () => {
    document.body.classList.add('modal-open');
    setIsLoginModalOpen(true);
  };

  const onModalClose = () => {
    document.body.classList.remove('modal-open');
    navigate(pathname);
    setIsLoginModalOpen(false);
  };

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

  const renderLoginButton = () => {
    return (
      <Button variant="primary" onClick={onModalOpen}>
        Entrar
      </Button>
    );
  };

  const renderIcon = () => {
    return <FontAwesomeIcon className={styles.icon} icon={faBars} />;
  };

  const renderMobileView = () => {
    return (
      <>
        <TopNav
          logo={logo}
          navbarLeft={[
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
          renderBottom={renderLoginButton}
          selectedId={selectedNavId}
          sidenavButtons={navbarButtons}
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
        navbarLeft={navbarButtons}
        navbarRight={[{ ...loginButton, renderingFunction: renderLoginButton }]}
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
      <LoginModal isOpen={isLoginModalOpen} onClose={onModalClose} />
    </>
  );
};
