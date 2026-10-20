import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';
import { GuardianStepper } from '../components/GuardianStepper';
import { StepLayout } from '../components/StepLayout';
import { HelpCard } from '../components/HelpCard';
import { ChequeDiagram } from '../components/ChequeDiagram';
import { ErrorSummary, FormError } from '../components/ErrorSummary';

export const GuardianDepositPage: React.FC = () => {
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

  const [owner, setOwner] = useState<'guardian' | 'member' | 'joint' | 'trust'>(
    state.guardianDeposit.ownerType || 'guardian'
  );
  const [holder, setHolder] = useState(
    state.guardianDeposit.holderName || memberName
  );
  const [t, setT] = useState(state.guardianDeposit.transit || '');
  const [i, setI] = useState(state.guardianDeposit.institution || '');
  const [a, setA] = useState(state.guardianDeposit.account || '');
  const [c, setC] = useState(state.guardianDeposit.accountConfirm || '');
  const [authorized, setAuthorized] = useState(
    state.guardianDeposit.authorized ?? false
  );
  const [submitted, setSubmitted] = useState(state.guardianDeposit.submitted ?? false);

  useEffect(() => {
    document.title = 'Guardian bank details - CAF Pension Centre';
  }, []);

  const ownerOptions = [
    {
      id: 'guardian' as const,
      title: 'Your own personal bank account',
      hint: `Direct deposit into your personal account (${guardianName}) to manage for Jenny.`,
    },
    {
      id: 'member' as const,
      title: "Jenny Villa's personal account",
      hint: 'In Jenny Villa’s name only.',
    },
    {
      id: 'joint' as const,
      title: 'A joint, trust, or family account',
      hint: 'A joint account, informal trust, or family account held for Jenny.',
    },
  ];

  const holderHints: Record<string, string> = {
    guardian: `Your name: ${guardianName}`,
    member: `Jenny Villa's name`,
    joint: 'Both names or as written on the cheque/account',
    trust: `For example: ${guardianName} or Jenny Villa`,
  };

  const [depositStep, setDepositStep] = useState<1 | 2>(1);

  const tBad = !/^\d{5}$/.test(t);
  const iBad = !/^\d{3}$/.test(i);
  const aBad = !/^\d{7,12}$/.test(a);
  const cBad = !aBad && c !== a;

  const tErr = submitted && tBad;
  const iErr = submitted && iBad;
  const aErr = submitted && aBad;
  const cErr = submitted && cBad;

  const errors: FormError[] = [];
  if (submitted) {
    if (!owner) errors.push({ targetId: 'owner-member', message: 'Select whose account this is' });
    if (!holder.trim()) errors.push({ targetId: 'holder', message: 'Enter the account holder name' });
    if (depositStep === 2) {
      if (tErr) errors.push({ targetId: 'transit', message: 'Enter the 5-digit transit number' });
      if (iErr) errors.push({ targetId: 'inst', message: 'Enter the 3-digit institution number' });
      if (aErr) errors.push({ targetId: 'acct', message: 'Enter an account number of 7 to 12 digits' });
      if (cErr) errors.push({ targetId: 'acct2', message: 'The two account numbers do not match' });
      if (!authorized) errors.push({ targetId: 'auth-check', message: 'You must authorize the direct deposit' });
    }
  }

  const step1Valid = Boolean(owner && holder.trim());
  const isValid = !tBad && !iBad && !aBad && !cBad && holder.trim() && authorized;
  const showSuccess = submitted && isValid;
  const last4 = a.slice(-4);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holder.trim()) {
      setSubmitted(true);
      return;
    }
    setSubmitted(false);
    setDepositStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveAndReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (isValid) {
      updateState({
        guardianDeposit: {
          ownerType: owner,
          holderName: holder,
          transit: t,
          institution: i,
          account: a,
          accountConfirm: c,
          authorized,
          submitted: true,
        },
      });
      markStepComplete(6, 'guardian');
      navigate(`/g/${token}/review`);
    }
  };

  const fieldStyle = (isError: boolean): React.CSSProperties => ({
    width: '100%',
    boxSizing: 'border-box',
    height: '52px',
    padding: '0 14px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '20px',
    letterSpacing: '0.08em',
    color: '#14263C',
    background: '#FFFFFF',
    borderRadius: '6px',
    border: isError ? '3px solid #B42318' : '2px solid #5B6573',
  });

  return (
    <>
      <ActingForBanner />
      <GuardianStepper currentStep={6} />
      <main className="container container--wide">
        <StepLayout
          aside={
            <>
              <HelpCard title="Simple 2-part setup">
                <p>
                  Part 1: Who receives the pension.
                  <br />
                  Part 2: Bank numbers for the wire transfer.
                </p>
              </HelpCard>
              <HelpCard title="Saved as you go">
                <p>
                  Leave and come back anytime with your link before{' '}
                  {state.invite.expiresAt}.
                </p>
              </HelpCard>
            </>
          }
        >
          {errors.length > 0 && (
            <ErrorSummary title="Please check this section" errors={errors} />
          )}

          {/* Progressive sub-step header indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#E8F0FA',
              color: '#0B5CAD',
              fontWeight: 700,
              fontSize: '15px',
              padding: '6px 14px',
              borderRadius: '999px',
              marginBottom: '14px',
            }}
          >
            Part {depositStep} of 2 · {depositStep === 1 ? 'Account Ownership' : 'Bank Transfer Numbers'}
          </div>

          <h1 className="page-title">
            {depositStep === 1
              ? 'Whose account will receive Jenny Villa’s pension?'
              : 'Enter the bank numbers for direct wire transfer'}
          </h1>
          <p className="page-lead" style={{ fontSize: '18px', marginBottom: '24px' }}>
            {depositStep === 1
              ? 'Select whose name the account is under. You can use your personal account, Jenny’s account, or a family account.'
              : 'Payments are wired directly into this account each month. No paper cheques or uploads needed.'}
          </p>

          {depositStep === 1 && (
            <form onSubmit={handleStep1Next}>
              <fieldset style={{ border: 0, margin: '0 0 24px', padding: 0 }}>
                <legend
                  style={{
                    fontWeight: 700,
                    fontSize: '20px',
                    marginBottom: '12px',
                    padding: 0,
                  }}
                >
                  Choose account holder:
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ownerOptions.map((opt) => (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'flex-start',
                        padding: '16px 20px',
                        background: '#FFFFFF',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border:
                          owner === opt.id
                            ? '3px solid #0B5CAD'
                            : '2px solid #CBD5E1',
                        boxShadow: owner === opt.id ? '0 2px 8px rgba(11, 92, 173, 0.15)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="radio"
                        id={`owner-${opt.id}`}
                        name="owner"
                        checked={owner === opt.id}
                        onChange={() => setOwner(opt.id)}
                        style={{
                          width: '24px',
                          height: '24px',
                          margin: '2px 0 0',
                          accentColor: '#0B5CAD',
                          flex: 'none',
                        }}
                      />
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <b style={{ fontSize: '18px', color: '#0F172A' }}>{opt.title}</b>
                        <span style={{ fontSize: '15px', color: '#475569', lineHeight: 1.4 }}>
                          {opt.hint}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div style={{ maxWidth: '480px', marginBottom: '32px' }}>
                <label
                  htmlFor="holder"
                  style={{ display: 'block', fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}
                >
                  Name on the bank account
                </label>
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                  }}
                >
                  {holderHints[owner]}
                </p>
                <input
                  id="holder"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    height: '52px',
                    padding: '0 16px',
                    font: 'inherit',
                    fontSize: '19px',
                    border:
                      submitted && !holder.trim()
                        ? '3px solid var(--color-error)'
                        : '2px solid var(--color-muted-2)',
                    borderRadius: '8px',
                  }}
                />
              </div>

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
                  to={`/g/${token}/step/5`}
                  className="btn btn--secondary"
                  style={{ minHeight: '52px', fontSize: '18px', padding: '0 24px' }}
                >
                  ‹ Back to review step 5
                </Link>
                <button
                  type="submit"
                  className="btn btn--primary"
                  style={{
                    minHeight: '52px',
                    fontSize: '19px',
                    fontWeight: 700,
                    padding: '0 32px',
                    borderRadius: '8px',
                  }}
                >
                  Continue to bank numbers ➔
                </button>
              </div>
            </form>
          )}

          {depositStep === 2 && (
            <form onSubmit={handleSaveAndReview}>
              {/* Summary pill showing Part 1 choice */}
              <div
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '12px 18px',
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>Depositing to: </span>
                  <strong style={{ fontSize: '16px', color: '#1E293B' }}>{holder}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setDepositStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0B5CAD',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Change name
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ width: '200px' }}>
                    <label
                      htmlFor="transit"
                      style={{
                        display: 'block',
                        fontWeight: 700,
                        fontSize: '18px',
                        marginBottom: '2px',
                      }}
                    >
                      Transit number
                    </label>
                    <p
                      style={{
                        margin: '0 0 8px',
                        fontSize: '15px',
                        color: 'var(--color-muted)',
                      }}
                    >
                      5 digits (branch)
                    </p>
                    {tErr && (
                      <p
                        style={{
                          margin: '0 0 6px',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--color-error)',
                        }}
                        role="alert"
                      >
                        Error: enter 5 digits
                      </p>
                    )}
                    <input
                      id="transit"
                      inputMode="numeric"
                      maxLength={5}
                      autoComplete="off"
                      placeholder="12345"
                      value={t}
                      onChange={(e) => setT(e.target.value.replace(/\D/g, ''))}
                      style={fieldStyle(tErr)}
                    />
                  </div>

                  <div style={{ width: '220px' }}>
                    <label
                      htmlFor="inst"
                      style={{
                        display: 'block',
                        fontWeight: 700,
                        fontSize: '18px',
                        marginBottom: '2px',
                      }}
                    >
                      Institution number
                    </label>
                    <p
                      style={{
                        margin: '0 0 8px',
                        fontSize: '15px',
                        color: 'var(--color-muted)',
                      }}
                    >
                      3 digits (bank)
                    </p>
                    {iErr && (
                      <p
                        style={{
                          margin: '0 0 6px',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--color-error)',
                        }}
                        role="alert"
                      >
                        Error: enter 3 digits
                      </p>
                    )}
                    <input
                      id="inst"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      placeholder="003"
                      value={i}
                      onChange={(e) => setI(e.target.value.replace(/\D/g, ''))}
                      style={fieldStyle(iErr)}
                    />
                  </div>
                </div>

                {/* Quick helper for common Canadian banks */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    maxWidth: '560px',
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Quick tap: select bank to fill the 3-digit code
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { name: 'RBC Royal Bank', code: '003' },
                      { name: 'TD Canada Trust', code: '004' },
                      { name: 'Scotiabank', code: '002' },
                      { name: 'BMO Bank of Montreal', code: '001' },
                      { name: 'CIBC', code: '010' },
                      { name: 'National Bank', code: '006' },
                      { name: 'Desjardins', code: '815' },
                    ].map((bank) => (
                      <button
                        key={bank.code}
                        type="button"
                        onClick={() => setI(bank.code)}
                        style={{
                          background: i === bank.code ? '#0B5CAD' : '#FFFFFF',
                          color: i === bank.code ? '#FFFFFF' : '#1E293B',
                          border: i === bank.code ? '1px solid #0B5CAD' : '1px solid #CBD5E1',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        {bank.name} <strong>({bank.code})</strong>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="account-panel">
                  <label htmlFor="acct" className="account-panel__title" style={{ fontSize: '18px', fontWeight: 700 }}>
                    Account number
                  </label>
                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: '15px',
                      color: 'var(--color-muted)',
                    }}
                  >
                    7 to 12 digits (numbers only)
                  </p>
                  {aErr && (
                    <p
                      style={{
                        margin: '0 0 6px',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-error)',
                      }}
                      role="alert"
                    >
                      Error: enter 7 to 12 digits
                    </p>
                  )}
                  <input
                    id="acct"
                    inputMode="numeric"
                    maxLength={12}
                    autoComplete="off"
                    value={a}
                    onChange={(e) => setA(e.target.value.replace(/\D/g, ''))}
                    style={fieldStyle(aErr)}
                  />

                  <label
                    htmlFor="acct2"
                    style={{
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '18px',
                      margin: '18px 0 6px',
                    }}
                  >
                    Enter account number again
                  </label>
                  {cErr && (
                    <p
                      style={{
                        margin: '0 0 6px',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-error)',
                      }}
                      role="alert"
                    >
                      Error: account numbers do not match
                    </p>
                  )}
                  <input
                    id="acct2"
                    inputMode="numeric"
                    maxLength={12}
                    autoComplete="off"
                    value={c}
                    onChange={(e) => setC(e.target.value.replace(/\D/g, ''))}
                    style={fieldStyle(cErr)}
                  />
                </div>

                <label
                  style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    padding: '16px 20px',
                    background: '#FFFFFF',
                    border:
                      submitted && !authorized
                        ? '3px solid var(--color-error)'
                        : '1px solid var(--color-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '17px',
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    id="auth-check"
                    type="checkbox"
                    checked={authorized}
                    onChange={(e) => setAuthorized(e.target.checked)}
                    style={{
                      width: '24px',
                      height: '24px',
                      margin: '3px 0 0',
                      accentColor: 'var(--color-primary)',
                      flex: 'none',
                    }}
                  />
                  <span>
                    I authorize the Canadian Armed Forces Pension Centre to deposit pension payments
                    for Jenny Villa into this account until told otherwise.
                  </span>
                </label>
              </div>

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
                <button
                  type="button"
                  onClick={() => {
                    setDepositStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn btn--secondary"
                  style={{ minHeight: '52px', fontSize: '18px', padding: '0 24px' }}
                >
                  ‹ Back to account owner
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  style={{
                    minHeight: '52px',
                    fontSize: '19px',
                    fontWeight: 700,
                    padding: '0 32px',
                    borderRadius: '8px',
                  }}
                >
                  Save and go to final review ➔
                </button>
              </div>
            </form>
          )}
        </StepLayout>
      </main>
    </>
  );
};
