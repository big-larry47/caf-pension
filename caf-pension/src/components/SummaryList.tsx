import React from 'react';

export interface SummaryListItem {
  label: string;
  value: React.ReactNode;
  action?: {
    text: string;
    href?: string;
    onClick?: () => void;
    visuallyHiddenText?: string;
  };
  mutedActionText?: string;
}

interface SummaryListProps {
  items: SummaryListItem[];
  style?: React.CSSProperties;
}

export const SummaryList: React.FC<SummaryListProps> = ({ items, style }) => {
  return (
    <dl
      className="summary-list card"
      style={{ padding: 0, overflow: 'hidden', ...style }}
    >
      {items.map((item, idx) => (
        <div key={idx} className="summary-list__row">
          <dt className="summary-list__label">{item.label}</dt>
          <dd className="summary-list__value">{item.value}</dd>
          <dd className="summary-list__action">
            {item.action ? (
              <a
                href={item.action.href || '#'}
                onClick={(e) => {
                  if (item.action?.onClick) {
                    e.preventDefault();
                    item.action.onClick();
                  } else if (!item.action?.href) {
                    e.preventDefault();
                  }
                }}
              >
                {item.action.text}
                {item.action.visuallyHiddenText && (
                  <span className="sr-only">
                    {' '}
                    {item.action.visuallyHiddenText}
                  </span>
                )}
              </a>
            ) : item.mutedActionText ? (
              <span className="summary-list__action--muted">
                {item.mutedActionText}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
};
