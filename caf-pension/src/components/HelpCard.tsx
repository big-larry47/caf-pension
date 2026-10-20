import React from 'react';

interface HelpCardProps {
  title: string;
  children: React.ReactNode;
}

export const HelpCard: React.FC<HelpCardProps> = ({ title, children }) => {
  return (
    <div className="help-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
};
