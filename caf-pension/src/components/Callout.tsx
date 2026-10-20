import React from 'react';

interface CalloutProps {
  variant?: 'warning' | 'info' | 'success' | 'error';
  children: React.ReactNode;
  role?: 'note' | 'alert' | 'status';
  style?: React.CSSProperties;
}

export const Callout: React.FC<CalloutProps> = ({
  variant = 'info',
  children,
  role = 'note',
  style,
}) => {
  return (
    <div
      role={role}
      className={`callout callout--${variant}`}
      style={style}
    >
      {children}
    </div>
  );
};
