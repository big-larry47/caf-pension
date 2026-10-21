import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';

export const InvitePreviewPage: React.FC = () => {
  const { state } = useApplication();
  const token = state.invite.token || 'guardian-token';
  const guardianName = state.invite.guardian.fullName || 'Margaretha Byers';
  const memberName = mockData.personal.fullName;
  const guardianEmail = state.invite.guardian.email || 'margaretha.byers@example.com';
  const roleTitle =
    state.invite.guardian.role === 'poa'
      ? 'power of attorney'
      : state.invite.guardian.role === 'guardian'
      ? 'court-appointed guardian'
      : state.invite.guardian.role === 'trustee'
      ? 'trustee or committee'
      : 'legal representative';

  useEffect(() => {
    document.title = 'Guardian invitation preview - CAF Pension Centre';
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#E6EAEF',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-ink)',
        fontSize: '17px',
        lineHeight: 1.5,
      }}
    >
      <main
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          padding: '48px 24px 64px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: '999 1 560px', minWidth: 0 }}>
          <p
            style={{
              margin: '0 0 10px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--color-muted)',
            }}
          >
            EMAIL TO THE GUARDIAN
          </p>
          <article
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(20, 38, 60, 0.12)',
            }}
          >
            <div
              style={{
                padding: '16px 28px',
                borderBottom: '1px solid var(--color-divider)',
                fontSize: '15px',
                color: 'var(--color-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span>
                <b style={{ color: 'var(--color-ink)' }}>From:</b> CAF Pension
                Centre &lt;support@cafpension.site&gt;
              </span>
              <span>
                <b style={{ color: 'var(--color-ink)' }}>To:</b> {guardianEmail}
              </span>
              <span>
                <b style={{ color: 'var(--color-ink)' }}>Subject:</b>{' '}
                {memberName} — CAF Pension Representative Package & Instructions
              </span>
            </div>
            <div
              style={{
                background: 'var(--color-ink)',
                color: '#FFFFFF',
                padding: '16px 28px',
                fontWeight: 700,
              }}
            >
              CAF Pension Centre
            </div>
            <div style={{ padding: '28px' }}>
              <p style={{ margin: '0 0 16px' }}>Hello {guardianName},</p>
              <p style={{ margin: '0 0 16px' }}>
                <b>{memberName}</b> has designated you to assist as their{' '}
                <b>guardian / representative</b> for their Canadian Armed Forces pension benefit.
              </p>
              <p style={{ margin: '0 0 8px' }}>How to complete the process:</p>
              <ul style={{ margin: '0 0 24px', paddingLeft: '22px' }}>
                <li>Confirm who you are by answering a couple of security questions</li>
                <li>Download your pre-filled official <b>Form CF-FC 2489</b> (PDF)</li>
                <li>Follow the on-screen instructions to email your completed form and ID to <b>support@cafpension.site</b></li>
              </ul>
              <Link
                to={`/g/${token}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: '52px',
                  padding: '0 32px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderRadius: '6px',
                }}
              >
                Access Pension Form Package &rarr;
              </Link>
              <div style={{ marginTop: '16px', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--color-muted)' }}>Direct PDF download: </span>
                <a
                  href="/CF-FC-2489-Guardian-Representative-Form.pdf"
                  download="CF-FC-2489-Guardian-Representative-Form.pdf"
                  style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'underline' }}
                >
                  📥 Download Form CF-FC 2489 (.pdf)
                </a>
              </div>
              <p
                style={{
                  margin: '20px 0 0',
                  fontSize: '15px',
                  color: 'var(--color-muted)',
                }}
              >
                This link is for you only and works until{' '}
                <b style={{ color: 'var(--color-ink)' }}>
                  {state.invite.expiresAt}
                </b>
                .
              </p>
              <div
                style={{
                  marginTop: '24px',
                  padding: '16px 18px',
                  background: 'var(--color-bg)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: 'var(--color-ink-2)',
                }}
              >
                We never ask for passwords or bank details by email or text.
                Didn't expect this message? Don't open the link. Call us at{' '}
                <b>1-800-267-0325</b>.
              </div>
            </div>
          </article>
        </div>

        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <p
            style={{
              margin: '0 0 10px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--color-muted)',
            }}
          >
            TEXT MESSAGE
          </p>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 2px rgba(20, 38, 60, 0.12)',
            }}
          >
            <div
              style={{
                background: 'var(--color-info-bg)',
                borderRadius: '14px 14px 14px 4px',
                padding: '12px 14px',
                fontSize: '15px',
              }}
            >
              CAF Pension Centre: {memberName} asked you to finish their pension
              application. We emailed you a link. Your security access code is: <b>842019</b>.
            </div>
          </div>
          <p
            style={{
              margin: '20px 0 0',
              fontSize: '15px',
              color: 'var(--color-muted)',
            }}
          >
            The email carries the link and the text carries the code, so someone
            needs both the guardian's inbox and phone to get in.
          </p>
        </div>
      </main>
    </div>
  );
};
