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

  // Backend interaction submission animation
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [submitStage, setSubmitStage] = useState<1 | 2 | 3>(1);

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
      setIsSubmittingApp(true);
      setSubmitStage(1);

      setTimeout(() => {
        setSubmitStage(2);
        setTimeout(() => {
          setSubmitStage(3);
          setTimeout(() => {
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
          }, 450);
        }, 500);
      }, 500);
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
        { k: 'Deceased member', v: 'The late General Kelvin Miller' },
        { k: 'Surviving beneficiary', v: 'Jenny Miller (Daughter, 20)' },
      ],
    },
    {
      n: 2,
      name: 'Service and release',
      href: `/g/${token}/step/2`,
      action: 'View',
      mine: false,
      rows: [
        { k: 'Date of death in service', v: '18 April 2025 (Damascus, Syria)' },
        { k: 'Service & age', v: '34 years · Passed away at age 65 (Reg #554321)' },
      ],
    },
    {
      n: 3,
      name: 'Benefit option',
      href: `/g/${token}/step/3`,
      action: 'Change',
      mine: true,
      rows: [
        {
          k: 'Option chosen',
          v:
            state.benefitOption === 'transfer'
              ? 'Lump-Sum Capital Death Benefit'
              : state.benefitOption === 'allowance'
              ? 'Annual Allowance (Reduced Monthly Income)'
              : 'Monthly Survivor Annuity for Jenny Miller',
        },
        {
          k: 'Benefit amount',
          v:
            state.benefitOption === 'transfer'
              ? '$1,240,500.00 one-time payout'
              : state.benefitOption === 'allowance'
              ? '$5,120.00 / month'
              : '$6,480.00 / month (indexed to inflation)',
        },
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
        { k: 'Designated beneficiary', v: 'Jenny Miller (Daughter, age 20)' },
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

  const chosenBenefitTitle =
    state.benefitOption === 'transfer'
      ? 'Lump-Sum Capital Death Benefit'
      : state.benefitOption === 'allowance'
      ? 'Annual Allowance (Reduced Monthly Income)'
      : 'Monthly Survivor Annuity for Jenny Miller';

  const chosenBenefitAmount =
    state.benefitOption === 'transfer'
      ? '$1,240,500.00 one-time payout'
      : state.benefitOption === 'allowance'
      ? '$5,120.00 / month'
      : '$6,480.00 / month (indexed to inflation)';

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
            Review your choices for Jenny and the official records before signing.
          </p>

          {/* Guardian's Benefit Choice (Step 3) - Spotlighted */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                Your Choice (Step 3)
              </span>
              <Link to={`/g/${token}/step/3`} style={{ fontSize: '15px', fontWeight: 600 }}>
                Edit benefit choice
              </Link>
            </div>
            <section
              style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '2px solid var(--color-primary)',
                boxShadow: '0 2px 6px rgba(11, 92, 173, 0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: '#F0F7FF',
                  borderBottom: '1px solid #D0E4FA',
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: '19px', color: '#0B335E' }}>
                    Jenny’s Survivor Benefit Plan
                  </h2>
                  <span style={{ fontSize: '14px', color: '#475569' }}>
                    Payout option selected by you as legal guardian
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: '#E9F5EE',
                    color: '#1F6F4A',
                  }}
                >
                  ✓ Chosen
                </span>
              </div>
              <dl style={{ margin: 0, padding: '12px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '16px' }}>
                  <dt style={{ color: 'var(--color-muted)' }}>Selected option</dt>
                  <dd style={{ margin: 0, fontWeight: 700 }}>
                    {chosenBenefitTitle}
                  </dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '16px' }}>
                  <dt style={{ color: 'var(--color-muted)' }}>Payment amount</dt>
                  <dd style={{ margin: 0, fontWeight: 700, color: '#0B5CAD' }}>
                    {chosenBenefitAmount}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          {/* Guardian's Direct Deposit Card (Step 6) - Highlighted */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                Your Part (Step 6)
              </span>
              <Link to={`/g/${token}/deposit`} style={{ fontSize: '15px', fontWeight: 600 }}>
                Edit bank details
              </Link>
            </div>
            <section
              style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '2px solid var(--color-primary)',
                boxShadow: '0 2px 6px rgba(11, 92, 173, 0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: '#F0F7FF',
                  borderBottom: '1px solid #D0E4FA',
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: '19px', color: '#0B335E' }}>
                    Direct Deposit Wire Account
                  </h2>
                  <span style={{ fontSize: '14px', color: '#475569' }}>
                    Where Jenny’s pension will be wired
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: '#E9F5EE',
                    color: '#1F6F4A',
                  }}
                >
                  ✓ Ready
                </span>
              </div>
              <dl style={{ margin: 0, padding: '12px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '16px' }}>
                  <dt style={{ color: 'var(--color-muted)' }}>Account holder</dt>
                  <dd style={{ margin: 0, fontWeight: 700 }}>
                    {state.guardianDeposit.holderName || guardianName}
                  </dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '16px' }}>
                  <dt style={{ color: 'var(--color-muted)' }}>Bank numbers</dt>
                  <dd style={{ margin: 0, fontWeight: 700 }}>
                    {state.guardianDeposit.account
                      ? `Transit ${state.guardianDeposit.transit || '12345'} · Inst. ${
                          state.guardianDeposit.institution || '003'
                        } · Acct ••••${state.guardianDeposit.account.slice(-4) || '4567'}`
                      : 'Transit 12345 · Inst. 003 · Acct ••••4567'}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          {/* Progressive disclosure for official records (Steps 1, 2, 4, 5) */}
          <details
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '20px',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '17px',
                color: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none',
              }}
            >
              <span>
                📋 Review Official Casualty Records (Steps 1, 2, 4, 5)
              </span>
              <span style={{ fontSize: '14px', color: '#0B5CAD', fontWeight: 600 }}>
                Tap to expand
              </span>
            </summary>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#64748B' }}>
                These records are already approved and locked from Department of National Defence casualty files:
              </p>
              {sections.filter(s => !s.mine).map((s) => (
                <div
                  key={s.n}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <b style={{ fontSize: '16px', color: '#1E293B' }}>{s.n}. {s.name}</b>
                    <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>
                      Official Record
                    </span>
                  </div>
                  <dl style={{ margin: 0 }}>
                    {s.rows.map((r, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '3px 0' }}>
                        <dt style={{ color: '#64748B' }}>{r.k}:</dt>
                        <dd style={{ margin: 0, fontWeight: 600, color: '#1E293B' }}>{r.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </details>

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
                Authorized representative for Jenny Miller
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
                  beneficiary Jenny Miller is true and complete.
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
                  I am submitting this application on behalf of Jenny Miller
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

            {isSubmittingApp && (
              <div
                className="fade-in-slide"
                style={{
                  marginTop: '28px',
                  background: '#F0F7FF',
                  border: '2px solid #0B5CAD',
                  borderRadius: '12px',
                  padding: '22px 24px',
                  boxShadow: '0 4px 14px rgba(11, 92, 173, 0.15)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <span className="spinner spinner--primary" style={{ width: '22px', height: '22px' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '19px', color: '#0B335E' }}>
                      Transmitting application to Government of Canada Pension Centre...
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
                      Please keep this window open while we secure the file.
                    </p>
                  </div>
                </div>

                <div className="indeterminate-progress" style={{ marginBottom: '16px', height: '6px' }}>
                  <div className="indeterminate-progress__bar" />
                </div>

                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 600 }}>
                    <span className="pop-in">✓</span> Verified legal electronic signature: {guardianName}
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: submitStage >= 2 ? '#166534' : '#64748B', fontWeight: submitStage >= 2 ? 600 : 400 }}>
                    <span>{submitStage >= 2 ? '✓' : '•'}</span> {submitStage >= 2 ? 'Encrypted direct wire mandate (Payments Canada EFT verified)' : 'Encrypting direct deposit wire mandate...'}
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: submitStage >= 3 ? '#166534' : '#64748B', fontWeight: submitStage >= 3 ? 600 : 400 }}>
                    <span>{submitStage >= 3 ? '✓' : '•'}</span> {submitStage >= 3 ? 'Survivor file recorded · Reference CAF-2026-849204 generated' : 'Transmitting to Matane Pension Centre casualty files...'}
                  </li>
                </ul>
              </div>
            )}

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
                  disabled={isSubmittingApp}
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
                    gap: '12px',
                    opacity: isSubmittingApp ? 0.9 : 1,
                    cursor: isSubmittingApp ? 'wait' : 'pointer',
                  }}
                >
                  {isSubmittingApp ? (
                    <>
                      <span className="spinner" />
                      Securing and submitting...
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">🔒</span> Submit Jenny's Application
                    </>
                  )}
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
