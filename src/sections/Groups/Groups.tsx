import React from 'react';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

// Styles and images
import styles from './Groups.module.scss';

const groupsIdsSofascore = [3954, 3955, 3956, 3957, 3958, 3959, 3960, 3961];
export const Groups = () => {
  const renderGroup = (id: number) => {
    const contentClass = classNames(styles.content, {
      [styles.contentMobile]: isMobile
    });

    (function (el) {
      window.addEventListener('message', (event) => {
        if (event.origin.startsWith('https://www.sofascore')) {
          if (el && el.id === event.data.id) {
            el.style.height = event.data.height + 'px';
          }
        }
      });
    })(document.getElementById(`sofa-standings-embed-${id}-41087`));

    return (
      <div className={contentClass}>
        <iframe
          id={`sofa-standings-embed-${id}-41087`}
          width="100%"
          height="330"
          src={`https://www.sofascore.com/tournament/${id}/41087/standings/tables/embed`}
          frameBorder="0"
          scrolling="no"
        ></iframe>
        <div>
          Standings provided by{' '}
          <a target="_blank" rel="noreferrer" href="https://www.sofascore.com/">
            Sofascore
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {groupsIdsSofascore.map((item) => renderGroup(item))}
    </div>
  );
};
