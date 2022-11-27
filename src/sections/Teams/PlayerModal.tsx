import React, { useState } from 'react';
import classNames from 'classnames';
import { Loading, Modal } from '@omegafox/components';
import { IPlayer } from 'store/player/types';
import styles from './Teams.module.scss';
import spinner from 'img/spinner.png';
import { isMobile } from 'react-device-detect';

interface IModalProps {
  player: IPlayer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerModal = ({ isOpen, player, onClose }: IModalProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  if (!player) {
    return null;
  }

  const handleOnClose = () => {
    setIsImageLoaded(false);
    onClose();
  };

  const playerPictureClass = classNames({
    [styles.playerImageDesktop]: !isMobile,
    [styles.playerImageMobile]: isMobile
  });

  const playerBirthDate = new Date(player.birth);
  const yyyy = playerBirthDate.getFullYear();
  let mm = (playerBirthDate.getMonth() + 1).toString(); // Months start at 0!
  let dd = playerBirthDate.getDate().toString();
  if (dd.length === 1) {
    dd = '0' + dd;
  }
  if (mm.length === 1) {
    mm = '0' + mm;
  }

  const formattedBirth = `${dd}/${mm}/${yyyy}`;

  const renderPicture = () => {
    if (!player.idFifaPicture) {
      return null;
    }

    return (
      <>
        {!isImageLoaded && <Loading image={spinner} text='' />}
        <img
          className={playerPictureClass}
          style={isImageLoaded ? {} : { display: 'none' }}
          src={`https://digitalhub.fifa.com/transform/${player.idFifaPicture.toLowerCase()}/`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </>
    );
  };

  return (
    <>
      <Modal
        size="small"
        isOpen={isOpen}
        subtitle={`#${player.number} ${player.name}`}
        onClose={handleOnClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.pictureContainer}>
            {renderPicture()}
          </div>
          <div className={styles.detailsContainer}>
            <p>
              <b>Posição</b><br />
              <img
                className={styles.positionIcon}
                alt="Position icon"
                src={`https://assets.omegafox.me/img/positions/${player.position.abbreviation.toLowerCase()}.png`}
              /> {player.position.description}
            </p>
            <p><b>Camisa</b><br />{player.number}</p>
            <p><b>Nascimento</b><br />{formattedBirth}</p>
            <p><b>Altura</b><br />{player.height}</p>
            <p><b>Clube</b><br /><img
              className={styles.positionIcon}
              alt="Position icon"
              src={`https://flagcdn.com/h40/${player.club?.country.isoCode.toLowerCase()}.png`}
            />&nbsp;
              {player.club?.name}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};