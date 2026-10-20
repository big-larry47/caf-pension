import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApplication, AuthorityType } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';
import { Card } from '../components/Card';
import { ErrorSummary, FormError } from '../components/ErrorSummary';

export const GuardianVerifyPage: React.FC = () => {
  const { state, updateState, setInviteStatus } = useApplication();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const memberName = mockData.personal.fullName;

  // Progressive Disclosure: 1 = Security Code, 2 = Contact Details, 3 = Authority & Declaration
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);

  // Section 1: Security Code & Member verification
  const [code, setCode] = useState('123456');
  const [mDay, setMDay] = useState('14');
  const [mMonth, setMMonth] = useState('08');
  const [mYear, setMYear] = useState('1958');
  const [submittedPart1, setSubmittedPart1] = useState(false);

  // Section 2: Guardian Details
  const [gName, setGName] = useState(state.guardianProfile.fullName || 'Margaretha Byers');
  const [gDob, setGDob] = useState(state.guardianProfile.dateOfBirth || '1988-04-12');
  const [gStreet, setGStreet] = useState(state.guardianProfile.address.street || '120 Queen Street, Apt 4B');
  const [gCity, setGCity] = useState(state.guardianProfile.address.city || 'Ottawa');
  const [gProv, setGProv] = useState(state.guardianProfile.address.province || 'Ontario');
  const [gPc, setGPc] = useState(state.guardianProfile.address.postalCode || 'K1P 5Z9');
  const [gLang, setGLang] = useState<'en' | 'fr'>(state.guardianProfile.language || 'en');
  const [submittedPart2, setSubmittedPart2] = useState(false);

  // Section 3: Authority & Legal Declaration
  const [authority, setAuthority] = useState<AuthorityType>(state.guardianProfile.authorityType || 'poa');
  const [fileName, setFileName] = useState(state.guardianProfile.authorityFile?.name || 'power-of-attorney.pdf');
  const [declared, setDeclared] = useState(state.guardianProfile.declared ?? true);
  const [submittedPart3, setSubmittedPart3] = useState(false);

  // Backend interaction animation states
  const [isVerifyingPart1, setIsVerifyingPart1] = useState(false);
  const [part1Success, setPart1Success] = useState(false);
  const [isSavingPart2, setIsSavingPart2] = useState(false);
  const [isSubmittingPart3, setIsSubmittingPart3] = useState(false);

  useEffect(() => {
    document.title = 'Guardian verify - CAF Pension Centre';
    // If invite was not opened yet, set to opened
    if (state.invite.status === 'sent') {
      setInviteStatus('opened');
    }
  }, []);

  const cleanCode = code.replace(/\D/g, '');
  const postalCodeValid = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(gPc.trim());
  const memberDobValid =
    mDay.padStart(2, '0') === '14' &&
    mMonth.padStart(2, '0') === '08' &&
    mYear === '1958';

  // Part 1 Errors
  const part1Errors: FormError[] = [];
  if (submittedPart1) {
    if (cleanCode.length !== 6) {
      part1Errors.push({ targetId: 'otp', message: 'Enter your 6-digit security code' });
    }
    if (!memberDobValid) {
      part1Errors.push({
        targetId: 'dd',
        message: "Enter the late General's correct date of birth (14 / 08 / 1958)",
      });
    }
  }

  // Part 2 Errors
  const part2Errors: FormError[] = [];
  if (submittedPart2) {
    if (!gName.trim()) {
      part2Errors.push({ targetId: 'gfull', message: 'Enter your full name' });
    }
    if (!gDob) {
      part2Errors.push({ targetId: 'gdob', message: 'Enter your date of birth' });
    }
    if (!gStreet.trim()) {
      part2Errors.push({ targetId: 'gaddr', message: 'Enter your street address' });
    }
    if (!gCity.trim()) {
      part2Errors.push({ targetId: 'gcity', message: 'Enter your city' });
    }
    if (!postalCodeValid) {
      part2Errors.push({
        targetId: 'gpc',
        message: 'Enter a valid Canadian postal code (e.g. K1P 5Z9)',
      });
    }
  }

  // Part 3 Errors
  const part3Errors: FormError[] = [];
  if (submittedPart3) {
    if (!declared) {
      part3Errors.push({
        targetId: 'decl-check',
        message: 'You must confirm the legal declaration to proceed',
      });
    }
  }

  const handlePart1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPart1(true);
    if (cleanCode.length === 6 && memberDobValid) {
      setIsVerifyingPart1(true);
      setTimeout(() => {
        setPart1Success(true);
        setTimeout(() => {
          setIsVerifyingPart1(false);
          setPart1Success(false);
          setCurrentPart(2);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 350);
      }, 700);
    }
  };

  const handlePart2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPart2(true);
    if (gName.trim() && gDob && gStreet.trim() && gCity.trim() && postalCodeValid) {
      setIsSavingPart2(true);
      setTimeout(() => {
        setIsSavingPart2(false);
        setCurrentPart(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPart3(true);

    if (declared) {
      setIsSubmittingPart3(true);
      setTimeout(() => {
        updateState({
          guardianProfile: {
            fullName: gName,
            dateOfBirth: gDob,
            address: {
              street: gStreet,
              city: gCity,
              province: gProv,
              postalCode: gPc.toUpperCase(),
            },
            language: gLang,
            authorityType: authority,
            authorityFile: { name: fileName, pages: 4 },
            declared: true,
          },
          invite: {
            ...state.invite,
            status: 'verified',
          },
        });
        navigate(`/g/${token || 'demo-token'}/step/1`);
      }, 850);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const partTitles = [
    'Security code & record check',
    'Your contact details',
    'Representation authority & declaration',
  ];

  return (
    <>
      <ActingForBanner dateText={`Invitation from ${state.invite.sentAt}`} />
      <main className="container container--narrow" style={{ paddingBottom: '48px' }}>
        {/* Mobile & Senior-Friendly Progressive Stepper Bar */}
        <div
          role="region"
          aria-label="Verification progress"
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '14px',
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
              Step {currentPart} of 3: {partTitles[currentPart - 1]}
            </span>
            <span style={{ color: 'var(--color-muted)', fontSize: '13px', fontWeight: 600 }}>
              {currentPart === 1 ? 'Part 1 of 3' : currentPart === 2 ? 'Part 2 of 3' : 'Part 3 of 3 (Final)'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  background:
                    step < currentPart
                      ? 'var(--color-success)'
                      : step === currentPart
                      ? 'var(--color-primary)'
                      : '#CBD5E1',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        <h1 style={{ margin: '0 0 8px', fontSize: '28px', lineHeight: 1.25, color: '#0F172A' }}>
          {currentPart === 1
            ? "Before you start, confirm it's you"
            : currentPart === 2
            ? 'Your contact information'
            : 'Your representation authority'}
        </h1>
        <p style={{ margin: '0 0 24px', color: 'var(--color-ink-2)', fontSize: '16px', lineHeight: 1.5 }}>
          {currentPart === 1
            ? `You have been designated as legal representative / Power of Attorney to receive survivor benefits for Jenny Miller (daughter of the late ${memberName}). We check your identity in 3 short steps.`
            : currentPart === 2
            ? `We will send official correspondence and statements for Jenny Miller's pension to this address.`
            : `Please confirm your legal authority to represent Jenny Miller and confirm the legal declaration.`}
        </p>

        {/* Compact summary of completed parts for reassurance and easy editing */}
        {currentPart > 1 && (
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '15px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534' }}>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>✓</span>
              <span>
                <strong>Part 1 completed:</strong> Security code & {memberName}'s record confirmed
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentPart(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#0B5CAD',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Edit
            </button>
          </div>
        )}

        {currentPart === 3 && (
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '15px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534' }}>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>✓</span>
              <span>
                <strong>Part 2 completed:</strong> {gName}, {gCity} {gProv}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentPart(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#0B5CAD',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Edit
            </button>
          </div>
        )}

        {/* ===================== PART 1: SECURITY CODE ===================== */}
        {currentPart === 1 && (
          <form onSubmit={handlePart1Next}>
            {part1Errors.length > 0 && (
              <ErrorSummary title="Please check Part 1 details" errors={part1Errors} />
            )}

            <Card
              padded
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: '20px', color: '#0B335E' }}>
                  1. Your 6-digit security code
                </h2>
                <p style={{ margin: 0, color: 'var(--color-ink-2)', fontSize: '15px', lineHeight: 1.5 }}>
                  We texted a 6-digit security code to your mobile phone ending in{' '}
                  <strong>{state.invite.guardian.mobile.slice(-4) || '1234'}</strong>.
                </p>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: '8px',
                    fontSize: '16px',
                  }}
                >
                  Enter 6-digit security code
                </label>
                <input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '200px',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    height: '52px',
                    padding: '0 14px',
                    font: 'inherit',
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    border:
                      submittedPart1 && cleanCode.length !== 6
                        ? '3px solid var(--color-error)'
                        : '2px solid var(--color-muted-2)',
                    borderRadius: '8px',
                  }}
                />
              </div>

              <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
                <legend
                  style={{
                    fontWeight: 600,
                    marginBottom: '4px',
                    fontSize: '17px',
                    color: '#0F172A',
                    padding: 0,
                  }}
                >
                  The late {memberName}'s date of birth
                </legend>
                <p
                  style={{
                    margin: '0 0 12px',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  This verifies your connection to the deceased member's military casualty file.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <label htmlFor="dd" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      Day
                    </label>
                    <input
                      id="dd"
                      inputMode="numeric"
                      maxLength={2}
                      value={mDay}
                      onChange={(e) => setMDay(e.target.value.replace(/\D/g, ''))}
                      style={{
                        width: '64px',
                        boxSizing: 'border-box',
                        height: '48px',
                        padding: '0 12px',
                        fontSize: '18px',
                        fontWeight: 600,
                        textAlign: 'center',
                        font: 'inherit',
                        border:
                          submittedPart1 && !memberDobValid
                            ? '3px solid var(--color-error)'
                            : '2px solid var(--color-muted-2)',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="mm" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      Month
                    </label>
                    <input
                      id="mm"
                      inputMode="numeric"
                      maxLength={2}
                      value={mMonth}
                      onChange={(e) => setMMonth(e.target.value.replace(/\D/g, ''))}
                      style={{
                        width: '64px',
                        boxSizing: 'border-box',
                        height: '48px',
                        padding: '0 12px',
                        fontSize: '18px',
                        fontWeight: 600,
                        textAlign: 'center',
                        font: 'inherit',
                        border:
                          submittedPart1 && !memberDobValid
                            ? '3px solid var(--color-error)'
                            : '2px solid var(--color-muted-2)',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="yy" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      Year
                    </label>
                    <input
                      id="yy"
                      inputMode="numeric"
                      maxLength={4}
                      value={mYear}
                      onChange={(e) => setMYear(e.target.value.replace(/\D/g, ''))}
                      style={{
                        width: '96px',
                        boxSizing: 'border-box',
                        height: '48px',
                        padding: '0 12px',
                        fontSize: '18px',
                        fontWeight: 600,
                        textAlign: 'center',
                        font: 'inherit',
                        border:
                          submittedPart1 && !memberDobValid
                            ? '3px solid var(--color-error)'
                            : '2px solid var(--color-muted-2)',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                </div>
              </fieldset>
            </Card>

            {isVerifyingPart1 && (
              <div
                className="fade-in-slide"
                style={{
                  marginTop: '16px',
                  background: part1Success ? '#F0FDF4' : '#EFF6FF',
                  border: `1px solid ${part1Success ? '#86EFAC' : '#BFDBFE'}`,
                  borderRadius: '8px',
                  padding: '14px 18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  {part1Success ? (
                    <span className="pop-in" style={{ color: '#16A34A', fontSize: '18px', fontWeight: 700 }}>✓</span>
                  ) : (
                    <span className="spinner spinner--primary" style={{ width: '16px', height: '16px' }} />
                  )}
                  <span style={{ fontSize: '15px', fontWeight: 600, color: part1Success ? '#166534' : '#1E40AF' }}>
                    {part1Success
                      ? `Authentication verified: Casualty file linked for ${memberName}.`
                      : 'Connecting to Government of Canada 2FA service... Validating security code and casualty record.'}
                  </span>
                </div>
                {!part1Success && (
                  <div className="indeterminate-progress">
                    <div className="indeterminate-progress__bar" />
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '28px',
              }}
            >
              <button
                type="submit"
                disabled={isVerifyingPart1}
                className="btn btn--primary"
                style={{
                  padding: '14px 28px',
                  fontSize: '18px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  minHeight: '52px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: isVerifyingPart1 ? 0.9 : 1,
                  cursor: isVerifyingPart1 ? 'wait' : 'pointer',
                }}
              >
                {isVerifyingPart1 ? (
                  <>
                    <span className="spinner" />
                    {part1Success ? '✓ Code & record verified!' : 'Verifying with Government of Canada...'}
                  </>
                ) : (
                  'Continue to Part 2: Your Details ➔'
                )}
              </button>
              <Link to="/" style={{ fontSize: '15px', color: '#64748B' }}>
                I'm not the right person
              </Link>
            </div>
          </form>
        )}

        {/* ===================== PART 2: YOUR DETAILS ===================== */}
        {currentPart === 2 && (
          <form onSubmit={handlePart2Next}>
            {part2Errors.length > 0 && (
              <ErrorSummary title="Please check Part 2 details" errors={part2Errors} />
            )}

            <Card
              padded
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: '20px', color: '#0B335E' }}>
                  2. Your contact information
                </h2>
                <p style={{ margin: 0, color: 'var(--color-ink-2)', fontSize: '15px' }}>
                  We'll mail official pension statements and letters to you here.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    htmlFor="gfull"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '6px',
                      fontSize: '15px',
                    }}
                  >
                    Your full legal name
                  </label>
                  <input
                    id="gfull"
                    autoComplete="name"
                    value={gName}
                    onChange={(e) => setGName(e.target.value)}
                    className={`field__input ${
                      submittedPart2 && !gName.trim() ? 'field__input--error' : ''
                    }`}
                    style={{ height: '48px', fontSize: '16px' }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="gdob"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '6px',
                      fontSize: '15px',
                    }}
                  >
                    Your date of birth
                  </label>
                  <input
                    id="gdob"
                    type="date"
                    autoComplete="bday"
                    value={gDob}
                    onChange={(e) => setGDob(e.target.value)}
                    className={`field__input ${
                      submittedPart2 && !gDob ? 'field__input--error' : ''
                    }`}
                    style={{ height: '48px', fontSize: '16px' }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="gaddr"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: '6px',
                    fontSize: '15px',
                  }}
                >
                  Street address
                </label>
                <input
                  id="gaddr"
                  autoComplete="street-address"
                  value={gStreet}
                  onChange={(e) => setGStreet(e.target.value)}
                  className={`field__input ${
                    submittedPart2 && !gStreet.trim() ? 'field__input--error' : ''
                  }`}
                  style={{ height: '48px', fontSize: '16px' }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '14px',
                }}
              >
                <div>
                  <label
                    htmlFor="gcity"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '6px',
                      fontSize: '15px',
                    }}
                  >
                    City
                  </label>
                  <input
                    id="gcity"
                    autoComplete="address-level2"
                    value={gCity}
                    onChange={(e) => setGCity(e.target.value)}
                    className={`field__input ${
                      submittedPart2 && !gCity.trim() ? 'field__input--error' : ''
                    }`}
                    style={{ height: '48px', fontSize: '16px' }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="gprov"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '6px',
                      fontSize: '15px',
                    }}
                  >
                    Province
                  </label>
                  <select
                    id="gprov"
                    value={gProv}
                    onChange={(e) => setGProv(e.target.value)}
                    className="field__select"
                    style={{ height: '48px', fontSize: '16px' }}
                  >
                    <option value="Ontario">Ontario</option>
                    <option value="Quebec">Quebec</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Alberta">Alberta</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="New Brunswick">New Brunswick</option>
                    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                    <option value="Prince Edward Island">Prince Edward Island</option>
                    <option value="Other…">Other…</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="gpc"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '6px',
                      fontSize: '15px',
                    }}
                  >
                    Postal code
                  </label>
                  <input
                    id="gpc"
                    autoComplete="postal-code"
                    value={gPc}
                    onChange={(e) => setGPc(e.target.value)}
                    placeholder="K1P 5Z9"
                    className={`field__input ${
                      submittedPart2 && !postalCodeValid ? 'field__input--error' : ''
                    }`}
                    style={{ height: '48px', fontSize: '16px' }}
                  />
                </div>
              </div>

              <fieldset style={{ border: 0, margin: '8px 0 0', padding: 0 }}>
                <legend
                  style={{
                    fontWeight: 600,
                    marginBottom: '8px',
                    fontSize: '15px',
                    padding: 0,
                  }}
                >
                  Which language should we use with you?
                </legend>
                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}>
                    <input
                      type="radio"
                      name="glang"
                      checked={gLang === 'en'}
                      onChange={() => setGLang('en')}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    English
                  </label>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}>
                    <input
                      type="radio"
                      name="glang"
                      checked={gLang === 'fr'}
                      onChange={() => setGLang('fr')}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    French
                  </label>
                </div>
              </fieldset>
            </Card>

            <div
              style={{
                display: 'flex',
                gap: '14px',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '28px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setCurrentPart(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn btn--secondary"
                style={{ padding: '14px 24px', fontSize: '16px', minHeight: '50px' }}
              >
                ← Back to Security Code
              </button>
              <button
                type="submit"
                disabled={isSavingPart2}
                className="btn btn--primary"
                style={{
                  padding: '14px 28px',
                  fontSize: '18px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  minHeight: '52px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: isSavingPart2 ? 0.9 : 1,
                  cursor: isSavingPart2 ? 'wait' : 'pointer',
                }}
              >
                {isSavingPart2 ? (
                  <>
                    <span className="spinner" />
                    Saving contact record...
                  </>
                ) : (
                  'Continue to Part 3: Authorization ➔'
                )}
              </button>
            </div>
          </form>
        )}

        {/* ===================== PART 3: AUTHORITY & DECLARATION ===================== */}
        {currentPart === 3 && (
          <form onSubmit={handleFinalSubmit}>
            {part3Errors.length > 0 && (
              <ErrorSummary title="Please confirm legal declaration" errors={part3Errors} />
            )}

            <Card
              padded
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: '20px', color: '#0B335E' }}>
                  3. Proof you can act for Jenny Miller
                </h2>
                <p style={{ margin: 0, color: 'var(--color-ink-2)', fontSize: '15px' }}>
                  Indicate your legal role and upload authorization if available.
                </p>
              </div>

              <div style={{ maxWidth: '420px' }}>
                <label
                  htmlFor="role"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: '6px',
                    fontSize: '15px',
                  }}
                >
                  Your authority role
                </label>
                <select
                  id="role"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value as AuthorityType)}
                  className="field__select"
                  style={{ height: '48px', fontSize: '16px' }}
                >
                  <option value="family">Family member / assisting representative</option>
                  <option value="guardian">Legal guardian</option>
                  <option value="poa">Power of attorney</option>
                  <option value="trustee">Trustee or estate representative</option>
                  <option value="other">Other authorized contact</option>
                </select>
              </div>

              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '15px' }}>
                  Upload document or note (Optional)
                </p>
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  If you have a guardianship paper, POA, or family statement, upload it here. If not, you can continue now and mail it later if requested.
                </p>
                <label
                  id="file-upload"
                  className="file-upload-label"
                  style={{ minHeight: '48px', fontSize: '15px' }}
                >
                  {fileName ? `Attached: ${fileName}` : 'Choose a file (PDF, JPG, PNG)'}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    style={{
                      position: 'absolute',
                      width: '1px',
                      height: '1px',
                      opacity: 0,
                    }}
                  />
                </label>
              </div>

              <div
                style={{
                  background: '#F4F6F8',
                  border: '1px solid #DCE3EB',
                  borderRadius: '8px',
                  padding: '16px 18px',
                  fontSize: '15px',
                  lineHeight: 1.5,
                  color: 'var(--color-ink-2)',
                }}
              >
                <b>Support note:</b> If further documentation is required by the Pension Centre to verify the survivor claim, a counselor will contact you, or you can mail documents to: <em>Government of Canada Pension Centre – Mail Facility, PO Box 9500, Matane QC G4W 0H3</em>.
              </div>
            </Card>

            <label
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                marginTop: '20px',
                padding: '18px 20px',
                background: '#FFFFFF',
                border:
                  submittedPart3 && !declared
                    ? '2px solid var(--color-error)'
                    : '1px solid var(--color-border)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <input
                id="decl-check"
                type="checkbox"
                checked={declared}
                onChange={(e) => setDeclared(e.target.checked)}
                style={{
                  width: '24px',
                  height: '24px',
                  margin: '2px 0 0',
                  accentColor: 'var(--color-primary)',
                  flex: 'none',
                }}
              />
              <span style={{ fontSize: '16px', lineHeight: 1.5, color: '#1E293B' }}>
                <strong>I declare</strong> that I am assisting Jenny Miller (surviving daughter of the late {memberName}) with this application, and that the information I have provided is true and accurate.
              </span>
            </label>

            {isSubmittingPart3 && (
              <div
                className="fade-in-slide"
                style={{
                  marginTop: '16px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '14px 18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className="spinner spinner--primary" style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1E40AF' }}>
                    Authorizing legal representation for Jenny Miller with Canadian Armed Forces casualty registry...
                  </span>
                </div>
                <div className="indeterminate-progress">
                  <div className="indeterminate-progress__bar" />
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '14px',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '28px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setCurrentPart(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn btn--secondary"
                style={{ padding: '14px 24px', fontSize: '16px', minHeight: '50px' }}
              >
                ← Back to Your Details
              </button>
              <button
                type="submit"
                disabled={isSubmittingPart3}
                className="btn btn--primary"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  minHeight: '54px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: isSubmittingPart3 ? 0.9 : 1,
                  cursor: isSubmittingPart3 ? 'wait' : 'pointer',
                }}
              >
                {isSubmittingPart3 ? (
                  <>
                    <span className="spinner" />
                    Authorizing representation...
                  </>
                ) : (
                  'Confirm and open the application ➔'
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
};

export default GuardianVerifyPage;
