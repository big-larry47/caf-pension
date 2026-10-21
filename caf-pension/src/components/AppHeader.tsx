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
          <img
            src="/caf-logo.svg"
            alt="Canadian Armed Forces / Forces armées canadiennes"
            style={{
              height: '36px',
              width: 'auto',
              display: 'block',
              flexShrink: 0,
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))',
            }}
          />
          <div className="app-header__text">
            <span className="app-header__title">CAF Pension Centre</span>
            <span className="app-header__subtitle">Online pension application</span>
          </div>
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
