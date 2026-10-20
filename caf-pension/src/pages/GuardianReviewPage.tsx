import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';
import { GuardianStepper } from '../components/GuardianStepper';
import { StepLayout } from '../components/StepLayout';
import { HelpCard } from '../components/HelpCard';
import { SendBackDialog } from '../components/SendBackDialog';
import { ErrorSummary, FormError } from '../components/ErrorSummary';
import { sendNotificationEmail } from '../services/emailService';

export const GuardianReviewPage: React.FC = () => {
  const { state, updateState, markStepComplete } = useApplication();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  if (state.invite.status === 'submitted') {
    return <Navigate to={`/g/${token}/expired`} replace />;
  }

  if (state.invite.status !== 'verified') {
    return <Navigate to={`/g/${token}`} replace />;
  }

  const memberName = mockData.personal.fullName;
  const guardianName = state.guardianProfile.fullName || 'Sarah Villa';

  const [decl1, setDecl1] = useState(state.guardianDeclared1);
  const [decl2, setDecl2] = useState(state.guardianDeclared2);
  const [signature, setSignature] = useState(state.guardianSignature);
  const [sendBackOpen, setSendBackOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Guardian review and submit - CAF Pension Centre';
  }, []);

  const cleanSig = signature.trim().toLowerCase();
  const cleanExpected = guardianName.trim().toLowerCase();
  const sigMatches = cleanSig === cleanExpected && cleanSig.length > 0;

  const errors: FormError[] = [];
  if (submitted) {
    if (!decl1) errors.push({ targetId: 'decl1', message: 'Confirm the application review declaration' });
    if (!decl2) errors.push({ targetId: 'decl2', message: 'Confirm authority submission and mailing requirement' });
    if (!sigMatches) {
      errors.push({
        targetId: 'sig',
        message: `Type your full name (${guardianName}) to sign`,
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (decl1 && decl2 && sigMatches) {
      updateState({
        guardianDeclared1: true,
        guardianDeclared2: true,
        guardianSignature: signature,
        invite: {
          ...state.invite,
          status: 'submitted',
        },
      });
      markStepComplete(6, 'guardian');
      markStepComplete(7, 'guardian');

      sendNotificationEmail({
        type: 'submitted',
        recipientEmail: state.invite.guardian.email || 'guardian@example.com',
        guardianName,
        memberName: mockData.personal.fullName,
        refNumber: mockData.applicationRef || 'CAF-2026-849204',
      });

      navigate(`/g/${token}/submitted`);
    }
  };

  const sections = [
    {
      n: 1,
      name: 'Personal details',
      href: `/g/${token}/step/1`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Name', v: memberName },
        { k: 'Mailing address', v: 'Ottawa, Ontario' },
      ],
    },
    {
      n: 2,
      name: 'Service and release',
      href: `/g/${token}/step/2`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Release date', v: mockData.service.releaseDate },
        { k: 'Pensionable service', v: `${mockData.pensionableServiceYears} years` },
      ],
    },
    {
      n: 3,
      name: 'Benefit option',
      href: `/g/${token}/step/3`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Option', v: 'Deferred annuity' },
        { k: 'Estimate', v: mockData.benefitAmounts.deferredAnnuity },
      ],
    },
    {
      n: 4,
      name: 'Family and beneficiaries',
      href: `/g/${token}/step/4`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Spouse', v: 'Late' },
        { k: 'Death benefit', v: `Kept · ${state.beneficiaryName || 'Elena Villa'}` },
      ],
    },
    {
      n: 5,
      name: 'Deductions and tax',
      href: `/g/${token}/step/5`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Province', v: state.province },
        { k: 'Health care plan', v: state.joinPshcp ? 'Joined' : 'Not joined' },
      ],
    },
    {
      n: 6,
      name: 'Direct deposit',
      href: `/g/${token}/deposit`,
      action: 'Change',
      mine: true,
      rows: [
        {
          k: 'Account type',
          v:
            state.guardianDeposit.ownerType === 'trust'
              ? `Trust account for ${memberName}`
              : state.guardianDeposit.ownerType === 'joint'
              ? `Joint account with ${memberName}`
              : `${memberName}'s own account`,
        },
        {
          k: 'Bank numbers',
          v: state.guardianDeposit.account
            ? `Transit ${state.guardianDeposit.transit || '12345'} · Inst. ${
                state.guardianDeposit.institution || '003'
              } · Acct ••••${state.guardianDeposit.account.slice(-4) || '4567'}`
            : 'Transit 12345 · Inst. 003 · Acct ••••4567',
        },
      ],
    },
  ];

  return (
    <>
      <ActingForBanner />
      <GuardianStepper currentStep={7} />
      <main className="container container--wide">
        <StepLayout
          aside={
            <>
              <HelpCard title="After you submit">
                <p>
                  You and {memberName} both get a confirmation email. Your link
                  then stops working.
                </p>
              </HelpCard>
              <HelpCard title="Need help?">
                <p>
                  Call <b>1-800-267-0325</b>. Have {memberName}'s service number
                  ready.
                </p>
              </HelpCard>
            </>
          }
        >
          {errors.length > 0 && (
            <ErrorSummary title="Check your declaration" errors={errors} />
          )}

          <h1 className="page-title">Check the application, then submit</h1>
          <p className="page-lead">
            This is everything we'll send to the Pension Centre for {memberName}.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sections.map((s) => (
              <section
                key={s.n}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  border: s.mine
                    ? '2px solid var(--color-accent)'
                    : '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: '18px' }}>
                    {s.n}. {s.name}
                  </h2>
                  <span
                    style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: s.mine ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
                        color: s.mine ? '#8A3608' : 'var(--color-success)',
                      }}
                    >
                      {s.mine ? 'Completed by you' : `Completed by ${memberName}`}
                    </span>
                    <Link
                      to={s.href}
                      style={{ fontSize: '15px', fontWeight: 600 }}
                    >
                      {s.action}
                      <span className="sr-only"> {s.name}</span>
                    </Link>
                  </span>
                </div>
                <dl style={{ margin: 0, padding: '6px 20px 12px' }}>
                  {s.rows.map((r, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '12px',
                        padding: '6px 0',
                        fontSize: '16px',
                      }}
                    >
                      <dt style={{ color: 'var(--color-muted)' }}>{r.k}</dt>
                      <dd style={{ margin: 0, fontWeight: 600 }}>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}

            <section
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '16px 20px',
              }}
            >
              <h2 style={{ margin: '0 0 8px', fontSize: '18px' }}>
                Proof of authority
              </h2>
              <p style={{ margin: '0 0 4px', fontSize: '16px' }}>
                <b style={{ color: 'var(--color-success)' }}>Uploaded:</b>{' '}
                {state.guardianProfile.authorityFile?.name || 'power-of-attorney.pdf'}{' '}
                (4 pages)
              </p>
              <p style={{ margin: 0, fontSize: '16px' }}>
                <b style={{ color: '#8A3608' }}>Still needed by mail:</b> the
                original, a notarized copy or a certified true copy.
              </p>
            </section>
          </div>

          <p style={{ margin: '20px 0 0', fontSize: '16px' }}>
            Something wrong in steps 1 to 5?{' '}
            <a
              href="#sendback"
              onClick={(e) => {
                e.preventDefault();
                setSendBackOpen(true);
              }}
            >
              Send it back to {memberName} with a note
            </a>{' '}
            instead of submitting.
          </p>

          <form onSubmit={handleSubmit}>
            <section
              style={{
                marginTop: '28px',
                background: '#FFFFFF',
                border: '2px solid var(--color-ink)',
                borderRadius: '8px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '22px' }}>Declaration</h2>
              <label
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <input
                  id="decl1"
                  type="checkbox"
                  checked={decl1}
                  onChange={(e) => setDecl1(e.target.checked)}
                  style={{
                    width: '22px',
                    height: '22px',
                    margin: '2px 0 0',
                    accentColor: 'var(--color-primary)',
                    flex: 'none',
                  }}
                />
                <span>
                  I have reviewed this application. To the best of my knowledge,
                  the information given by {memberName} and by me is true and
                  complete.
                </span>
              </label>

              <label
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <input
                  id="decl2"
                  type="checkbox"
                  checked={decl2}
                  onChange={(e) => setDecl2(e.target.checked)}
                  style={{
                    width: '22px',
                    height: '22px',
                    margin: '2px 0 0',
                    accentColor: 'var(--color-primary)',
                    flex: 'none',
                  }}
                />
                <span>
                  I am submitting it as {memberName}'s power of attorney, and I
                  will mail proof of my authority.
                </span>
              </label>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 280px', maxWidth: '420px' }}>
                  <label
                    htmlFor="sig"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '2px',
                    }}
                  >
                    Type your full name to sign
                  </label>
                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: '15px',
                      color: 'var(--color-muted)',
                    }}
                  >
                    It must match: {guardianName}
                  </p>
                  <input
                    id="sig"
                    autoComplete="name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      height: '48px',
                      padding: '0 14px',
                      font: 'inherit',
                      border:
                        submitted && !sigMatches
                          ? '3px solid var(--color-error)'
                          : '2px solid var(--color-muted-2)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
                <div style={{ flex: '0 1 180px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                    Date
                  </div>
                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: '15px',
                      color: 'var(--color-muted)',
                    }}
                  >
                    Filled in for you
                  </p>
                  <div
                    style={{
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 600,
                    }}
                  >
                    15 October 2026
                  </div>
                </div>
              </div>
            </section>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '36px',
                paddingTop: '24px',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <Link
                to={`/g/${token}/deposit`}
                className="btn btn--secondary"
              >
                Back
              </Link>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Link to="/dev/invite-preview" className="link">
                  Save and exit
                </Link>
                <button type="submit" className="btn btn--primary">
                  Submit application
                </button>
              </div>
            </div>
          </form>
        </StepLayout>

        <SendBackDialog
          isOpen={sendBackOpen}
          onClose={() => setSendBackOpen(false)}
        />
      </main>
    </>
  );
};
