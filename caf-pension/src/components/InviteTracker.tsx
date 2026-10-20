import React from 'react';
import { InviteStatus } from '../context/ApplicationContext';

interface InviteTrackerProps {
  status: InviteStatus;
  sentDate?: string;
}

export const InviteTracker: React.FC<InviteTrackerProps> = ({
  status,
  sentDate = '15 October 2026',
}) => {
  // 4 stages: Link sent -> Opened -> Authority confirmed -> Submitted
  const getStageState = (index: number): 'done' | 'next' | 'todo' => {
    if (status === 'submitted') return 'done';
    if (status === 'verified') {
      if (index <= 2) return 'done';
      if (index === 3) return 'next';
      return 'todo';
    }
    if (status === 'opened') {
      if (index <= 1) return 'done';
      if (index === 2) return 'next';
      return 'todo';
    }
    if (status === 'sent' || status === 'none') {
      if (index === 0) return 'done';
      if (index === 1) return 'next';
      return 'todo';
    }
    return 'todo';
  };

  const stages = [
    { name: 'Link sent', when: sentDate },
    {
      name: 'Opened',
      when: status === 'opened' || status === 'verified' || status === 'submitted'
        ? sentDate
        : 'Not yet',
    },
    { name: 'Authority confirmed', when: '' },
    { name: 'Submitted', when: '' },
  ];

  return (
    <ol
      style={{
        listStyle: 'none',
        margin: '0 0 20px',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '8px',
      }}
    >
      {stages.map((st, i) => {
        const state = getStageState(i);
        const barColor =
          state === 'done'
            ? 'var(--color-success)'
            : state === 'next'
            ? 'var(--color-warning-border)'
            : 'var(--color-border)';

        return (
          <li
            key={st.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '14px',
              lineHeight: 1.3,
            }}
          >
            <span
              style={{
                display: 'block',
                height: '6px',
                borderRadius: '3px',
                background: barColor,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontWeight: state === 'todo' ? 500 : 600,
                color:
                  state === 'todo' ? 'var(--color-muted-2)' : 'var(--color-ink)',
              }}
            >
              {st.name}
            </span>
            {st.when && (
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--color-muted)',
                }}
              >
                {st.when}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
};
