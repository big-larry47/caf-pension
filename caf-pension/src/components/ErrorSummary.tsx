import React, { useEffect, useRef } from 'react';

export interface FormError {
  targetId: string;
  message: string;
}

interface ErrorSummaryProps {
  title?: string;
  errors: FormError[];
  focusOnMount?: boolean;
}

export const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  title = 'Check your bank details',
  errors,
  focusOnMount = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnMount && errors.length > 0 && containerRef.current) {
      containerRef.current.focus();
    }
  }, [errors, focusOnMount]);

  if (errors.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div
      ref={containerRef}
      role="alert"
      tabIndex={-1}
      className="error-summary"
      style={{ outline: 'none' }}
    >
      <h2>{title}</h2>
      <ul>
        {errors.map((err, i) => (
          <li key={i}>
            <a
              href={`#${err.targetId}`}
              onClick={(e) => handleClick(e, err.targetId)}
            >
              {err.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
