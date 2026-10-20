import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  style?: React.CSSProperties;
  as?: 'section' | 'div';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padded = false,
  style,
  as: Component = 'section',
}) => {
  const classes = `card ${padded ? 'card--padded' : ''} ${className}`.trim();
  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
};
