import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';
import { ErrorSummary, FormError } from '../components/ErrorSummary';

export const SECRET_ACCESS_CODE = '842019';

export const GuardianVerifyPage: React.FC = () => {
  const { state, updateState, setInviteStatus } = useApplication();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const memberName = mockData.personal.fullName; // Jenny Miller
  const lateMemberName = 'General Kelvin Miller';
  const guardianDefaultName = state.guardianProfile.fullName || 'Margaretha Byers';

  // Progressive Disclosure: Step 1 (Code) -> Step 2 (Member DOB) -> Step 3 (Capacity)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [code, setCode] = useState('');
  const [mDay, setMDay] = useState('');
  const [mMonth, setMMonth] = useState('');
  const [mYear, setMYear] = useState('');
  const [confirmedCapacity, setConfirmedCapacity] = useState(false);

  // Validation submission attempts per step
  const [step1Submitted, setStep1Submitted] = useState(false);
  const [step2Submitted, setStep2Submitted] = useState(false);
  const [step3Submitted, setStep3Submitted] = useState(false);

  // Verification Animation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Focus refs for mobile auto-focus and auto-advance
  const otpInputRef = useRef<HTMLInputElement>(null);
  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'Security Verification - CAF Pension Centre';
    if (state.invite.status === 'sent') {
      setInviteStatus('opened');
    }
  }, []);

  const cleanCode = code.replace(/\D/g, '');
  const isCodeCorrect = cleanCode === SECRET_ACCESS_CODE;
  const memberDobValid =
    (mDay.replace(/^0/, '') === '7' && mMonth.replace(/^0/, '') === '10' && mYear === '1959') ||
    (mDay.replace(/^0/, '') === '14' && mMonth.replace(/^0/, '') === '8' && mYear === '1958');

  // Step 1 Validation
  const step1Errors: FormError[] = [];
  if (step1Submitted && !isCodeCorrect) {
    if (cleanCode.length !== 6) {
      step1Errors.push({
        targetId: 'otp-code',
        message: 'Enter your 6-digit access code',
      });
    } else {
      step1Errors.push({
        targetId: 'otp-code',
        message: 'Invalid security access code. Please check the code provided to you and try again.',
      });
    }
  }

  // Step 2 Validation
  const step2Errors: FormError[] = [];
  if (step2Submitted && !memberDobValid) {
    step2Errors.push({
      targetId: 'dob-day',
      message: `The birthdate entered does not match our military pension service records for late ${lateMemberName}. Please check and try again.`,
    });
  }

  // Step 3 Validation
  const step3Errors: FormError[] = [];
  if (step3Submitted && !confirmedCapacity) {
    step3Errors.push({
      targetId: 'capacity-check',
      message: `You must confirm that you are acting or assisting for ${memberName}`,
    });
  }

  // Input change handlers that enable continuous typing without bouncing out
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    if (step1Submitted) setStep1Submitted(false);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMDay(val);
    if (step2Submitted) setStep2Submitted(false);
    if (val.length === 2) {
      monthInputRef.current?.focus();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMMonth(val);
    if (step2Submitted) setStep2Submitted(false);
    if (val.length === 2) {
      yearInputRef.current?.focus();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setMYear(val);
    if (step2Submitted) setStep2Submitted(false);
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && mMonth === '') {
      dayInputRef.current?.focus();
    }
  };

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && mYear === '') {
      monthInputRef.current?.focus();
    }
  };

  const handleDayPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pasteData.length >= 8) {
      e.preventDefault();
      const d = pasteData.slice(0, 2);
      const m = pasteData.slice(2, 4);
      const y = pasteData.slice(4, 8);
      setMDay(d);
      setMMonth(m);
      setMYear(y);
      if (step2Submitted) setStep2Submitted(false);
      yearInputRef.current?.focus();
    }
  };

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Submitted(true);
    if (cleanCode === SECRET_ACCESS_CODE) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => dayInputRef.current?.focus(), 150);
    }
  };

  const handleStep2Continue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Submitted(true);
    if (memberDobValid) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Submitted(true);

    if (confirmedCapacity) {
      setIsVerifying(true);
      setTimeout(() => {
        setVerifySuccess(true);
        setTimeout(() => {
          updateState({
            guardianProfile: {
              ...state.guardianProfile,
              fullName: guardianDefaultName,
              declared: true,
            },
            invite: {
              ...state.invite,
              status: 'verified',
            },
          });
          navigate(`/g/${token || 'demo-token'}/form-package`);
        }, 400);
      }, 700);
    }
  };

  const activeErrors =
    currentStep === 1 ? step1Errors : currentStep === 2 ? step2Errors : step3Errors;

  return (
    <>
      <ActingForBanner dateText="Pension File: CAF-SRV-2026-9082" />

      <main
        className="container"
        style={{
          maxWidth: '560px',
          padding: '20px 16px 80px',
        }}
      >
        {activeErrors.length > 0 && <ErrorSummary title="There is a problem" errors={activeErrors} />}

        {/* Minimalist Mobile-First Header (No heavy card boxes) */}
        <header style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#0B3866',
              marginBottom: '8px',
            }}
          >
            <span>🔒 Secure Access</span>
            <span>•</span>
            <span>Ref: CAF-SRV-2026-9082</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 5vw, 30px)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.2,
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}
          >
            {currentStep === 1
              ? 'Security Access Code'
              : currentStep === 2
              ? 'Member Verification'
              : 'Representation Confirmation'}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.5,
            }}
          >
            {currentStep === 1
              ? `Beneficiary ${memberName} selected you to assist with her CAF pension. Enter your access code to begin.`
              : currentStep === 2
              ? `Confirm the date of birth of late ${lateMemberName} (CAF-992-014-K) to verify your access.`
              : `Final question: confirm your relationship to authorize downloading the official Form CF-FC 2489.`}
          </p>
        </header>

        {/* Progressive Disclosure Stepper (Flat & Clean Bar) */}
        <div style={{ marginBottom: '28px' }} aria-label="Verification progress">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              fontWeight: 600,
              color: '#64748B',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: '#0B3866', fontWeight: 700 }}>
              Question {currentStep} of 3
            </span>
            <span>
              {currentStep === 1
                ? 'Step 1: Code'
                : currentStep === 2
                ? 'Step 2: Birthdate'
                : 'Step 3: Confirm'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
            }}
          >
            {[1, 2, 3].map((step) => {
              const isPast = step < currentStep;
              const isCurrent = step === currentStep;
              return (
                <div
                  key={step}
                  style={{
                    height: '5px',
                    borderRadius: '4px',
                    background: isPast ? '#16A34A' : isCurrent ? '#0B3866' : '#E2E8F0',
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Previously Completed Summary Pills (Progressive Reassurance) */}
        {currentStep > 1 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#F0FDF4',
                border: '1px solid #DCFCE7',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#166534',
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <span>✓ Access code verified</span>
              <span style={{ fontSize: '12px', fontWeight: 700, textDecoration: 'underline' }}>
                Edit
              </span>
            </button>

            {currentStep > 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#166534',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <span>✓ Member birthdate verified</span>
                <span style={{ fontSize: '12px', fontWeight: 700, textDecoration: 'underline' }}>
                  Edit
                </span>
              </button>
            )}
          </div>
        )}

        {/* ── STEP 1: 6-DIGIT CODE ── */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Continue} noValidate>
            <div style={{ marginBottom: '28px' }}>
              <label
                htmlFor="otp-code"
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '8px',
                }}
              >
                Enter your 6-digit security access code
              </label>

              <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#64748B' }}>
                Enter the one-time security code sent to you via SMS / text message.
              </p>

              <input
                ref={otpInputRef}
                id="otp-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={handleCodeChange}
                placeholder="••••••"
                autoComplete="one-time-code"
                style={{
                  width: '100%',
                  maxWidth: '260px',
                  height: '56px',
                  fontSize: '28px',
                  fontWeight: 800,
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  border: '2px solid #0B3866',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                }}
              />

            </div>

            {/* Mobile-Friendly Full-Width Action Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                minHeight: '52px',
                background: '#0B3866',
                color: '#FFFFFF',
                fontSize: '17px',
                fontWeight: 700,
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(11, 56, 102, 0.2)',
              }}
            >
              Continue to Step 2 &rarr;
            </button>
          </form>
        )}

        {/* ── STEP 2: MEMBER BIRTHDATE ── */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Continue} noValidate>
            <div style={{ marginBottom: '28px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}
              >
                What is the birthdate of late {lateMemberName}?
              </label>

              <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748B' }}>
                Service Number: <b>CAF-992-014-K</b>
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div>
                  <label
                    htmlFor="dob-day"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748B',
                      marginBottom: '4px',
                    }}
                  >
                    Day (DD)
                  </label>
                  <input
                    ref={dayInputRef}
                    id="dob-day"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="DD"
                    value={mDay}
                    onChange={handleDayChange}
                    onPaste={handleDayPaste}
                    style={{
                      width: '72px',
                      height: '52px',
                      fontSize: '20px',
                      fontWeight: 700,
                      textAlign: 'center',
                      border: '2px solid #CBD5E1',
                      borderRadius: '8px',
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <span style={{ fontSize: '22px', color: '#94A3B8', marginTop: '18px' }}>/</span>

                <div>
                  <label
                    htmlFor="dob-month"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748B',
                      marginBottom: '4px',
                    }}
                  >
                    Month (MM)
                  </label>
                  <input
                    ref={monthInputRef}
                    id="dob-month"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="MM"
                    value={mMonth}
                    onChange={handleMonthChange}
                    onKeyDown={handleMonthKeyDown}
                    style={{
                      width: '72px',
                      height: '52px',
                      fontSize: '20px',
                      fontWeight: 700,
                      textAlign: 'center',
                      border: '2px solid #CBD5E1',
                      borderRadius: '8px',
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <span style={{ fontSize: '22px', color: '#94A3B8', marginTop: '18px' }}>/</span>

                <div>
                  <label
                    htmlFor="dob-year"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748B',
                      marginBottom: '4px',
                    }}
                  >
                    Year (YYYY)
                  </label>
                  <input
                    ref={yearInputRef}
                    id="dob-year"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="YYYY"
                    value={mYear}
                    onChange={handleYearChange}
                    onKeyDown={handleYearKeyDown}
                    style={{
                      width: '96px',
                      height: '52px',
                      fontSize: '20px',
                      fontWeight: 700,
                      textAlign: 'center',
                      border: '2px solid #CBD5E1',
                      borderRadius: '8px',
                      color: '#0F172A',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  minHeight: '52px',
                  background: '#0B3866',
                  color: '#FFFFFF',
                  fontSize: '17px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                Continue to Final Step &rarr;
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '15px',
                  cursor: 'pointer',
                  padding: '10px',
                }}
              >
                &larr; Back to Step 1
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: CAPACITY & CONFIRMATION ── */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalVerify} noValidate>
            <div style={{ marginBottom: '28px' }}>
              <label
                htmlFor="capacity-check"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  cursor: 'pointer',
                  padding: '16px',
                  background: confirmedCapacity ? '#F0FDF4' : '#F8FAFC',
                  border: confirmedCapacity ? '2px solid #16A34A' : '2px solid #CBD5E1',
                  borderRadius: '10px',
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  id="capacity-check"
                  type="checkbox"
                  checked={confirmedCapacity}
                  onChange={(e) => setConfirmedCapacity(e.target.checked)}
                  style={{
                    width: '24px',
                    height: '24px',
                    marginTop: '2px',
                    cursor: 'pointer',
                    accentColor: '#166534',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '15px', color: '#1E293B', lineHeight: 1.5 }}>
                  <b>Confirmation of Representation:</b> I confirm that I am{' '}
                  <b>{guardianDefaultName}</b> and that I have been chosen by beneficiary{' '}
                  <b>{memberName}</b> to assist as her guardian / representative for her Canadian Armed
                  Forces pension benefit.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="submit"
                disabled={isVerifying}
                style={{
                  width: '100%',
                  minHeight: '54px',
                  background: verifySuccess ? '#166534' : '#0B3866',
                  color: '#FFFFFF',
                  fontSize: '17px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: 'none',
                  cursor: isVerifying ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 2px 6px rgba(11, 56, 102, 0.25)',
                }}
              >
                {isVerifying ? (
                  <>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '18px',
                        height: '18px',
                        border: '3px solid rgba(255,255,255,0.4)',
                        borderTopColor: '#FFFFFF',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <span>Verifying with Pension Centre...</span>
                  </>
                ) : verifySuccess ? (
                  <span>✓ Verified! Opening Form Package...</span>
                ) : (
                  <span>Unlock &amp; View Form Package &rarr;</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '15px',
                  cursor: 'pointer',
                  padding: '10px',
                }}
              >
                &larr; Back to Step 2
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>
          Government of Canada Pension Centre · Need assistance? Call 1-800-267-0325
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default GuardianVerifyPage;
