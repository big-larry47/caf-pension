import React from 'react';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';

interface ActingForBannerProps {
  dateText?: string;
}

export const ActingForBanner: React.FC<ActingForBannerProps> = ({ dateText }) => {
  const { state } = useApplication();
  const memberName = mockData.personal.fullName;
  const roleTitle =
    state.guardianProfile.authorityType === 'poa'
      ? 'power of attorney'
      : state.guardianProfile.authorityType === 'guardian'
      ? 'court-appointed guardian'
      : state.guardianProfile.authorityType === 'trustee'
      ? 'trustee or committee'
      : 'legal representative';

  return (
    <div
      style={{
        background: 'var(--color-warning-bg)',
        borderBottom: '1px solid var(--color-warning-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '10px 24px',
          fontSize: '15px',
        }}
      >
        You are acting for <b>Jenny Villa</b> (daughter & beneficiary of the late <b>General Felix Villa</b>)
        {dateText ? ` · ${dateText}` : ` as their ${roleTitle}`}
      </div>
    </div>
  );
};
