import React from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';

interface ActingForBannerProps {
  dateText?: string;
}

export const ActingForBanner: React.FC<ActingForBannerProps> = ({ dateText }) => {
  const { state } = useApplication();
  const token = state.invite.token || 'demo-token';
  const memberName = mockData.personal.fullName;
  const roleTitle =
    state.guardianProfile.authorityType === 'poa'
      ? 'Power of Attorney'
      : state.guardianProfile.authorityType === 'guardian'
      ? 'Court-Appointed Guardian'
      : state.guardianProfile.authorityType === 'trustee'
      ? 'Trustee or Committee'
      : 'Legal Representative';

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          You are acting for <b>{mockData.beneficiary.fullName}</b> (daughter & beneficiary of the late <b>{memberName}</b>)
          {dateText ? ` · ${dateText}` : ` as ${roleTitle}`}
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <Link
            to={`/g/${token}/step/3`}
            style={{
              fontWeight: 700,
              color: '#0B5CAD',
              textDecoration: 'underline',
              fontSize: '14px',
            }}
          >
            ★ Step 3: Benefit Plan
          </Link>
          <span style={{ color: '#94A3B8' }}>·</span>
          <Link
            to={`/g/${token}/deposit`}
            style={{
              fontWeight: 700,
              color: '#0B5CAD',
              textDecoration: 'underline',
              fontSize: '14px',
            }}
          >
            Step 6: Bank Deposit
          </Link>
        </div>
      </div>
    </div>
  );
};
