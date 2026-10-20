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
        { k: 'Deceased member', v: 'The late General Felix Villa' },
        { k: 'Surviving beneficiary', v: 'Jenny Villa (Daughter, 20)' },
      ],
    },
    {
      n: 2,
      name: 'Service and release',
      href: `/g/${token}/step/2`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Date of death in service', v: '15 October 2026 (Syria)' },
        { k: 'Service & age', v: '34 years · Passed away at age 68' },
      ],
    },
    {
      n: 3,
      name: 'Benefit option',
      href: `/g/${token}/step/3`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Option', v: 'Survivor & Child Dependent Annuity' },
        { k: 'Estimate for Jenny', v: mockData.benefitAmounts.deferredAnnuity },
      ],
    },
    {
      n: 4,
      name: 'Family and beneficiaries',
      href: `/g/${token}/step/4`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Marital status', v: 'Widowed (Spouse deceased)' },
        { k: 'Designated beneficiary', v: 'Jenny Villa (Daughter, age 20)' },
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
        { k: 'Health care plan', v: state.joinPshcp ? 'Joined (Family continuation)' : 'Not joined' },
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
            state.guardianDeposit.ownerType === 'guardian'
              ? `Your own personal account (${guardianName})`
              : state.guardianDeposit.ownerType === 'joint'
              ? `Joint or family account for Jenny Villa`
              : `Jenny Villa's personal account`,
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

          {/* Progressive disclosure: Steps 1-5 grouped inside a collapsible drawer so mobile guardians don't have to scroll through 5 screens */}
          <details
            style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              marginBottom: '18px',
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '16px 20px',
                fontSize: '17px',
                fontWeight: 600,
                color: '#0B5CAD',
                cursor: 'pointer',
                background: '#EEF4FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>📂 View Steps 1 to 5 (Approved Official Records on File)</span>
              <span style={{ fontSize: '13px', background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                5 Records Locked
              </span>
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
              {sections.slice(0, 5).map((s) => (
                <section
                  key={s.n}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 16px',
                      borderBottom: '1px solid var(--color-divider)',
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: '16px' }}>
                      {s.n}. {s.name}
                    </h2>
                    <Link to={s.href} style={{ fontSize: '14px', fontWeight: 600 }}>
                      View
                    </Link>
                  </div>
                  <dl style={{ margin: 0, padding: '6px 16px 10px' }}>
                    {s.rows.map((r, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                          gap: '8px',
                          padding: '4px 0',
                          fontSize: '15px',
                        }}
                      >
                        <dt style={{ color: 'var(--color-muted)' }}>{r.k}</dt>
                        <dd style={{ margin: 0, fontWeight: 600 }}>{r.v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </details>

          {/* Step 6 (Direct Deposit): Highlighted prominently */}
          {sections.slice(5).map((s) => (
            <section
              key={s.n}
              style={{
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '2px solid #0B5CAD',
                marginBottom: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  padding: '16px 20px',
                  background: '#F0F7FF',
                  borderBottom: '1px solid #D0E3F7',
                }}
              >
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0B5CAD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Your Provided Information
                  </span>
                  <h2 style={{ margin: '2px 0 0', fontSize: '20px', color: '#0B335E' }}>
                    6. {s.name}
                  </h2>
                </div>
                <Link
                  to={s.href}
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    background: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #0B5CAD',
                    textDecoration: 'none',
                  }}
                >
                  Change
                </Link>
              </div>
              <dl style={{ margin: 0, padding: '14px 20px' }}>
                {s.rows.map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '12px',
                      padding: '8px 0',
                      fontSize: '17px',
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
                Representative & Authority
              </h2>
              <p style={{ margin: '0 0 4px', fontSize: '16px' }}>
                <b style={{ color: 'var(--color-success)' }}>Status:</b>{' '}
                Authorized representative for Jenny Villa
              </p>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--color-muted)' }}>
                {state.guardianProfile.authorityFile?.name
                  ? `Document on file: ${state.guardianProfile.authorityFile.name}`
                  : 'No additional paperwork required unless requested by the Pension Centre.'}
              </p>
            </section>

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
              <h2 style={{ margin: 0, fontSize: '24px' }}>Declaration and Signature</h2>
              <label
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  fontSize: '18px',
                  lineHeight: 1.5,
                  cursor: 'pointer',
                }}
              >
                <input
                  id="decl1"
                  type="checkbox"
                  checked={decl1}
                  onChange={(e) => setDecl1(e.target.checked)}
                  style={{
                    width: '26px',
                    height: '26px',
                    margin: '3px 0 0',
                    accentColor: 'var(--color-primary)',
                    flex: 'none',
                  }}
                />
                <span>
                  I have reviewed this application. To the best of my knowledge,
                  the information on file for the late {memberName} and provided for
                  beneficiary Jenny Villa is true and complete.
                </span>
              </label>

              <label
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  fontSize: '18px',
                  lineHeight: 1.5,
                  cursor: 'pointer',
                }}
              >
                <input
                  id="decl2"
                  type="checkbox"
                  checked={decl2}
                  onChange={(e) => setDecl2(e.target.checked)}
                  style={{
                    width: '26px',
                    height: '26px',
                    margin: '3px 0 0',
                    accentColor: 'var(--color-primary)',
                    flex: 'none',
                  }}
                />
                <span>
                  I am submitting this application on behalf of Jenny Villa
                  (daughter of the late {memberName}).
                </span>
              </label>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
                <div style={{ flex: '1 1 320px', maxWidth: '460px' }}>
                  <label
                    htmlFor="sig"
                    style={{
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '18px',
                      marginBottom: '4px',
                    }}
                  >
                    Type your full name to sign
                  </label>
                  <p
                    style={{
                      margin: '0 0 10px',
                      fontSize: '16px',
                      color: 'var(--color-muted)',
                    }}
                  >
                    Expected name: <strong>{guardianName}</strong>{' '}
                    <button
                      type="button"
                      onClick={() => setSignature(guardianName)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '15px',
                        marginLeft: '8px',
                        fontWeight: 600,
                      }}
                    >
                      (Click here to fill automatically)
                    </button>
                  </p>
                  <input
                    id="sig"
                    autoComplete="name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      height: '54px',
                      padding: '0 16px',
                      font: 'inherit',
                      fontSize: '20px',
                      border:
                        submitted && !sigMatches
                          ? '3px solid var(--color-error)'
                          : '2px solid var(--color-muted-2)',
                      borderRadius: '8px',
                    }}
                  />
                </div>
                <div style={{ flex: '0 1 180px' }}>
                  <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
                    Date
                  </div>
                  <p
                    style={{
                      margin: '0 0 10px',
                      fontSize: '16px',
                      color: 'var(--color-muted)',
                    }}
                  >
                    Filled in for you
                  </p>
                  <div
                    style={{
                      height: '54px',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#334155',
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
                <Link to="/dev/invite-preview" className="link" style={{ fontSize: '17px' }}>
                  Save and exit
                </Link>
                <button
                  type="submit"
                  className="btn btn--primary"
                  style={{
                    minHeight: '56px',
                    padding: '0 36px',
                    fontSize: '20px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(11, 92, 173, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span aria-hidden="true">🔒</span> Submit Jenny's Application
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
