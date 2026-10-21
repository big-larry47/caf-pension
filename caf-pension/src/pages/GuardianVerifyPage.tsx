import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';
import { ErrorSummary, FormError } from '../components/ErrorSummary';

export const GuardianVerifyPage: React.FC = () => {
  const { state, updateState, setInviteStatus } = useApplication();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const memberName = mockData.personal.fullName; // Jenny Miller
  const lateMemberName = 'General Kelvin Miller';
  const guardianDefaultName = state.guardianProfile.fullName || 'Margaretha Byers';

  // Security Questions State
  const [code, setCode] = useState('');
  const [mDay, setMDay] = useState('');
  const [mMonth, setMMonth] = useState('');
  const [mYear, setMYear] = useState('');
  const [confirmedCapacity, setConfirmedCapacity] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Verification Animation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  useEffect(() => {
    document.title = 'Security Verification - CAF Pension Centre';
    // If invite was not opened yet, mark opened
    if (state.invite.status === 'sent') {
      setInviteStatus('opened');
    }
  }, []);

  const cleanCode = code.replace(/\D/g, '');
  const memberDobValid =
    (mDay.replace(/^0/, '') === '7' && mMonth.replace(/^0/, '') === '10' && mYear === '1959') ||
    (mDay.replace(/^0/, '') === '14' && mMonth.replace(/^0/, '') === '8' && mYear === '1958');

  // Form Errors
  const errors: FormError[] = [];
  if (submitted) {
    if (cleanCode.length !== 6) {
      errors.push({ targetId: 'otp-code', message: 'Enter your 6-digit security access code (demo code: 123456)' });
    }
    if (!memberDobValid) {
      errors.push({
        targetId: 'dob-day',
        message: `Enter the late ${lateMemberName}'s date of birth (DD: 07 / MM: 10 / YYYY: 1959)`,
      });
    }
    if (!confirmedCapacity) {
      errors.push({
        targetId: 'capacity-check',
        message: `Please confirm that you are assisting or acting as guardian / representative for ${memberName}`,
      });
    }
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (cleanCode.length === 6 && memberDobValid && confirmedCapacity) {
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
        }, 500);
      }, 750);
    }
  };

  return (
    <>
      <ActingForBanner dateText={`Pension File: CAF-SRV-2026-9082`} />
      <main className="container container--narrow" style={{ paddingBottom: '64px', paddingTop: '16px' }}>
        
        {errors.length > 0 && <ErrorSummary errors={errors} />}

        {/* Security Header Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#0B3866',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              🔒
            </div>
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#0B3866',
                }}
              >
                Government of Canada • Pension Centre
              </span>
              <h1 style={{ margin: '2px 0 0', fontSize: '24px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                Security Verification
              </h1>
            </div>
          </div>

          <p style={{ margin: '0 0 16px', fontSize: '15px', color: '#334155', lineHeight: 1.5 }}>
            You have received this link to access the official Canadian Armed Forces Pension Representative package
            for beneficiary <b>{memberName}</b> (dependent child of the late <b>{lateMemberName}</b>).
          </p>

          <div
            style={{
              background: '#F1F5F9',
              borderLeft: '4px solid #0B3866',
              padding: '12px 16px',
              borderRadius: '0 6px 6px 0',
              fontSize: '14px',
              color: '#334155',
              lineHeight: 1.45,
            }}
          >
            Please answer the security questions below. Once verified, you will be directed to download your pre-filled 
            <b> Form CF-FC 2489</b> and view the instructions to email your completed package to the Pension Centre.
          </div>
        </div>

        {/* Security Questions Form */}
        <form onSubmit={handleVerify} noValidate>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Question 1: 6-Digit Access Code */}
            <div
              id="q1-group"
              style={{
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '20px',
              }}
            >
              <label
                htmlFor="otp-code"
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}
              >
                1. Enter your 6-digit security access code
              </label>
              <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#64748B' }}>
                This one-time access code was provided with your invitation link.
                <span style={{ color: '#0B3866', fontWeight: 600 }}> (Demo test code: 123456)</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  style={{
                    width: '180px',
                    height: '48px',
                    fontSize: '22px',
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    textAlign: 'center',
                    border: '2px solid #94A3B8',
                    borderRadius: '8px',
                    color: '#0F172A',
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setCode('123456')}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  Fill Demo Code (123456)
                </button>
              </div>
            </div>

            {/* Question 2: Late Member's Date of Birth */}
            <div
              id="q2-group"
              style={{
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '20px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}
              >
                2. What is the date of birth of the late {lateMemberName}?
              </label>
              <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#64748B' }}>
                Service Number: <b>CAF-992-014-K</b>. For security verification, confirm their birthdate.
                <span style={{ color: '#0B3866', fontWeight: 600 }}> (Demo hint: 07 / 10 / 1959)</span>
              </p>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <label htmlFor="dob-day" style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>
                    Day (DD)
                  </label>
                  <input
                    id="dob-day"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="07"
                    value={mDay}
                    onChange={(e) => setMDay(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '64px',
                      height: '44px',
                      fontSize: '18px',
                      fontWeight: 600,
                      textAlign: 'center',
                      border: '2px solid #94A3B8',
                      borderRadius: '6px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '20px', color: '#94A3B8', marginTop: '16px' }}>/</span>
                <div>
                  <label htmlFor="dob-month" style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>
                    Month (MM)
                  </label>
                  <input
                    id="dob-month"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="10"
                    value={mMonth}
                    onChange={(e) => setMMonth(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '64px',
                      height: '44px',
                      fontSize: '18px',
                      fontWeight: 600,
                      textAlign: 'center',
                      border: '2px solid #94A3B8',
                      borderRadius: '6px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '20px', color: '#94A3B8', marginTop: '16px' }}>/</span>
                <div>
                  <label htmlFor="dob-year" style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>
                    Year (YYYY)
                  </label>
                  <input
                    id="dob-year"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="1959"
                    value={mYear}
                    onChange={(e) => setMYear(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '90px',
                      height: '44px',
                      fontSize: '18px',
                      fontWeight: 600,
                      textAlign: 'center',
                      border: '2px solid #94A3B8',
                      borderRadius: '6px',
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMDay('07');
                    setMMonth('10');
                    setMYear('1959');
                  }}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    marginTop: '16px',
                  }}
                >
                  Fill Demo DOB (07/10/1959)
                </button>
              </div>
            </div>

            {/* Question 3: Representation Confirmation */}
            <div id="q3-group">
              <label
                htmlFor="capacity-check"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  background: confirmedCapacity ? '#F0FDF4' : '#F8FAFC',
                  border: confirmedCapacity ? '2px solid #22C55E' : '2px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '16px',
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  id="capacity-check"
                  type="checkbox"
                  checked={confirmedCapacity}
                  onChange={(e) => setConfirmedCapacity(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    cursor: 'pointer',
                    accentColor: '#166534',
                  }}
                />
                <span style={{ fontSize: '15px', color: '#1E293B', lineHeight: 1.45 }}>
                  <b>Confirmation of Representation:</b> I confirm that I am <b>{guardianDefaultName}</b> and that I have been
                  designated to assist or act as guardian / representative for beneficiary <b>{memberName}</b> in respect of
                  her Canadian Armed Forces pension benefit.
                </span>
              </label>
            </div>

            {/* Submit Button & Verification Status */}
            <div style={{ paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={isVerifying}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minHeight: '52px',
                  width: '100%',
                  background: verifySuccess ? '#166534' : '#0B3866',
                  color: '#FFFFFF',
                  fontSize: '17px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isVerifying ? 'wait' : 'pointer',
                  boxShadow: '0 2px 6px rgba(11, 56, 102, 0.25)',
                  transition: 'background 0.2s ease',
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
                    <span>Verifying Credentials with Pension Centre...</span>
                  </>
                ) : verifySuccess ? (
                  <>
                    <span>✓ Verified! Redirecting to Form Package...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Security &amp; Access Form Package →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Alternative direct access note */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
          <span>Having difficulty verifying? Contact the CAF Pension Centre toll-free at </span>
          <b style={{ color: '#0F172A' }}>1-800-267-0325</b> (TTY: 1-855-227-0031).
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
