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

  const [owner, setOwner] = useState<'member' | 'joint' | 'trust'>(
    state.guardianDeposit.ownerType || 'member'
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
      id: 'trust' as const,
      title: 'A trust or guardianship account for Jenny Villa',
      hint: 'An account held by you as legal guardian/trustee for Jenny Villa (age 20).',
    },
    {
      id: 'member' as const,
      title: "Jenny Villa's own personal account",
      hint: 'In Jenny Villa’s name only.',
    },
    {
      id: 'joint' as const,
      title: 'A joint account with Jenny Villa',
      hint: 'Both your name and Jenny Villa are on the account.',
    },
  ];

  const holderHints = {
    member: `${memberName}'s name`,
    joint: 'Both names, as on the account',
    trust: `For example: ${guardianName} in trust for ${memberName}`,
  };

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
    if (tErr) errors.push({ targetId: 'transit', message: 'Enter the 5-digit transit number' });
    if (iErr) errors.push({ targetId: 'inst', message: 'Enter the 3-digit institution number' });
    if (aErr) errors.push({ targetId: 'acct', message: 'Enter an account number of 7 to 12 digits' });
    if (cErr) errors.push({ targetId: 'acct2', message: 'The two account numbers do not match' });
    if (!authorized) errors.push({ targetId: 'auth-check', message: 'You must authorize the direct deposit' });
  }

  const isValid = !tBad && !iBad && !aBad && !cBad && holder.trim() && authorized;
  const showSuccess = submitted && isValid;
  const last4 = a.slice(-4);

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
              <HelpCard title="Which account can I use?">
                <p>
                  Use an account in {memberName}'s name, a joint account with
                  them, or a trust account you hold for them. Don't use an
                  account that is only in your own name.
                </p>
              </HelpCard>
              <HelpCard title="Saved as you go">
                <p>
                  Leave and come back with the same link before it expires on{' '}
                  {state.invite.expiresAt}.
                </p>
              </HelpCard>
            </>
          }
        >
          {errors.length > 0 && (
            <ErrorSummary title="Check the bank details" errors={errors} />
          )}

          <h1 className="page-title">
            Where should we send the pension for Jenny Villa?
          </h1>
          <p className="page-lead">
            Payments go by direct deposit only. The account must be held for the
            benefit of Jenny Villa (surviving daughter of the late General Felix Villa).
          </p>

          <fieldset style={{ border: 0, margin: '0 0 24px', padding: 0 }}>
            <legend
              style={{
                fontWeight: 600,
                fontSize: '20px',
                marginBottom: '10px',
                padding: 0,
              }}
            >
              Whose account is this?
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ownerOptions.map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    padding: '14px 18px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border:
                      owner === opt.id
                        ? '2px solid var(--color-primary)'
                        : '2px solid #C9D1DB',
                  }}
                >
                  <input
                    type="radio"
                    id={`owner-${opt.id}`}
                    name="owner"
                    checked={owner === opt.id}
                    onChange={() => setOwner(opt.id)}
                    style={{
                      width: '22px',
                      height: '22px',
                      margin: '2px 0 0',
                      accentColor: 'var(--color-primary)',
                      flex: 'none',
                    }}
                  />
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <b>{opt.title}</b>
                    <span style={{ fontSize: '15px', color: 'var(--color-muted)' }}>
                      {opt.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div style={{ maxWidth: '460px', marginBottom: '24px' }}>
            <label
              htmlFor="holder"
              style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}
            >
              Account holder name, as the bank shows it
            </label>
            <p
              style={{
                margin: '0 0 8px',
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
                height: '48px',
                padding: '0 14px',
                font: 'inherit',
                border:
                  submitted && !holder.trim()
                    ? '3px solid var(--color-error)'
                    : '2px solid var(--color-muted-2)',
                borderRadius: '6px',
              }}
            />
          </div>

          <ChequeDiagram />

          <form onSubmit={handleSaveAndReview}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '200px' }}>
                  <label
                    htmlFor="transit"
                    style={{
                      display: 'block',
                      fontWeight: 600,
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
                    5 digits
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
                    value={t}
                    onChange={(e) => setT(e.target.value.replace(/\D/g, ''))}
                    style={fieldStyle(tErr)}
                  />
                </div>
                <div style={{ width: '160px' }}>
                  <label
                    htmlFor="inst"
                    style={{
                      display: 'block',
                      fontWeight: 600,
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
                    3 digits
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
                    value={i}
                    onChange={(e) => setI(e.target.value.replace(/\D/g, ''))}
                    style={fieldStyle(iErr)}
                  />
                </div>
              </div>

              <div className="account-panel">
                <label htmlFor="acct" className="account-panel__title">
                  Account number
                </label>
                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                  }}
                >
                  7 to 12 digits. Numbers only, no spaces or dashes.
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
                    fontWeight: 600,
                    margin: '16px 0 8px',
                  }}
                >
                  Enter the account number again
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
                    Error: account numbers don't match
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

              <div>
                <p style={{ margin: '0 0 6px', fontWeight: 600 }}>
                  Add a void cheque or direct deposit form (optional)
                </p>
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                  }}
                >
                  It should show the account holder name. PDF, JPG or PNG, up to
                  10 MB.
                </p>
                <label className="file-upload-label">
                  Choose a file
                  <input
                    type="file"
                    style={{
                      position: 'absolute',
                      width: '1px',
                      height: '1px',
                      opacity: 0,
                    }}
                  />
                </label>
              </div>

              <label
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  padding: '16px 20px',
                  background: '#FFFFFF',
                  border:
                    submitted && !authorized
                      ? '2px solid var(--color-error)'
                      : '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              >
                <input
                  id="auth-check"
                  type="checkbox"
                  checked={authorized}
                  onChange={(e) => setAuthorized(e.target.checked)}
                  style={{
                    width: '22px',
                    height: '22px',
                    margin: '2px 0 0',
                    accentColor: 'var(--color-primary)',
                    flex: 'none',
                  }}
                />
                <span>
                  As legal guardian on behalf of Jenny Villa (beneficiary of the late General Felix Villa), I authorize the Canadian Armed
                  Forces Pension Centre to deposit her pension payments into
                  this account until told otherwise.
                </span>
              </label>
            </div>

            {showSuccess && (
              <div
                role="status"
                style={{
                  marginTop: '24px',
                  background: 'var(--color-success-bg)',
                  border: '2px solid var(--color-success)',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <span>
                  <b style={{ color: 'var(--color-success)' }}>
                    Bank details look right.
                  </b>{' '}
                  Branch {t} at institution {i}, account ending {last4}.
                </span>
                <Link
                  to={`/g/${token}/review`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: '48px',
                    padding: '0 28px',
                    background: 'var(--color-success)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderRadius: '6px',
                  }}
                >
                  Continue to review
                </Link>
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
                to={`/g/${token}/step/5`}
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
                  Save and review
                </button>
              </div>
            </div>
          </form>
        </StepLayout>
      </main>
    </>
  );
};
