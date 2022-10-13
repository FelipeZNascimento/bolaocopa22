import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

// Components
import { Selector, TextContainer } from '@omegafox/components';
import { RulesBets } from './RulesBets';
import { RulesContact } from './RulesContact';
import { RulesExtras } from './RulesExtras';
import { RulesFaq } from './RulesFaq';
import { RulesPoints } from './RulesPoints';
import { RulesPrizes } from './RulesPrizes';
import { RulesSubscription } from './RulesSubscription';

// Services
import { stringNormalizer } from 'services/helpers';

// Styles and images
import styles from './Rules.module.scss';
import { RULES_SECTIONS } from 'constants/rulesSections';

export const Rules = () => {
  const [selectedSection, setSelectedSection] = useState(0);
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();

  const rulesSections = Object.entries(RULES_SECTIONS).map(([_, obj]) => ({
    ...obj
  }));

  useEffect(() => {
    const newSection = rulesSections.find(
      (item) => stringNormalizer(item.text) === hash.slice(1, hash.length)
    );

    if (newSection) {
      setSelectedSection(newSection.id);
    }
  }, [hash]);

  const handleButtonClick = (sectionId: number) => {
    const newSection = rulesSections.find((item) => item.id === sectionId);
    if (newSection) {
      const newPathname = `${pathname}#${stringNormalizer(newSection?.text)}`;
      navigate(newPathname);
    }

    setSelectedSection(sectionId);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case rulesSections[0].id: {
        return <RulesSubscription />;
      }
      case rulesSections[1].id: {
        return <RulesPrizes />;
      }
      case rulesSections[2].id: {
        return <RulesPoints />;
      }
      case rulesSections[3].id: {
        return <RulesBets />;
      }
      case rulesSections[4].id: {
        return <RulesExtras />;
      }
      case rulesSections[5].id: {
        return <RulesFaq />;
      }
      case rulesSections[6].id: {
        return <RulesContact />;
      }
    }

    return <p>Nope</p>;
  };

  const containerClass = classNames(styles.container, {
    [styles.containerMobile]: isMobile,
    [styles.containerDesktop]: !isMobile
  });

  return (
    <main className={styles.mainContainer}>
      <div className={containerClass}>
        <Selector
          items={rulesSections}
          selectedItem={selectedSection}
          size="big"
          onClick={handleButtonClick}
        />

        <TextContainer>{renderSection()}</TextContainer>
      </div>
    </main>
  );
};
