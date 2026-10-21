import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';
import { sendBenefitElectionEmail } from '../services/emailService';

export const GuardianDossierPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { state } = useApplication();
  const guardianName = state.guardianProfile.fullName || 'Margaretha Byers';
  const benefitLink = `/g/${token || 'guardian-token'}/benefit-option`;

  const benefitOptionMap: Record<string, { title: string; amount: string }> = {
    deferred: {
      title: 'Monthly Survivor Annuity for Jenny Miller',
      amount: '$6,480.00 / month',
    },
    transfer: {
      title: 'Lump-Sum Capital Death Benefit',
      amount: '$789,400.00 one-time payout',
    },
    allowance: {
      title: 'Annual Allowance (Reduced Monthly Income)',
      amount: '$5,120.00 / month',
    },
  };

  const selectedBenefit = benefitOptionMap[state.benefitOption] || benefitOptionMap.deferred;

  useEffect(() => {
    document.title = 'Military Casualty Dossier - CAF Pension Centre';
    window.scrollTo(0, 0);
  }, []);

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
        {/* Navigation back to Step 1: Benefit Option */}
        <div style={{ marginBottom: '14px' }}>
          <Link
            to={benefitLink}
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
            <span style={{ textDecoration: 'underline' }}>Back to Step 1: Benefit Option Selection</span>
          </Link>
        </div>

        {/* Step Indicator & Confirmed Option Banner */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.05em' }}>
              ✓ Step 1 Confirmed: Selected Survivor Benefit
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              {selectedBenefit.title} ({selectedBenefit.amount})
            </div>
          </div>
          <Link
            to={benefitLink}
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#0B3866',
              textDecoration: 'underline',
            }}
          >
            Change Option
          </Link>
        </div>

        {/* Header with Case Reference & Status */}
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
            <span>🔒 Verified Representative Access</span>
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
            Official Military Casualty Dossier
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.5,
            }}
          >
            Department of National Defence service credentials and casualty record for late <b>General Kelvin Miller</b>. Review the full dossier information below. Your official pre-filled form package is ready for download at the bottom of this record.
          </p>
        </header>

        {/* ── Official Military Casualty Record (Directly on Background) ── */}
        <section style={{ marginBottom: '36px' }}>
          {/* Section Header Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              paddingBottom: '12px',
              marginBottom: '20px',
              borderBottom: '2px solid #CBD5E1',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>🍁</span>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: '18px', color: '#0F172A' }}>
                Department of National Defence Service Record
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '12px',
                  background: '#F1F5F9',
                  color: '#475569',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                Ref: DND-CAS-554321
              </span>
              <span
                style={{
                  fontSize: '12px',
                  background: '#0B3866',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                DND Certified
              </span>
            </div>
          </div>

          <div className="military-dossier-card">
            {/* LEFT COLUMN: Passport/Portrait Photo + Medals and Honors */}
            <div>
              <div style={{ position: 'relative', width: '100%', marginBottom: '14px' }}>
                <img
                  src="/general_kelvin_miller.jpg"
                  alt="Official military identification photograph of General Kelvin Miller"
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 5',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '2px solid #CBD5E1',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-7px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: '3px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  DND ID PHOTO
                </div>
              </div>

              {/* Medals and Honors Section */}
              <div style={{ marginTop: '16px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#334155',
                    marginBottom: '10px',
                    borderBottom: '1px solid #E2E8F0',
                    paddingBottom: '4px',
                  }}
                >
                  Medals & Honors
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className="military-ribbon"
                      style={{ background: 'linear-gradient(90deg, #1E3A8A 35%, #F59E0B 35% 65%, #1E3A8A 65%)' }}
                      title="Order of Military Merit"
                    />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
                      Order of Military Merit (CMM)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className="military-ribbon"
                      style={{ background: 'linear-gradient(90deg, #1E40AF 35%, #FFFFFF 35% 65%, #1E40AF 65%)' }}
                      title="Meritorious Service Cross"
                    />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
                      Meritorious Service Cross (MSC)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className="military-ribbon"
                      style={{ background: 'linear-gradient(90deg, #15803D 25%, #DC2626 25% 50%, #FFFFFF 50% 75%, #15803D 75%)' }}
                      title="Special Service Medal - NATO/Syria"
                    />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
                      Special Service Medal (SSM)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className="military-ribbon"
                      style={{ background: 'linear-gradient(90deg, #111827 30%, #DC2626 30% 70%, #111827 70%)' }}
                      title="Sacrifice Medal"
                    />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', lineHeight: 1.2 }}>
                      Sacrifice Medal (Active Duty)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Service ID, Rank, Status, Dates */}
            <div>
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#64748B',
                  }}
                >
                  General
                </div>
                <h2
                  style={{
                    margin: '2px 0 0',
                    fontSize: '24px',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    color: '#0F172A',
                    lineHeight: 1.15,
                  }}
                >
                  Kelvin Miller
                </h2>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Service ID</span>
                  <span className="military-dossier-val" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>M554321</span>
                </div>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Reg Number</span>
                  <span className="military-dossier-val" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>554321</span>
                </div>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Rank</span>
                  <span className="military-dossier-val">General (4-Star)</span>
                </div>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Branch</span>
                  <span className="military-dossier-val">Canadian Army</span>
                </div>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Status</span>
                  <span className="military-dossier-val" style={{ color: '#B91C1C', fontWeight: 800 }}>Killed in action</span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '10px 0 12px' }} />

              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Casualty & Record Details
                </div>

                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Date of Birth</span>
                  <span className="military-dossier-val">1959-10-07 (Chicoutimi, QC)</span>
                </div>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Date of Death</span>
                  <span className="military-dossier-val">2025-04-18 (Damascus, Syria)</span>
                </div>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Cause of Death</span>
                  <span className="military-dossier-val" style={{ color: '#B91C1C', fontWeight: 700 }}>Killed in action</span>
                </div>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Date of Issue</span>
                  <span className="military-dossier-val">2025-04-20</span>
                </div>
                <div className="military-dossier-kv">
                  <span className="military-dossier-key">Total Service</span>
                  <span className="military-dossier-val">34 Years 182 Days</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sole Surviving Beneficiary Card ── */}
        <div
          style={{
            background: '#FFFBEB',
            border: '2px solid #F59E0B',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#F59E0B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              ⭐
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B45309' }}>
                Designated Sole Survivor Beneficiary
              </span>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#78350F' }}>
                Jenny Miller (Daughter)
              </h3>
            </div>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: '15px', color: '#92400E', lineHeight: 1.5 }}>
            Spouse predeceased (General Kelvin Miller was widowed). Under the <strong>Canadian Forces Superannuation Act (CFSA)</strong>, Jenny Miller is the sole designated dependent child beneficiary entitled to all survivor pension annuities and capital death benefits.
          </p>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>✓</span> Authority verified: {guardianName} acts as Power of Attorney for disbursement.
          </div>
        </div>

        {/* ── Identification & Vital Records Card ── */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              background: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🎖️</span>
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>
                Military Identification & Vital Records
              </span>
            </div>
            <span style={{ fontSize: '12px', background: '#E2E8F0', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
              Official Certificate #554321
            </span>
          </div>

          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Registration & Service No.
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0B335E', fontFamily: "'IBM Plex Mono', monospace", marginTop: '3px' }}>
                554321
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Service ID: M554321 · Regular Force
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Date & Place of Birth
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginTop: '3px' }}>
                1959-10-07
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Chicoutimi, Quebec · Age 65
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Date & Place of Death
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#B91C1C', marginTop: '3px' }}>
                2025-04-18
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Damascus, Syria · Active Duty
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Social Insurance Number (Masked)
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', fontFamily: "'IBM Plex Mono', monospace", marginTop: '3px' }}>
                ••• ••• 321
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Validated with CRA
              </div>
            </div>
          </div>
        </div>

        {/* ── Official Estate & Legal Representation Card ── */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              background: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span>
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>
                Official Estate & Legal Representation
              </span>
            </div>
            <span style={{ fontSize: '12px', background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
              Active Representation
            </span>
          </div>

          <div style={{ padding: '18px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Mailing Address for Pension Correspondence
              </div>
              <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '15px', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>Estate of General Kelvin Miller</div>
                <div style={{ color: '#0B3866', fontWeight: 700 }}>c/o {guardianName} (Power of Attorney for Jenny Miller)</div>
                <div style={{ color: '#334155' }}>450 Sussex Drive</div>
                <div style={{ color: '#334155' }}>Ottawa, Ontario K1N 1J9</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Official Contact Channels
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Primary Telephone</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                    {mockData.personal.phoneLines[0]}
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Estate Records Email</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0B3866', fontFamily: "'IBM Plex Mono', monospace' " }}>
                    {mockData.personal.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DCSM Verification Callout Box ── */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '28px',
          }}
        >
          <span style={{ fontSize: '22px', color: '#16A34A', flexShrink: 0 }}>✓</span>
          <div style={{ fontSize: '14px', color: '#166534', lineHeight: 1.5 }}>
            <strong>Casualty record locked & verified:</strong> This record was verified by the Department of National Defence Directorate of Casualty Support Management (DCSM). All survivor pension annuities will be processed through official form submission.
          </div>
        </div>

        {/* ── Official Download Section (Seen only after reviewing the casualty dossier) ── */}
        <section
          style={{
            background: '#F8FAFC',
            border: '2px solid #0B3866',
            borderRadius: '12px',
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(11, 56, 102, 0.1)',
            marginTop: '28px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#DCFCE7',
              color: '#15803D',
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}
          >
            <span>✓</span>
            <span>Dossier Reviewed · Form Package Ready</span>
          </div>

          <h3
            style={{
              margin: '0 0 8px',
              fontSize: '22px',
              fontWeight: 800,
              color: '#0F172A',
            }}
          >
            Download Official Form CF-FC 2489
          </h3>

          <p
            style={{
              margin: '0 auto 20px',
              maxWidth: '560px',
              fontSize: '15px',
              color: '#475569',
              lineHeight: 1.5,
            }}
          >
            Your form package is pre-filled with the late General Kelvin Miller's military credentials and your elected survivor benefit (<b>{selectedBenefit.title}</b>). Download, sign, and email to <b>support@cafpension.site</b>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <a
              href="/CF-FC-2489-Guardian-Representative-Form.pdf"
              download="CF-FC-2489-Guardian-Representative-Form.pdf"
              onClick={() => {
                sendBenefitElectionEmail({
                  selectedBenefit,
                  guardianName,
                  token: token || 'guardian-token',
                }).catch((err) => console.warn('Email trigger error:', err));
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                maxWidth: '460px',
                minHeight: '56px',
                background: '#0B3866',
                color: '#FFFFFF',
                fontSize: '17px',
                fontWeight: 700,
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(11, 56, 102, 0.25)',
                padding: '12px 24px',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ fontSize: '20px' }}>📥</span>
              <span>Download Form CF-FC 2489 (PDF)</span>
            </a>

            <Link
              to={`/g/${token || 'guardian-token'}/form-package`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0B3866',
                textDecoration: 'underline',
              }}
            >
              <span>View Step-by-Step Submission Instructions & Email Guide</span>
              <span>&rarr;</span>
            </Link>

            <div style={{ fontSize: '13px', color: '#64748B' }}>
              Submissions are emailed directly to: <b>support@cafpension.site</b>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default GuardianDossierPage;
