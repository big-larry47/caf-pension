import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { Card } from '../components/Card';

export const VerifyPage: React.FC = () => {
  const { state, updateState } = useApplication();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Confirm it's you - CAF Pension Centre";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/applicant');
  };

  return (
    <main className="container container--narrow">
      <Link to="/" style={{ fontSize: '15px' }}>
        ‹ Back
      </Link>
      <h1 style={{ margin: '12px 0 8px', fontSize: '34px', lineHeight: 1.2 }}>
        Confirm it's you
      </h1>
      <p style={{ margin: '0 0 28px', color: 'var(--color-ink-2)' }}>
        The first time you sign in, we link your account to your pension record.
        You only do this once.
      </p>

      <form onSubmit={handleSubmit}>
        <Card
          padded
          style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}
        >
          <h2 style={{ margin: 0, fontSize: '22px' }}>
            1. Find your pension record
          </h2>
          <div>
            <label
              htmlFor="svc"
              style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}
            >
              Service number
            </label>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '15px',
                color: 'var(--color-muted)',
              }}
            >
              One letter followed by 8 digits, for example A12345678
            </p>
            <input
              id="svc"
              type="text"
              autoComplete="off"
              placeholder="A12345678"
              value={state.serviceNumber}
              onChange={(e) => updateState({ serviceNumber: e.target.value })}
              style={{
                width: '220px',
                maxWidth: '100%',
                boxSizing: 'border-box',
                height: '48px',
                padding: '0 14px',
                font: 'inherit',
                color: 'var(--color-ink)',
                background: '#FFFFFF',
                border: '2px solid var(--color-muted-2)',
                borderRadius: 'var(--radius-input)',
              }}
            />
          </div>

          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend style={{ fontWeight: 600, marginBottom: '8px', padding: 0 }}>
              Date of birth
            </legend>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <label
                  htmlFor="dd"
                  style={{ display: 'block', fontSize: '15px' }}
                >
                  Day
                </label>
                <input
                  id="dd"
                  inputMode="numeric"
                  value={state.dobDay}
                  onChange={(e) => updateState({ dobDay: e.target.value })}
                  style={{
                    width: '64px',
                    boxSizing: 'border-box',
                    height: '48px',
                    padding: '0 12px',
                    font: 'inherit',
                    border: '2px solid var(--color-muted-2)',
                    borderRadius: 'var(--radius-input)',
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="mm"
                  style={{ display: 'block', fontSize: '15px' }}
                >
                  Month
                </label>
                <input
                  id="mm"
                  inputMode="numeric"
                  value={state.dobMonth}
                  onChange={(e) => updateState({ dobMonth: e.target.value })}
                  style={{
                    width: '64px',
                    boxSizing: 'border-box',
                    height: '48px',
                    padding: '0 12px',
                    font: 'inherit',
                    border: '2px solid var(--color-muted-2)',
                    borderRadius: 'var(--radius-input)',
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="yy"
                  style={{ display: 'block', fontSize: '15px' }}
                >
                  Year
                </label>
                <input
                  id="yy"
                  inputMode="numeric"
                  value={state.dobYear}
                  onChange={(e) => updateState({ dobYear: e.target.value })}
                  style={{
                    width: '96px',
                    boxSizing: 'border-box',
                    height: '48px',
                    padding: '0 12px',
                    font: 'inherit',
                    border: '2px solid var(--color-muted-2)',
                    borderRadius: 'var(--radius-input)',
                  }}
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="sin"
              style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}
            >
              Last 3 digits of your Social Insurance Number
            </label>
            <input
              id="sin"
              inputMode="numeric"
              maxLength={3}
              value={state.sinLast3}
              onChange={(e) => updateState({ sinLast3: e.target.value })}
              style={{
                width: '96px',
                boxSizing: 'border-box',
                height: '48px',
                padding: '0 12px',
                font: 'inherit',
                border: '2px solid var(--color-muted-2)',
                borderRadius: 'var(--radius-input)',
              }}
            />
          </div>
        </Card>

        <Card
          padded
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '22px' }}>
            2. Enter your security code
          </h2>
          <p style={{ margin: 0, color: 'var(--color-ink-2)' }}>
            We sent a 6-digit code to the email on your pension file,
            j•••••@gmail.com. It expires in 10 minutes.
          </p>
          <div>
            <label
              htmlFor="otp"
              style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}
            >
              Security code
            </label>
            <input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={state.otp}
              onChange={(e) => updateState({ otp: e.target.value })}
              style={{
                width: '180px',
                boxSizing: 'border-box',
                height: '52px',
                padding: '0 14px',
                font: 'inherit',
                fontSize: '22px',
                letterSpacing: '0.3em',
                border: '2px solid var(--color-muted-2)',
                borderRadius: 'var(--radius-input)',
              }}
            />
          </div>
          <p style={{ margin: 0, fontSize: '15px' }}>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Send a new code
            </a>{' '}
            ·{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Send it by text message instead
            </a>
          </p>
        </Card>

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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              padding: '0 32px',
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              fontWeight: 600,
              border: 0,
              borderRadius: 'var(--radius-input)',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            Confirm and continue
          </button>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ fontSize: '15px' }}
          >
            I can't find my service number
          </a>
        </div>
      </form>
    </main>
  );
};
