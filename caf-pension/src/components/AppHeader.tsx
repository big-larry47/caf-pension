import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const { resetState } = useApplication();
  const isStartPage = location.pathname === '/';

  const handleSignOut = () => {
    resetState();
  };

  return (
    <header className="app-header">
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
