import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { Card } from '../components/Card';
import { HelpCard } from '../components/HelpCard';
import { StepLayout } from '../components/StepLayout';
import { InviteTracker } from '../components/InviteTracker';

export const HubPage: React.FC = () => {
  const { state, setInviteStatus } = useApplication();
  const navigate = useNavigate();
  const [resendToast, setResendToast] = useState(false);

  useEffect(() => {
    document.title = 'Application overview - CAF Pension Centre';
  }, []);

  const inviteActive =
    state.invite.status === 'sent' ||
    state.invite.status === 'opened' ||
    state.invite.status === 'verified';

  const guardianName = state.invite.guardian.fullName || 'Sarah Villa';
  const guardianRoleText =
    state.invite.guardian.role === 'poa'
      ? 'Power of attorney'
      : state.invite.guardian.role === 'guardian'
      ? 'Court-appointed guardian'
      : state.invite.guardian.role === 'trustee'
      ? 'Trustee or committee'
      : 'Legal representative';

  const handleResend = () => {
    setResendToast(true);
    setTimeout(() => setResendToast(false), 3000);
  };

  const handleCancelAndDoMyself = (e: React.MouseEvent) => {
    e.preventDefault();
    setInviteStatus('cancelled');
    navigate('/application/deposit/bank');
  };

  const allTasks = [
    {
      n: 1,
      name: 'Personal details',
      hint: inviteActive ? 'Completed by you' : 'Name, address, contact',
      href: '/application/personal',
    },
    {
      n: 2,
      name: 'Service and release',
      hint: inviteActive ? 'Completed by you' : 'Release date and service history',
      href: '/application/service',
    },
    {
      n: 3,
      name: 'Benefit option',
      hint: inviteActive ? 'Completed by you' : 'Choose how your pension is paid',
      href: '/application/benefit',
    },
    {
      n: 4,
      name: 'Family and beneficiaries',
      hint: inviteActive ? 'Completed by you' : 'Spouse and death benefit',
      href: '/application/family',
    },
    {
      n: 5,
      name: 'Deductions and tax',
      hint: inviteActive ? 'Completed by you' : 'Tax credits and insurance',
      href: '/application/deductions',
    },
    {
      n: 6,
      name: 'Direct deposit',
      hint: inviteActive
        ? 'Your guardian will complete this'
        : 'Where we send your payments',
      href: inviteActive ? '#' : '/application/deposit',
    },
    {
      n: 7,
      name: 'Review and submit',
      hint: inviteActive
        ? 'Your guardian will complete this'
        : 'Check your application and sign',
      href: inviteActive ? '#' : '/application/review',
    },
  ];

  const completedCount = state.completedSteps.length;

  if (inviteActive) {
    return (
      <main className="container container--wide">
        <p style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--color-muted)' }}>
          Application reference {mockData.applicationRef} · Service number{' '}
          {state.serviceNumber || mockData.serviceNumber}
        </p>
        <h1 style={{ margin: '0 0 20px', fontSize: '34px', lineHeight: 1.2 }}>
          Your pension application
        </h1>

        <div
          role="status"
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
            background: 'var(--color-warning-bg)',
            border: '2px solid var(--color-warning-border)',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '28px',
          }}
        >
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flex: 'none', marginTop: '2px' }}
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <div>
            <b style={{ fontSize: '19px' }}>
              Waiting for {guardianName} to finish your application
            </b>
            <br />
            <span style={{ fontSize: '16px', color: 'var(--color-ink-2)' }}>
              We sent them a link on {state.invite.sentAt}. It works until{' '}
              <b>{state.invite.expiresAt}</b>. We'll email you when they submit.
            </span>
          </div>
        </div>

        <StepLayout
          aside={
            <>
              <HelpCard title="If the link expires">
                <p>
                  Nothing is lost. Your answers stay saved. Send a new link, or
                  finish the bank details yourself.
                </p>
              </HelpCard>
              <HelpCard title="Mind your deadline">
                <p>
                  Your benefit option must still reach us by{' '}
                  <b>{mockData.deadline}</b>, even if your guardian hasn't
                  finished.
                </p>
              </HelpCard>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card padded>
              <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Invitation</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '14px 24px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                    Sent to
                  </div>
                  <div style={{ fontWeight: 600 }}>{guardianName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                    Role
                  </div>
                  <div style={{ fontWeight: 600 }}>{guardianRoleText}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                    Email
                  </div>
                  <div style={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                    {state.invite.guardian.email || 'sarah.villa@example.com'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                    Mobile
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    •••-•••-
                    {state.invite.guardian.mobile.slice(-4) || '1234'}
                  </div>
                </div>
              </div>

              <InviteTracker
                status={state.invite.status}
                sentDate={state.invite.sentAt}
              />

              {resendToast && (
                <div
                  role="status"
                  style={{
                    marginBottom: '14px',
                    padding: '10px 14px',
                    background: 'var(--color-success-bg)',
                    color: 'var(--color-success)',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  Link resent to {state.invite.guardian.email}!
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleResend}
                  style={{
                    minHeight: '44px',
                    padding: '0 18px',
                    background: '#FFFFFF',
                    color: 'var(--color-primary)',
                    font: 'inherit',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: '2px solid var(--color-primary)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Resend link
                </button>
                <Link
                  to="/application/deposit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: '44px',
                    padding: '0 18px',
                    boxSizing: 'border-box',
                    background: '#FFFFFF',
                    color: 'var(--color-primary)',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: '2px solid var(--color-primary)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                  }}
                >
                  Change person
                </Link>
                <a
                  href="#cancel"
                  onClick={handleCancelAndDoMyself}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: '44px',
                    padding: '0 6px',
                    fontSize: '16px',
                  }}
                >
                  Cancel and do it myself
                </a>
              </div>
            </Card>

            <section
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                }}
              >
                <h2 style={{ margin: 0, fontSize: '20px' }}>Application sections</h2>
                <span style={{ fontSize: '15px', color: 'var(--color-muted)' }}>
                  5 of 7 completed
                </span>
              </div>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {allTasks.map((t) => {
                  const isDone = t.n <= 5;
                  return (
                    <li
                      key={t.n}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        padding: '14px 24px',
                        borderBottom: '1px solid var(--color-divider)',
                      }}
                    >
                      <span style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link to={t.href} style={{ fontWeight: 600 }}>
                          {t.n}. {t.name}
                        </Link>
                        <span style={{ fontSize: '15px', color: 'var(--color-muted)' }}>
                          {t.hint}
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: isDone ? 'var(--color-success-bg)' : '#FFF4E5',
                          color: isDone ? 'var(--color-success)' : '#8A3608',
                        }}
                      >
                        {isDone ? 'Completed' : 'With guardian'}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p
                style={{
                  margin: 0,
                  padding: '16px 24px',
                  fontSize: '15px',
                  color: 'var(--color-muted)',
                }}
              >
                Steps 1 to 5 are locked while the invitation is open. To change
                an answer, cancel the invitation first.
              </p>
            </section>

            <p style={{ margin: 0, fontSize: '15px' }}>
              <Link to="/dev/invite-preview">
                See what {guardianName} receives
              </Link>
            </p>
          </div>
        </StepLayout>
      </main>
    );
  }

  // Standard Overview
  return (
    <main className="container container--wide">
      <p style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--color-muted)' }}>
        Application reference {mockData.applicationRef} · Service number{' '}
        {state.serviceNumber || mockData.serviceNumber}
      </p>
      <h1 className="page-title">Your pension application</h1>
      <p className="page-lead">
        Complete the application in order. Everything is saved as you go, so you
        can stop and come back.
      </p>

      <StepLayout
        aside={
          <>
            <HelpCard title="What happens next">
              <p>
                Once all documents are in, the first payment is normally
                deposited within 45 calendar days of your retirement date.
              </p>
            </HelpCard>
            <HelpCard title="Need help?">
              <p>
                Call <b>1-800-267-0325</b> or{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  send a secure message
                </a>
                .
              </p>
            </HelpCard>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>
              From your Pension Benefit Options Statement
            </h2>
            <div className="stat-grid">
              <div>
                <div className="stat-grid__label">Release date</div>
                <div className="stat-grid__value">{mockData.releaseDate}</div>
              </div>
              <div>
                <div className="stat-grid__label">Pensionable service</div>
                <div className="stat-grid__value">
                  {mockData.pensionableServiceYears} years
                </div>
              </div>
              <div>
                <div className="stat-grid__label">Choose your option by</div>
                <div className="stat-grid__value stat-grid__value--accent">
                  {mockData.deadline}
                </div>
              </div>
            </div>
            <p style={{ margin: '16px 0 0', fontSize: '15px' }}>
              <a href="#" onClick={(e) => e.preventDefault()}>
                View your full Options Statement (PDF)
              </a>
            </p>
          </Card>

          <section className="hub-tasks">
            <div className="hub-tasks__header">
              <h2>Application sections</h2>
              <span>{completedCount} of 7 completed</span>
            </div>
            <ol className="hub-tasks__list">
              {allTasks.map((t) => {
                const isCompleted = state.completedSteps.includes(t.n);
                const meta = state.sectionMeta[t.n];
                const byGuardian = meta?.completedBy === 'guardian';

                return (
                  <li key={t.n} className="hub-tasks__item">
                    <span className="hub-tasks__item-left">
                      <Link to={t.href}>
                        {t.n}. {t.name}
                      </Link>
                      <span>
                        {byGuardian
                          ? `Completed by ${guardianName}`
                          : isCompleted
                          ? 'Completed by you'
                          : t.hint}
                      </span>
                    </span>
                    <span
                      className="hub-tasks__pill"
                      style={
                        isCompleted
                          ? {
                              background: 'var(--color-success-bg)',
                              color: 'var(--color-success)',
                            }
                          : undefined
                      }
                    >
                      {isCompleted ? 'Completed' : 'Not started'}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <div>
            <Link
              to="/application/personal"
              className="btn btn--primary"
              style={{ padding: '0 32px' }}
            >
              {completedCount === 0 ? 'Start application' : 'Continue application'}
            </Link>
          </div>
        </div>
      </StepLayout>
    </main>
  );
};
