import React from 'react';
import { Link } from 'react-router-dom';

interface SeniorGuideBannerProps {
  token: string;
  currentStep: number;
}

export const SeniorGuideBanner: React.FC<SeniorGuideBannerProps> = ({
  token,
  currentStep,
}) => {
  return (
    <div
      role="region"
      aria-label="Help for guardian"
      style={{
        background: '#EBF3FA',
        border: '2px solid #0B5CAD',
        borderRadius: '12px',
        padding: '22px 24px',
        marginBottom: '28px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#0B5CAD',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0,
            marginTop: '2px',
          }}
          aria-hidden="true"
        >
          ℹ️
        </div>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: '0 0 6px',
              fontSize: '22px',
              fontWeight: 700,
              color: '#0B335E',
              lineHeight: 1.3,
            }}
          >
            {currentStep === 3
              ? 'Step 3: Choose Jenny’s survivor benefit option'
              : 'Welcome! Here are your tasks for Jenny Villa'}
          </h2>

          <p
            style={{
              margin: '0 0 14px',
              fontSize: '17px',
              lineHeight: 1.6,
              color: '#1E293B',
            }}
          >
            {currentStep === 3
              ? 'As legal guardian, select whether Jenny receives guaranteed monthly payments or a single lump sum. Official casualty records for Steps 1, 2, 4, and 5 are already locked in.'
              : 'The military service records (steps 1, 2, 4, and 5) are already approved from official casualty files.'}
          </p>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '8px',
              padding: '14px 18px',
              border: '1px solid #C9D6E6',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '17px', color: '#0F172A', marginBottom: '6px' }}>
              Your tasks as legal guardian:
            </div>
            <ul style={{ margin: 0, paddingLeft: '22px', fontSize: '16px', color: '#334155', lineHeight: 1.6 }}>
              <li>
                <strong>Step 3 {currentStep === 3 ? '(Current)' : ''}:</strong> Choose Jenny's survivor benefit (Monthly annuity or lump-sum)
              </li>
              <li>
                <strong>Step 6:</strong> Enter the bank wire account where payments should be deposited
              </li>
              <li>
                <strong>Step 7:</strong> Type your name to sign and finish
              </li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            {currentStep !== 3 && (
              <Link
                to={`/g/${token}/step/3`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#0B5CAD',
                  color: '#FFFFFF',
                  padding: '12px 22px',
                  fontSize: '17px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 4px rgba(11, 92, 173, 0.3)',
                }}
              >
                Go to Step 3: Benefit Choice ➔
              </Link>
            )}

            <Link
              to={`/g/${token}/deposit`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: currentStep === 3 ? '#0B5CAD' : '#F1F5F9',
                color: currentStep === 3 ? '#FFFFFF' : '#0B5CAD',
                padding: '12px 22px',
                fontSize: '17px',
                fontWeight: 700,
                borderRadius: '8px',
                textDecoration: 'none',
                border: currentStep === 3 ? 'none' : '1px solid #CBD5E1',
                boxShadow: currentStep === 3 ? '0 2px 4px rgba(11, 92, 173, 0.3)' : 'none',
              }}
            >
              {currentStep === 3 ? 'Skip to Bank Details (Step 6) ➔' : 'Go to Bank Details (Step 6) ➔'}
            </Link>

            <span style={{ fontSize: '15px', color: '#64748B' }}>
              (Or review the records below at your own pace)
            </span>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #DCE5EE', fontSize: '15px', color: '#475569' }}>
            📞 Need help over the phone? Call toll-free <strong>1-800-267-0325</strong> (Mon–Fri, 8 AM to 4 PM).
          </div>
        </div>
      </div>
    </div>
  );
};
