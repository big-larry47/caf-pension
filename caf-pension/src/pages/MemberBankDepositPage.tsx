import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { ProgressStepper } from '../components/ProgressStepper';
import { StepLayout } from '../components/StepLayout';
import { HelpCard } from '../components/HelpCard';
import { ChequeDiagram } from '../components/ChequeDiagram';
import { ErrorSummary, FormError } from '../components/ErrorSummary';

export const MemberBankDepositPage: React.FC = () => {
  const { state, updateState, markStepComplete } = useApplication();
  const navigate = useNavigate();

  const [t, setT] = useState(state.memberDeposit.transit);
  const [i, setI] = useState(state.memberDeposit.institution);
  const [a, setA] = useState(state.memberDeposit.account);
  const [c, setC] = useState(state.memberDeposit.accountConfirm);
  const [holder, setHolder] = useState(state.memberDeposit.holderName);
  const [authorized, setAuthorized] = useState(state.memberDeposit.authorized);
  const [submitted, setSubmitted] = useState(state.memberDeposit.submitted);
  const [fileSelected, setFileSelected] = useState(state.memberDeposit.voidChequeFile?.name || '');

  useEffect(() => {
    document.title = 'Step 6 Direct deposit - CAF Pension Centre';
  }, []);

  const tBad = !/^\d{5}$/.test(t);
  const iBad = !/^\d{3}$/.test(i);
  const aBad = !/^\d{7,12}$/.test(a);
  const cBad = !aBad && c !== a;

  const tErr = submitted && tBad;
  const iErr = submitted && iBad;
  const aErr = submitted && aBad;
  const cErr = submitted && cBad;

  const errorList: FormError[] = [];
  if (tErr) {
    errorList.push({
      targetId: 'transit',
      message: 'Enter your 5-digit transit number',
    });
  }
  if (iErr) {
    errorList.push({
      targetId: 'inst',
      message: 'Enter your 3-digit institution number',
    });
  }
  if (aErr) {
    errorList.push({
      targetId: 'acct',
      message: 'Enter an account number of 7 to 12 digits',
    });
  }
  if (cErr) {
    errorList.push({
      targetId: 'acct2',
      message: 'The two account numbers do not match',
    });
  }

  const isValid = !tBad && !iBad && !aBad && !cBad;
  const showSuccess = submitted && isValid;
  const last4 = a.slice(-4);

  const handleDigitChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value.replace(/\D/g, ''));
  };

  const handleSaveAndReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (isValid) {
      updateState({
        memberDeposit: {
          holderName: holder,
          transit: t,
          institution: i,
          account: a,
          accountConfirm: c,
          authorized,
          submitted: true,
          voidChequeFile: fileSelected ? { name: fileSelected } : undefined,
        },
      });
      markStepComplete(6, 'member');
      navigate('/application/review');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(file.name);
    }
  };

  const fieldStyle = (isError: boolean, width: string = '100%'): React.CSSProperties => ({
    width,
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
      <ProgressStepper currentStep={6} />
      <main className="container container--wide">
        <StepLayout
          aside={
            <>
              <HelpCard title="Keep your account open">
                <p>
                  Don't close this account until your first pension payment
                  arrives. Changing banks later? Update it from your pension
                  account.
                </p>
              </HelpCard>
              <HelpCard title="Bank outside Canada?">
                <p>
                  Choose "Outside Canada" above and we'll ask for the foreign
                  direct deposit details instead.
                </p>
              </HelpCard>
            </>
          }
        >
          {errorList.length > 0 && <ErrorSummary errors={errorList} />}

          <h1 className="page-title">Where should we send your pension?</h1>
          <p className="page-lead">
            Payments go by direct deposit only. Enter the account in your name
            where you want your monthly pension paid.
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
              Where is your bank?
            </legend>
            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="where"
                  checked={state.bankLocation === 'canada'}
                  onChange={() => updateState({ bankLocation: 'canada' })}
                  style={{
                    width: '22px',
                    height: '22px',
                    margin: 0,
                    accentColor: 'var(--color-primary)',
                  }}
                />
                In Canada
              </label>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="where"
                  checked={state.bankLocation === 'outside'}
                  onChange={() => updateState({ bankLocation: 'outside' })}
                  style={{
                    width: '22px',
                    height: '22px',
                    margin: 0,
                    accentColor: 'var(--color-primary)',
                  }}
                />
                Outside Canada
              </label>
            </div>
          </fieldset>

          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #0B5CAD',
              borderRadius: '8px',
              padding: '20px 22px',
              marginBottom: '26px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>⚡</span>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0B335E' }}>
                Wire Transfer / Direct Deposit Setup
              </h2>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: '16px', lineHeight: 1.5, color: '#334155' }}>
              No cheques required. Payments are wired electronically into your account each month.
            </p>
            <p style={{ margin: 0, fontSize: '15px', color: '#64748B' }}>
              Enter your 5-digit transit number, 3-digit institution number, and account number below.
            </p>
          </div>

          <form onSubmit={handleSaveAndReview}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ maxWidth: '460px' }}>
                <label
                  htmlFor="holder"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  Account holder name
                </label>
                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                  }}
                >
                  The account must be in your name, or joint with you.
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
                    border: '2px solid var(--color-muted-2)',
                    borderRadius: 'var(--radius-input)',
                  }}
                />
              </div>

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
                    onChange={(e) => handleDigitChange(setT, e.target.value)}
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
                    onChange={(e) => handleDigitChange(setI, e.target.value)}
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
                  onChange={(e) => handleDigitChange(setA, e.target.value)}
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
                  Enter your account number again
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
                  onChange={(e) => handleDigitChange(setC, e.target.value)}
                  style={fieldStyle(cErr)}
                />
              </div>

              {/* Direct wire transfer - no cheque required */}

              <label
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  padding: '16px 20px',
                  background: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-card)',
                }}
              >
                <input
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
                  I authorize the Canadian Armed Forces Pension Centre to
                  deposit my pension payments into this account until I tell
                  them otherwise.
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
                  borderRadius: 'var(--radius-card)',
                  padding: '16px 20px',
                }}
              >
                <b style={{ color: 'var(--color-success)' }}>
                  Bank details look right.
                </b>{' '}
                Branch {t} at institution {i}, account ending {last4}. Next
                you'll review and sign your whole application.
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
                to="/application/deposit"
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
                <Link to="/application" className="link">
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
