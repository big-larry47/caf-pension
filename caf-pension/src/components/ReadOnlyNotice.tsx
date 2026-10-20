import React from 'react';
import { mockData } from '../data/mockData';

interface ReadOnlyNoticeProps {
  completedDate?: string;
  memberName?: string;
}

export const ReadOnlyNotice: React.FC<ReadOnlyNoticeProps> = ({
  completedDate = '15 October 2026',
  memberName = mockData.personal.fullName,
}) => {
  return (
    <div
      role="note"
      style={{
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        background: '#EEF1F4',
        border: '1px solid #C9D1DB',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
      }}
    >
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4A5565"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flex: 'none', marginTop: '2px' }}
      >
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      <span>
        <b>View only.</b> Official CAF service & estate record for the late {memberName} (survivor benefits designated for {mockData.beneficiary.fullName}). You can check it, but not change it.
      </span>
    </div>
  );
};
