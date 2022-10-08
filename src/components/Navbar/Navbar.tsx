import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import {
  Button,
  Navbar as TopNav,
  Sidenav,
  StatusBadge,
  TNavbarButton
} from '@omegafox/components';
import { LoginModal, UserModal } from '../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';

import logo from 'img/spinner.png';
import ROUTES from 'constants/routes';
import { navbarButtons, loginButton } from 'constants/navbarButtons';
import styles from './Navbar.module.scss';
import classNames from 'classnames';

// Redux
import { useSelector } from 'react-redux';

// Store
import type { RootState } from 'store/index';
import { TUser } from 'store/user/types';

export const Navbar = () => {
  const [isSidenavOpen, setIsSidenavOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [selectedNavId, setSelectedNavId] = useState<number>(0);
  const { hash, pathname } = useLocation();

  const loginLoading = useSelector(
    (state: RootState) => state.user.loginLoading
  ) as boolean;

  const loggedUser = useSelector(
    (state: RootState) => state.user.loggedUser
  ) as unknown as TUser;

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

      if (hash.includes('#entrar')) {
        if (loggedUser) {
          setIsUserModalOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    }
  }, [hash, pathname]);

  const onModalOpen = (type: 'user' | 'login') => {
    document.body.classList.add('modal-open');
    if (type === 'login') {
      setIsLoginModalOpen(true);
    } else if (type === 'user') {
      setIsUserModalOpen(true);
    }
  };

  const onModalClose = () => {
    document.body.classList.remove('modal-open');
    navigate(pathname);
    setIsLoginModalOpen(false);
    setIsUserModalOpen(false);
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

  const mountUserSection = () => {
    if (!loggedUser) {
      return [{ ...loginButton, renderingFunction: renderLoginButton }];
    }

    return [{ ...loginButton, renderingFunction: renderUserButton }];
  };

  const renderLoginButton = () => {
    const handleModalOpen = () => {
      setIsSidenavOpen(false);
      onModalOpen('login');
    };

    return (
      <Button
        isDisabled={loginLoading}
        variant="primary"
        onClick={handleModalOpen}
      >
        {renderStatusBadge()}&nbsp; Entrar
      </Button>
    );
  };

  const renderUserButton = () => {
    const handleModalOpen = () => {
      setIsSidenavOpen(false);
      onModalOpen('user');
    };

    return (
      <Button
        icon={<FontAwesomeIcon className={styles.iconGrey} icon={faUser} />}
        variant="primary"
        onClick={handleModalOpen}
      >
        {renderStatusBadge()}&nbsp;
        {loggedUser?.nickname}
      </Button>
    );
  };

  const renderIcon = () => {
    return <FontAwesomeIcon className={styles.icon} icon={faBars} />;
  };

  const renderStatusBadge = () => {
    return <StatusBadge color={loggedUser ? 'green' : 'grey'} />;
  };

  const renderRight = () => {
    const iconClass = classNames({
      [styles.iconRed]: loggedUser,
      [styles.iconGrey]: !loggedUser
    });

    return <FontAwesomeIcon className={iconClass} icon={faUser} />;
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
          navbarRight={[
            {
              id: 0,
              text: '',
              url: '',
              renderingFunction: renderStatusBadge
            },
            {
              id: 1,
              text: '',
              url: '',
              renderingFunction: renderRight
            }
          ]}
          platform="copa"
          selectedId={0}
          onClick={onButtonClick}
        />
        <Sidenav
          isOpen={isSidenavOpen}
          renderBottom={loggedUser ? renderUserButton : renderLoginButton}
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
        navbarRight={mountUserSection()}
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
      <UserModal isOpen={isUserModalOpen} onClose={onModalClose} />
    </>
  );
};
