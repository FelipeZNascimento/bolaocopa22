import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Navbar as TopNav,
  Sidenav,
  StatusBadge,
  TNavbarButton,
  Tooltip
} from '@omegafox/components';
import { LoginModal, UserModal } from '../index';

// Redux
import { useSelector } from 'react-redux';

// Store
import type { RootState } from 'store/index';
import { TUser } from 'store/user/types';

// Styles and images
import logo from 'img/spinner.png';
import styles from './Navbar.module.scss';

// Constants
import ROUTES from 'constants/routes';
import { navbarButtons, loginButton } from 'constants/navbarButtons';

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
      return [
        {
          id: 1,
          text: '',
          url: '',
          renderingFunction: renderSocialMediaButtons
        },
        { ...loginButton, renderingFunction: renderLoginButton }
      ];
    }

    return [
      {
        id: 1,
        text: '',
        url: '',
        renderingFunction: renderSocialMediaButtons
      },
      { ...loginButton, renderingFunction: renderUserButton }
    ];
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
      <div className={styles.socialMediaContainerMobile}>
        {isMobile && renderSocialMediaButtons()}
        <Button
          icon={<FontAwesomeIcon className={styles.iconGrey} icon={faUser} />}
          variant="primary"
          onClick={handleModalOpen}
        >
          {renderStatusBadge()}&nbsp;
          {loggedUser?.nickname}
        </Button>
      </div>
    );
  };

  const renderIcon = () => {
    return <FontAwesomeIcon className={styles.icon} icon={faBars} />;
  };

  const renderStatusBadge = () => {
    return <StatusBadge color={loggedUser ? 'green' : 'grey'} />;
  };

  const renderSocialMediaButtons = () => {
    return (
      <div>
        <Tooltip text="Grupo do Bolão no Telegram">
          <a href="https://t.me/+rVP220dgf2o0ZDJh">
            <img
              alt="Telegram Icon"
              height={30}
              src="https://assets.omegafox.me/img/social_icons/telegram.png"
            />
          </a>
        </Tooltip>
        &nbsp;
        <Tooltip text="Grupo do Bolão no WhatsApp">
          <a href="https://chat.whatsapp.com/7RkUEwV0fcaJT4TNuzklFN">
            <img
              alt="WhatsApp Icon"
              height={30}
              src="https://assets.omegafox.me/img/social_icons/whatsapp.png"
            />
          </a>
        </Tooltip>
      </div>
    );
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
