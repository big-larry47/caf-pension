import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';

export const GuardianBenefitPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { state, updateState } = useApplication();

  const tokenParam = token || 'guardian-token';
  const guardianName = state.guardianProfile.fullName || 'Margaretha Byers';
  const memberName = mockData.personal.fullName;

  // Selected option state (default to state.benefitOption or 'deferred')
  const [selectedOption, setSelectedOption] = useState<'deferred' | 'transfer' | 'allowance'>(
    (state.benefitOption === 'allowance' || state.benefitOption === 'transfer')
      ? state.benefitOption
      : 'deferred'
  );
  const [confirmed, setConfirmed] = useState<boolean>(state.benefitConfirmed ?? true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Step 2: Benefit Option - CAF Pension Centre';
    window.scrollTo(0, 0);
  }, []);

  // Security check: must be verified
  if (state.invite.status !== 'verified') {
    return <Navigate to={`/g/${tokenParam}`} replace />;
  }

  const options = [
    {
      id: 'deferred' as const,
      title: 'Monthly Survivor Annuity for Jenny Miller',
      amount: '$6,480.00 / month',
      badge: 'Recommended',
      badgeColor: '#166534',
      badgeBg: '#DCFCE7',
      desc: 'A full, regular monthly income deposited directly for Jenny’s living, medical, and educational needs.',
      details: [
        'Guaranteed regular monthly support for life',
        'Indexed annually to inflation (full cost-of-living adjustments)',
        'Protected by the Canadian Forces Superannuation Act (CFSA)',
      ],
    },
    {
      id: 'transfer' as const,
      title: 'Lump-Sum Capital Death Benefit',
      amount: '$1,240,500.00 one-time payout',
      badge: 'Full Settlement',
      badgeColor: '#1E40AF',
      badgeBg: '#DBEAFE',
      desc: 'A single, one-time full settlement payment transferred directly to Jenny’s trust or designated locked-in investment account.',
      details: [
        'Full capital settlement transferred in a single payment',
        'Can be managed through a court-approved trust or estate portfolio',
        'No further ongoing monthly pension disbursements',
      ],
    },
    {
      id: 'allowance' as const,
      title: 'Annual Allowance (Reduced Monthly Income)',
      amount: '$5,120.00 / month',
      badge: 'Flexible Early Liquidity',
      badgeColor: '#854D0E',
      badgeBg: '#FEF9C3',
      desc: 'A lower monthly payment starting immediately, designed to provide immediate flexible liquidity for transition costs.',
      details: [
        'Immediate disbursement with simplified processing',
        'Reduced monthly calculation for early transition support',
        'Eligible for standard annual cost-of-living adjustments',
      ],
    },
  ];

  const handleProceed = () => {
    if (!confirmed) {
      setError('Please check the confirmation box below to verify your survivor benefit choice.');
      return;
    }
    setError(null);
    updateState({
      benefitOption: selectedOption,
      benefitConfirmed: true,
    });
    navigate(`/g/${tokenParam}/form-package`);
  };

  return (
    <>
      <ActingForBanner dateText="Pension File: CAF-SRV-2026-9082" />

      <main
        className="container"
        style={{
          maxWidth: '860px',
          padding: '24px 16px 80px',
        }}
      >
        {/* Navigation Back Link */}
        <div style={{ marginBottom: '14px' }}>
          <Link
            to={`/g/${tokenParam}/case-file`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0B3866',
              textDecoration: 'none',
            }}
          >
            <span>&larr;</span>
            <span style={{ textDecoration: 'underline' }}>Back to General's Military Dossier</span>
          </Link>
        </div>

        {/* Step Progression Bar */}
        <div
          style={{
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: 600 }}>
            <span>⚖️ Step 2 of 3: Choose Benefit Option</span>
            <span style={{ color: '#64748B', fontWeight: 400 }}> &rarr; Next: Step 3 Download Form Package</span>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0B3866',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              padding: '9px 18px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(11, 56, 102, 0.2)',
            }}
          >
            <span>Proceed to Download Form</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Header Section */}
        <header style={{ marginBottom: '24px' }}>
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
            <span>🔒 Verified Representative Choice</span>
            <span>•</span>
            <span>Ref: CAF-SRV-2026-9082</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 4.5vw, 32px)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.2,
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}
          >
            Choose Survivor Benefit Option
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.5,
            }}
          >
            As Power of Attorney for <b>Jenny Miller</b>, select how the pension benefits of the late{' '}
            <b>General Kelvin Miller</b> should be structured. Your election will be pre-filled into official Form CF-FC 2489.
          </p>
        </header>

        {/* Beneficiary Summary Card */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em' }}>
              Sole Dependent Beneficiary
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              Jenny Miller (Daughter)
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
              Deceased Member: General Kelvin Miller (Reg: 554321 · Canadian Army)
            </div>
          </div>
          <div
            style={{
              background: '#DCFCE7',
              color: '#15803D',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            ✓ Entitlement Active
          </div>
        </div>

        {/* Benefit Option Selection Cards */}
        <section style={{ marginBottom: '28px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>🍁</span>
            <span>Available Survivor Benefit Options</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  style={{
                    background: isSelected ? '#F0F9FF' : '#FFFFFF',
                    border: isSelected ? '2px solid #0284C7' : '1px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected
                      ? '0 4px 14px rgba(2, 132, 199, 0.12)'
                      : '0 2px 6px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    {/* Custom Radio Circle */}
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: isSelected ? '7px solid #0284C7' : '2px solid #94A3B8',
                        background: '#FFFFFF',
                        flexShrink: 0,
                        marginTop: '3px',
                        boxSizing: 'border-box',
                        transition: 'all 0.15s ease',
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: '6px',
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: 800,
                            color: isSelected ? '#0369A1' : '#0F172A',
                          }}
                        >
                          {opt.title}
                        </h3>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            color: opt.badgeColor,
                            background: opt.badgeBg,
                            padding: '3px 9px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {opt.badge}
                        </span>
                      </div>

                      {/* Amount */}
                      <div
                        style={{
                          fontSize: '22px',
                          fontWeight: 900,
                          color: '#0F172A',
                          marginBottom: '8px',
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        {opt.amount}
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '14px',
                          color: '#334155',
                          lineHeight: 1.5,
                        }}
                      >
                        {opt.desc}
                      </p>

                      {/* Features bullets */}
                      <div
                        style={{
                          background: isSelected ? 'rgba(2, 132, 199, 0.06)' : '#F8FAFC',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          border: isSelected ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid #E2E8F0',
                        }}
                      >
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                          {opt.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Confirmation Checkbox Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: error ? '2px solid #DC2626' : '1px solid #CBD5E1',
            borderRadius: '12px',
            padding: '18px 20px',
            marginBottom: '28px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          }}
        >
          <label
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                if (e.target.checked) setError(null);
              }}
              style={{
                width: '22px',
                height: '22px',
                margin: '2px 0 0',
                accentColor: '#0B3866',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '15px', lineHeight: 1.5, color: '#1E293B' }}>
              <strong>I confirm this survivor benefit election for Jenny Miller.</strong> I understand this election establishes the payment disbursement structure for the CAF Survivor Pension under the Canadian Forces Superannuation Act.
            </span>
          </label>

          {error && (
            <div style={{ marginTop: '10px', fontSize: '13px', color: '#DC2626', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <button
            type="button"
            onClick={handleProceed}
            style={{
              width: '100%',
              maxWidth: '520px',
              minHeight: '56px',
              background: '#0B3866',
              color: '#FFFFFF',
              fontSize: '17px',
              fontWeight: 700,
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(11, 56, 102, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 24px',
              boxSizing: 'border-box',
              transition: 'background 0.15s ease',
            }}
          >
            <span>Confirm Benefit Option & Proceed to Download Form</span>
            <span style={{ fontSize: '20px' }}>&rarr;</span>
          </button>

          <Link
            to={`/g/${tokenParam}/case-file`}
            style={{
              fontSize: '14px',
              color: '#475569',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            &larr; Back to General's Military Dossier
          </Link>

          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
            Next: Download your pre-filled official Form CF-FC 2489 and review instructions to email it to support@cafpension.site
          </p>
        </div>
      </main>
    </>
  );
};

export default GuardianBenefitPage;
