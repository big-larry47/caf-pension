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

  // Section 1
  const [code, setCode] = useState('123456');
  const [mDay, setMDay] = useState('14');
  const [mMonth, setMMonth] = useState('08');
  const [mYear, setMYear] = useState('1958');

  // Section 2
  const [gName, setGName] = useState(state.guardianProfile.fullName || 'Sarah Villa');
  const [gDob, setGDob] = useState(state.guardianProfile.dateOfBirth || '1988-04-12');
  const [gStreet, setGStreet] = useState(state.guardianProfile.address.street || '120 Queen Street, Apt 4B');
  const [gCity, setGCity] = useState(state.guardianProfile.address.city || 'Ottawa');
  const [gProv, setGProv] = useState(state.guardianProfile.address.province || 'Ontario');
  const [gPc, setGPc] = useState(state.guardianProfile.address.postalCode || 'K1P 5Z9');
  const [gLang, setGLang] = useState<'en' | 'fr'>(state.guardianProfile.language || 'en');

  // Section 3
  const [authority, setAuthority] = useState<AuthorityType>(state.guardianProfile.authorityType || 'poa');
  const [fileName, setFileName] = useState(state.guardianProfile.authorityFile?.name || 'power-of-attorney.pdf');
  const [declared, setDeclared] = useState(state.guardianProfile.declared ?? true);

  const [submitted, setSubmitted] = useState(false);

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

  const errors: FormError[] = [];
  if (submitted) {
    if (cleanCode.length !== 6) {
      errors.push({ targetId: 'otp', message: 'Enter your 6-digit security code' });
    }
    if (!memberDobValid) {
      errors.push({
        targetId: 'dd',
        message: "Enter the member's correct date of birth (14 / 08 / 1958)",
      });
    }
    if (!gName.trim()) {
      errors.push({ targetId: 'gfull', message: 'Enter your full name' });
    }
    if (!gDob) {
      errors.push({ targetId: 'gdob', message: 'Enter your date of birth' });
    }
    if (!gStreet.trim()) {
      errors.push({ targetId: 'gaddr', message: 'Enter your street address' });
    }
    if (!gCity.trim()) {
      errors.push({ targetId: 'gcity', message: 'Enter your city' });
    }
    if (!postalCodeValid) {
      errors.push({
        targetId: 'gpc',
        message: 'Enter a valid Canadian postal code (e.g. K1P 5Z9)',
      });
    }
    if (!fileName) {
      errors.push({
        targetId: 'file-upload',
        message: 'Upload proof of your authority to act for the member',
      });
    }
    if (!declared) {
      errors.push({
        targetId: 'decl-check',
        message: 'You must confirm the legal declaration to proceed',
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (
      cleanCode.length === 6 &&
      memberDobValid &&
      gName.trim() &&
      gDob &&
      gStreet.trim() &&
      gCity.trim() &&
      postalCodeValid &&
      fileName &&
      declared
    ) {
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
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <>
      <ActingForBanner dateText={`Invitation from ${state.invite.sentAt}`} />
      <main className="container container--narrow">
        <h1 style={{ margin: '0 0 8px', fontSize: '34px', lineHeight: 1.2 }}>
          Before you start, confirm it's you
        </h1>
        <p style={{ margin: '0 0 28px', color: 'var(--color-ink-2)' }}>
          You have been designated as legal guardian / representative to receive survivor benefits
          for Jenny Villa (daughter of the late {memberName}). We need to check who you are
          and that you have legal authority to act on her behalf.
        </p>

        {errors.length > 0 && (
          <ErrorSummary title="Check your details" errors={errors} />
        )}

        <form onSubmit={handleSubmit}>
          <Card
            padded
            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
          >
            <h2 style={{ margin: 0, fontSize: '22px' }}>
              1. Your security code
            </h2>
            <p style={{ margin: 0, color: 'var(--color-ink-2)' }}>
              We texted a 6-digit code to your mobile ending in{' '}
              {state.invite.guardian.mobile.slice(-4) || '1234'}.
            </p>
            <div>
              <label
                htmlFor="otp"
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                Security code
              </label>
              <input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '180px',
                  boxSizing: 'border-box',
                  height: '52px',
                  padding: '0 14px',
                  font: 'inherit',
                  fontSize: '22px',
                  letterSpacing: '0.3em',
                  border:
                    submitted && cleanCode.length !== 6
                      ? '3px solid var(--color-error)'
                      : '2px solid var(--color-muted-2)',
                  borderRadius: '6px',
                }}
              />
            </div>

            <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
              <legend
                style={{
                  fontWeight: 600,
                  marginBottom: '2px',
                  padding: 0,
                }}
              >
                The late {memberName}'s date of birth
              </legend>
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: '15px',
                  color: 'var(--color-muted)',
                }}
              >
                This confirms your relation to the deceased member's military service record.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <label htmlFor="dd" style={{ display: 'block', fontSize: '15px' }}>
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
                      font: 'inherit',
                      border:
                        submitted && !memberDobValid
                          ? '3px solid var(--color-error)'
                          : '2px solid var(--color-muted-2)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="mm" style={{ display: 'block', fontSize: '15px' }}>
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
                      font: 'inherit',
                      border:
                        submitted && !memberDobValid
                          ? '3px solid var(--color-error)'
                          : '2px solid var(--color-muted-2)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="yy" style={{ display: 'block', fontSize: '15px' }}>
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
                      font: 'inherit',
                      border:
                        submitted && !memberDobValid
                          ? '3px solid var(--color-error)'
                          : '2px solid var(--color-muted-2)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>
            </fieldset>
          </Card>

          <Card
            padded
            style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '22px' }}>2. Your details</h2>
            <p style={{ margin: 0, color: 'var(--color-ink-2)' }}>
              We'll send letters about {memberName}'s pension to you at this
              address.
            </p>
            <div className="form-grid">
              <div>
                <label
                  htmlFor="gfull"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Full name
                </label>
                <input
                  id="gfull"
                  autoComplete="name"
                  value={gName}
                  onChange={(e) => setGName(e.target.value)}
                  className={`field__input ${
                    submitted && !gName.trim() ? 'field__input--error' : ''
                  }`}
                />
              </div>
              <div>
                <label
                  htmlFor="gdob"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: '6px',
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
                    submitted && !gDob ? 'field__input--error' : ''
                  }`}
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
                  submitted && !gStreet.trim() ? 'field__input--error' : ''
                }`}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <label
                  htmlFor="gcity"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: '6px',
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
                    submitted && !gCity.trim() ? 'field__input--error' : ''
                  }`}
                />
              </div>
              <div>
                <label
                  htmlFor="gprov"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: '6px',
                  }}
                >
                  Province
                </label>
                <select
                  id="gprov"
                  value={gProv}
                  onChange={(e) => setGProv(e.target.value)}
                  className="field__select"
                >
                  <option value="Ontario">Ontario</option>
                  <option value="Quebec">Quebec</option>
                  <option value="Nova Scotia">Nova Scotia</option>
                  <option value="British Columbia">British Columbia</option>
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
                    submitted && !postalCodeValid ? 'field__input--error' : ''
                  }`}
                />
              </div>
            </div>

            <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
              <legend
                style={{
                  fontWeight: 600,
                  marginBottom: '8px',
                  padding: 0,
                }}
              >
                Which language should we use with you?
              </legend>
              <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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

          <Card
            padded
            style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '22px' }}>
              3. Proof you can act for them
            </h2>
            <div style={{ maxWidth: '420px' }}>
              <label
                htmlFor="role"
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                Your authority
              </label>
              <select
                id="role"
                value={authority}
                onChange={(e) => setAuthority(e.target.value as AuthorityType)}
                className="field__select"
              >
                <option value="poa">Power of attorney</option>
                <option value="guardian">Court-appointed guardian</option>
                <option value="trustee">Trustee or committee</option>
                <option value="other">Other legal representative</option>
              </select>
            </div>

            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>
                Upload the document
              </p>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: '15px',
                  color: 'var(--color-muted)',
                }}
              >
                A photo or scan of every page. PDF, JPG or PNG, up to 10 MB. This
                starts our check.
              </p>
              <label
                id="file-upload"
                className="file-upload-label"
                style={
                  submitted && !fileName
                    ? { borderColor: 'var(--color-error)' }
                    : undefined
                }
              >
                {fileName ? `Attached: ${fileName}` : 'Choose a file'}
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
                background: 'var(--color-warning-bg)',
                border: '1px solid var(--color-warning-border)',
                borderRadius: '8px',
                padding: '16px 18px',
                fontSize: '16px',
              }}
            >
              <b>You'll also need to mail the original.</b> Before any payment,
              we need the original document, a notarized copy or a certified true
              copy. Send it by courier to:
              <br />
              Government of Canada Pension Centre – Mail Facility, PO Box 9500,
              Matane QC G4W 0H3. Write {memberName}'s service number on it.
            </div>
          </Card>

          <label
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              marginTop: '20px',
              padding: '16px 20px',
              background: '#FFFFFF',
              border:
                submitted && !declared
                  ? '2px solid var(--color-error)'
                  : '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
          >
            <input
              id="decl-check"
              type="checkbox"
              checked={declared}
              onChange={(e) => setDeclared(e.target.checked)}
              style={{
                width: '22px',
                height: '22px',
                margin: '2px 0 0',
                accentColor: 'var(--color-primary)',
                flex: 'none',
              }}
            />
            <span>
              I declare that I am legally appointed to act on behalf of Jenny Villa
              (beneficiary and surviving daughter of the late {memberName}), and that the information I give is true.
            </span>
          </label>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '28px',
            }}
          >
            <button
              type="submit"
              className="btn btn--primary"
              style={{ padding: '0 32px' }}
            >
              Confirm and open the application
            </button>
            <Link to="/" style={{ fontSize: '15px' }}>
              I'm not the right person
            </Link>
          </div>
        </form>
      </main>
    </>
  );
};
