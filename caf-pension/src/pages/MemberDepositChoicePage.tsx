import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApplication, AuthorityType } from '../context/ApplicationContext';
import { ProgressStepper } from '../components/ProgressStepper';
import { StepLayout } from '../components/StepLayout';
import { HelpCard } from '../components/HelpCard';
import { RadioCard } from '../components/RadioCard';
import { ErrorSummary, FormError } from '../components/ErrorSummary';
import { sendNotificationEmail } from '../services/emailService';

export const MemberDepositChoicePage: React.FC = () => {
  const { state, updateState, setInviteStatus } = useApplication();
  const navigate = useNavigate();

  const [who, setWho] = useState<'me' | 'guardian'>(state.depositChoice || 'guardian');
  const [fullName, setFullName] = useState(state.invite.guardian.fullName);
  const [role, setRole] = useState<AuthorityType>(state.invite.guardian.role || 'poa');
  const [email, setEmail] = useState(state.invite.guardian.email);
  const [mobile, setMobile] = useState(state.invite.guardian.mobile);
  const [message, setMessage] = useState(state.invite.guardian.message || '');
  const [consent, setConsent] = useState(state.invite.memberConsent);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Who gives bank details - CAF Pension Centre';
  }, []);

  const cleanMobile = mobile.replace(/\D/g, '');
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const errors: FormError[] = [];
  if (who === 'guardian' && submitted) {
    if (!fullName.trim()) {
      errors.push({ targetId: 'gn', message: 'Enter the person’s full name' });
    }
    if (!role) {
      errors.push({ targetId: 'gr', message: 'Select their role' });
    }
    if (!emailValid) {
      errors.push({ targetId: 'ge', message: 'Enter a valid email address' });
    }
    if (cleanMobile.length !== 10) {
      errors.push({
        targetId: 'gm',
        message: 'Enter a 10-digit Canadian mobile number',
      });
    }
    if (!consent) {
      errors.push({
        targetId: 'consent-check',
        message: 'You must agree to share your application to continue',
      });
    }
  }

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (
      fullName.trim() &&
      role &&
      emailValid &&
      cleanMobile.length === 10 &&
      consent
    ) {
      updateState({
        depositChoice: 'guardian',
        invite: {
          ...state.invite,
          status: 'sent',
          sentAt: '15 October 2026',
          expiresAt: '29 October 2026',
          guardian: {
            fullName,
            role,
            email,
            mobile: cleanMobile,
            message,
          },
          memberConsent: consent,
        },
        guardianProfile: {
          ...state.guardianProfile,
          fullName,
          authorityType: role,
        },
      });

      sendNotificationEmail({
        type: 'invite',
        recipientEmail: email,
        guardianName: fullName,
        token: state.invite.token || 'demo-token',
        customMessage: message,
      });

      navigate('/application');
    }
  };

  return (
    <>
      <ProgressStepper currentStep={6} />
      <main className="container container--wide">
        <StepLayout
          aside={
            <HelpCard title="Proof they can act for you">
              <p>
                They'll upload a copy of their power of attorney or court order
                when they open the link.
              </p>
              <p>
                We still need the original, a notarized copy or a certified true
                copy by mail before payments can start. Photocopies, faxes and
                scans aren't accepted for this.
              </p>
            </HelpCard>
          }
        >
          {errors.length > 0 && <ErrorSummary errors={errors} />}

          <h1 className="page-title">Who will receive the pension deposit?</h1>
          <p className="page-lead">
            Benefits are designated for surviving daughter Jenny Miller.
            If a Power of Attorney or legal representative manages finances on her behalf, they can finish
            the direct deposit and review steps.
          </p>

          <fieldset
            style={{
              border: 0,
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <legend className="sr-only">Who will receive the pension deposit</legend>
            <RadioCard
              id="who-guardian"
              name="who"
              checked={who === 'guardian'}
              onChange={() => {
                setWho('guardian');
                updateState({ depositChoice: 'guardian' });
              }}
              title="A Power of Attorney or legal representative will receive it for Jenny"
              hint="We send them a secure link to enter banking details and proof of Power of Attorney."
            />
            <RadioCard
              id="who-me"
              name="who"
              checked={who === 'me'}
              onChange={() => {
                setWho('me');
                updateState({ depositChoice: 'me' });
              }}
              title="Direct to Jenny Miller's personal bank account"
              hint="Enter Jenny's Canadian bank details directly."
            />
          </fieldset>

          {who === 'me' ? (
            <div style={{ marginTop: '28px' }}>
              <Link
                to="/application/deposit/bank"
                className="btn btn--primary"
                style={{ padding: '0 28px' }}
              >
                Continue to bank details
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSendLink}>
              <section
                style={{
                  marginTop: '28px',
                  background: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <h2 style={{ margin: 0, fontSize: '22px' }}>
                  About the person helping you
                </h2>
                <div className="form-grid">
                  <div>
                    <label
                      htmlFor="gn"
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        marginBottom: '6px',
                      }}
                    >
                      Full name
                    </label>
                    <input
                      id="gn"
                      autoComplete="off"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`field__input ${
                        submitted && !fullName.trim()
                          ? 'field__input--error'
                          : ''
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gr"
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        marginBottom: '6px',
                      }}
                    >
                      Their role
                    </label>
                    <select
                      id="gr"
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value as AuthorityType)
                      }
                      className="field__select"
                    >
                      <option value="poa">Power of attorney</option>
                      <option value="guardian">
                        Court-appointed guardian
                      </option>
                      <option value="trustee">Trustee or committee</option>
                      <option value="other">Other legal representative</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="ge"
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        marginBottom: '6px',
                      }}
                    >
                      Email
                    </label>
                    <input
                      id="ge"
                      type="email"
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`field__input ${
                        submitted && !emailValid ? 'field__input--error' : ''
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gm"
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        marginBottom: '6px',
                      }}
                    >
                      Mobile number
                    </label>
                    <input
                      id="gm"
                      type="tel"
                      autoComplete="off"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="6135551234"
                      className={`field__input ${
                        submitted && cleanMobile.length !== 10
                          ? 'field__input--error'
                          : ''
                      }`}
                    />
                  </div>
                </div>
                <p
                  style={{
                    margin: '-8px 0 0',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                  }}
                >
                  We send the link by email and a security code by text message,
                  so both are needed.
                </p>
                <div>
                  <label
                    htmlFor="gmsg"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '2px',
                    }}
                  >
                    Message for them (optional)
                  </label>
                  <textarea
                    id="gmsg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      font: 'inherit',
                      border: '2px solid var(--color-muted-2)',
                      borderRadius: '6px',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </section>

              <section
                style={{
                  marginTop: '20px',
                  background: 'var(--color-info-bg)',
                  border: '1px solid var(--color-info-border)',
                  borderRadius: '8px',
                  padding: '20px 24px',
                }}
              >
                <h2 style={{ margin: '0 0 8px', fontSize: '18px' }}>
                  What happens next
                </h2>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '16px',
                  }}
                >
                  <li>They get a secure link that works for 14 days.</li>
                  <li>
                    They see your answers to steps 1 to 5, but can't change them.
                  </li>
                  <li>
                    They enter the bank details, review everything and submit.
                  </li>
                  <li>We email you when it's submitted.</li>
                </ol>
              </section>

              <label
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  marginTop: '20px',
                  padding: '16px 20px',
                  background: '#FFFFFF',
                  border:
                    submitted && !consent
                      ? '2px solid var(--color-error)'
                      : '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              >
                <input
                  id="consent-check"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{
                    width: '22px',
                    height: '22px',
                    margin: '2px 0 0',
                    accentColor: 'var(--color-primary)',
                    flex: 'none',
                  }}
                />
                <span>
                  I agree to share my application with this person so they can
                  complete and submit it for me.
                </span>
              </label>

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
                  to="/application/deductions"
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
                    Send link
                  </button>
                </div>
              </div>
            </form>
          )}
        </StepLayout>
      </main>
    </>
  );
};
