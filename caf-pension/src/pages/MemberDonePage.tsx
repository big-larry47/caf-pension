import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockData } from '../data/mockData';

export const MemberDonePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Application submitted - CAF Pension Centre';
  }, []);

  return (
    <main className="container container--narrow">
      <div
        role="status"
        style={{
          background: 'var(--color-success)',
          color: '#FFFFFF',
          borderRadius: '10px',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <svg
          aria-hidden="true"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: 'block', margin: '0 auto 12px' }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M7 12.5l3.5 3.5L17 9" />
        </svg>
        <h1 style={{ margin: '0 0 8px', fontSize: '32px', lineHeight: 1.2 }}>
          Application submitted
        </h1>
        <p style={{ margin: 0, fontSize: '19px' }}>for Jenny Villa (surviving daughter of the late General Felix Villa)</p>
        <p style={{ margin: '16px 0 0', fontSize: '16px' }}>
          Reference number
          <br />
          <b style={{ fontSize: '24px', letterSpacing: '0.04em' }}>
            {mockData.applicationRef}
          </b>
        </p>
      </div>

      <p style={{ margin: '24px 0 0' }}>
        We've emailed a confirmation to you at {mockData.personal.email}. Your application is now with the Pension Centre.
      </p>

      <h2 style={{ margin: '32px 0 12px', fontSize: '24px' }}>What happens next</h2>
      <ol
        style={{
          margin: 0,
          paddingLeft: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <li>
          <b>We review your application and confirm your bank details.</b> We may
          call or message you if anything is unclear.
        </li>
        <li>
          <b>Payments start.</b> Once processing is complete, your first pension
          payment is normally deposited within 45 calendar days of your retirement date.
        </li>
      </ol>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: '32px',
        }}
      >
        <button
          type="button"
          onClick={() => alert('PDF download')}
          className="btn btn--secondary"
        >
          Download a copy (PDF)
        </button>
        <Link to="/" className="btn btn--primary">
          Back to start
        </Link>
      </div>

      <p
        style={{
          margin: '32px 0 0',
          fontSize: '15px',
          color: 'var(--color-muted)',
        }}
      >
        Questions? Call 1-800-267-0325 and give the reference number.
      </p>
    </main>
  );
};
