import React from 'react';

interface StepLayoutProps {
  children: React.ReactNode;
  aside?: React.ReactNode;
}

export const StepLayout: React.FC<StepLayoutProps> = ({ children, aside }) => {
  return (
    <div className="step-layout">
      <div className="step-layout__main">{children}</div>
      {aside && <aside className="step-layout__aside">{aside}</aside>}
    </div>
  );
};
