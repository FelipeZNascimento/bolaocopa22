import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

// Components
import { Button, Loading, Modal } from '@omegafox/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

// Types & Images
import { IPlayer } from 'store/player/types';
import spinner from 'img/spinner.png';

// Styles
import styles from './PlayerModal.module.scss';

interface ISelectedPlayer {
  player: IPlayer;
  index: number | null;
}

interface IModalProps {
  selectedPlayer: ISelectedPlayer | null;
  isOpen: boolean;
  onChange?: ((newIndex: number) => void) | null;
  onClose: () => void;
}

export const PlayerModal = ({
  isOpen,
  selectedPlayer,
  onChange = null,
  onClose
}: IModalProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  if (!selectedPlayer) {
    return null;
  }

  const handleOnClose = () => {
    setIsImageLoaded(false);
    onClose();
  };

  const handleOnChange = (newIndex: number) => {
    setIsImageLoaded(false);
    onChange && onChange(newIndex);
  };

  const playerPictureClass = classNames({
    [styles.playerImageDesktop]: !isMobile,
    [styles.playerImageMobile]: isMobile
  });

  const playerBirthDate = new Date(selectedPlayer.player.birth);
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
    if (!selectedPlayer.player.idFifaPicture) {
      return null;
    }

    return (
      <>
        {!isImageLoaded && <Loading image={spinner} text='' />}
        <img
          className={playerPictureClass}
          style={isImageLoaded ? {} : { display: 'none' }}
          src={`https://digitalhub.fifa.com/transform/${selectedPlayer.player.idFifaPicture.toLowerCase()}/`}
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
        subtitle={`#${selectedPlayer.player.number} ${selectedPlayer.player.name}`}
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
                src={`https://assets.omegafox.me/img/positions/${selectedPlayer.player.position.abbreviation.toLowerCase()}.png`}
              /> {selectedPlayer.player.position.description}
            </p>
            <p><b>Camisa</b><br />{selectedPlayer.player.number}</p>
            <p><b>Nascimento</b><br />{formattedBirth}</p>
            <p><b>Altura</b><br />{selectedPlayer.player.height}</p>
            <p><b>Clube</b><br /><img
              className={styles.positionIcon}
              alt="Position icon"
              src={`https://flagcdn.com/h40/${selectedPlayer.player.club?.country.isoCode.toLowerCase()}.png`}
            />&nbsp;
              {selectedPlayer.player.club?.name}</p>
          </div>
        </div>
        {onChange && <div className={styles.buttonContainer}>
          <div className={styles.button}>
            <Button
              icon={<FontAwesomeIcon icon={faAnglesLeft} size="lg" />}
              isShadowed={false}
              size="small"
              variant="neutral"
              onClick={() => selectedPlayer.index !== null && handleOnChange(selectedPlayer.index - 1)}
            />
          </div>
          <div className={styles.button}>
            <Button
              icon={<FontAwesomeIcon icon={faAnglesRight} size="lg" />}
              isShadowed={false}
              size="small"
              variant="neutral"
              onClick={() => selectedPlayer.index !== null && handleOnChange(selectedPlayer.index + 1)}
            />
          </div>
        </div>}
      </Modal>
    </>
  );
};