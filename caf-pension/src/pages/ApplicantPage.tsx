import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { RadioCard } from '../components/RadioCard';
import { Callout } from '../components/Callout';

export const ApplicantPage: React.FC = () => {
  const { state, updateState } = useApplication();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Who is applying - CAF Pension Centre';
  }, []);

  const applicantOptions = [
    {
      id: 'member' as const,
      title: 'I am the CAF member applying for my own pension',
      hint: 'You are releasing or have released from the Regular or Reserve Force.',
    },
    {
      id: 'poa' as const,
      title: 'I manage pension affairs for a member',
      hint: 'You hold a power of attorney for the member.',
    },
    {
      id: 'survivor' as const,
      title: 'I am a survivor or represent an estate',
      hint: 'The member has died.',
    },
  ];

  return (
    <main className="container container--narrow">
      <Link to="/verify" style={{ fontSize: '15px' }}>
        ‹ Back
      </Link>
      <h1 style={{ margin: '12px 0 8px', fontSize: '34px', lineHeight: 1.2 }}>
        Who is applying?
      </h1>
      <p style={{ margin: '0 0 24px', color: 'var(--color-ink-2)' }}>
        This tells us which application to show you.
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
        <legend className="sr-only">Who is applying</legend>
        {applicantOptions.map((opt) => (
          <RadioCard
            key={opt.id}
            id={`who-${opt.id}`}
            name="who"
            checked={state.who === opt.id}
            onChange={() => updateState({ who: opt.id })}
            title={opt.title}
            hint={opt.hint}
          />
        ))}
      </fieldset>

      {state.who === 'member' && (
        <fieldset style={{ border: 0, margin: '28px 0 0', padding: 0 }}>
          <legend
            style={{
              fontWeight: 600,
              fontSize: '20px',
              marginBottom: '10px',
              padding: 0,
            }}
          >
            Which force were you in when you released?
          </legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="radio"
                name="force"
                checked={state.force === 'regular'}
                onChange={() => updateState({ force: 'regular' })}
                style={{
                  width: '22px',
                  height: '22px',
                  margin: 0,
                  accentColor: 'var(--color-primary)',
                }}
              />
              Regular Force
            </label>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="radio"
                name="force"
                checked={state.force === 'reserve'}
                onChange={() => updateState({ force: 'reserve' })}
                style={{
                  width: '22px',
                  height: '22px',
                  margin: 0,
                  accentColor: 'var(--color-primary)',
                }}
              />
              Reserve Force
            </label>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="radio"
                name="force"
                checked={state.force === 'both'}
                onChange={() => updateState({ force: 'both' })}
                style={{
                  width: '22px',
                  height: '22px',
                  margin: 0,
                  accentColor: 'var(--color-primary)',
                }}
              />
              I served in both
            </label>
          </div>
        </fieldset>
      )}

      {state.who === 'poa' && (
        <Callout
          variant="warning"
          style={{ marginTop: '24px', padding: '18px 20px', fontSize: '16px' }}
        >
          You can fill in the application online. The Pension Centre also needs
          the original, notarized or certified true copy of the power of attorney
          by mail before any payment starts.
        </Callout>
      )}

      {state.who === 'survivor' && (
        <Callout
          variant="info"
          style={{ marginTop: '24px', padding: '18px 20px', fontSize: '16px' }}
        >
          Applying for survivor and estate pension benefits on behalf of surviving daughter
          Jenny Villa (child of the late General Felix Villa).
        </Callout>
      )}

      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: '32px',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/application')}
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
          Continue
        </button>
      </div>
    </main>
  );
};
