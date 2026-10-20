import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const { resetState } = useApplication();
  const isStartPage = location.pathname === '/';

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY <= 15) {
            // At the top of the page: always visible, remove shadow
            setIsVisible(true);
            setIsScrolled(false);
          } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
            // Scrolling down and past threshold: slide out of view
            setIsVisible(false);
            setIsScrolled(true);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up: reveal header
            setIsVisible(true);
            setIsScrolled(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    resetState();
  };

  const headerClass = `app-header ${!isVisible ? 'app-header--hidden' : ''} ${
    isScrolled ? 'app-header--scrolled' : ''
  }`.trim();

  return (
    <header className={headerClass}>
      <div className="app-header__inner">
        <div className="app-header__left">
          <span className="app-header__title">CAF Pension Centre</span>
          <span className="app-header__subtitle">Online pension application</span>
          <span className="app-header__pill">CONCEPT</span>
        </div>
        <div className="app-header__right">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Français
          </a>
          {!isStartPage && (
            <Link to="/" onClick={handleSignOut}>
              Sign out
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
