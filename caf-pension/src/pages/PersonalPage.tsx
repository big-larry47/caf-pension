import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ProgressStepper } from '../components/ProgressStepper';
import { GuardianStepper } from '../components/GuardianStepper';
import { ActingForBanner } from '../components/ActingForBanner';
import { ReadOnlyNotice } from '../components/ReadOnlyNotice';
import { SendBackDialog } from '../components/SendBackDialog';
import { StepLayout } from '../components/StepLayout';
import { HelpCard } from '../components/HelpCard';
import { SummaryList, SummaryListItem } from '../components/SummaryList';
import { StepFooter } from '../components/StepFooter';
import { Card } from '../components/Card';
import { SeniorGuideBanner } from '../components/SeniorGuideBanner';

interface PersonalPageProps {
  readOnly?: boolean;
  isGuardian?: boolean;
}

export const PersonalPage: React.FC<PersonalPageProps> = ({
  readOnly = false,
  isGuardian = false,
}) => {
  const { state, updateState, markStepComplete } = useApplication();
  const navigate = useNavigate();
  const [sendBackOpen, setSendBackOpen] = useState(false);

  const inviteActive =
    state.invite.status === 'sent' ||
    state.invite.status === 'opened' ||
    state.invite.status === 'verified';

  const isLocked = readOnly || isGuardian || inviteActive;
  const token = state.invite.token || 'demo-token';

  useEffect(() => {
    document.title = 'Step 1 Personal details - CAF Pension Centre';
  }, []);

  const handleContinue = () => {
    markStepComplete(1, 'member');
    navigate('/application/service');
  };

  const nextHref = isGuardian ? `/g/${token}/step/2` : '/application/service';
  const prevHref = isGuardian ? '#' : '/application';
  const bankHref = isGuardian ? `/g/${token}/deposit` : '/application/deposit';

  const summaryItems: SummaryListItem[] = [
    {
      label: 'Full name',
      value: mockData.personal.fullName,
    },
    {
      label: 'Status & Beneficiary',
      value: mockData.personal.statusNote,
      mutedActionText: 'CAF Casualty Record',
    },
    {
      label: 'Date of birth',
      value: mockData.personal.dateOfBirth,
      mutedActionText: 'From service record',
    },
    {
      label: 'Social Insurance Number',
      value: mockData.personal.maskedSin,
      mutedActionText: 'From service record',
    },
    {
      label: 'Mailing address',
      value: (
        <>
          {mockData.personal.mailingAddressLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < mockData.personal.mailingAddressLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      ),
    },
    {
      label: 'Phone',
      value: (
        <>
          {mockData.personal.phoneLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < mockData.personal.phoneLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      ),
    },
    {
      label: 'Email',
      value: (
        <span style={{ overflowWrap: 'anywhere' }}>
          {mockData.personal.email}
        </span>
      ),
    },
  ];

  return (
    <>
      {isGuardian ? (
        <>
          <ActingForBanner />
          <GuardianStepper currentStep={1} isViewStep />
        </>
      ) : (
        <ProgressStepper currentStep={1} />
      )}

      <main className="container container--wide">
        {isGuardian && <SeniorGuideBanner token={token} currentStep={1} />}
        <StepLayout
          aside={
            isGuardian ? (
              <HelpCard title="Official casualty file">
                <p style={{ margin: '0 0 10px', fontSize: '15px', lineHeight: 1.5 }}>
                  This casualty file was compiled by the Department of National Defence following General Felix Villa's active operational service in Syria.
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
                  If you spot an error in the spelling of Jenny's name or contact address, notify a pension counselor below.
                </p>
              </HelpCard>
            ) : (
              <HelpCard title="Why we ask">
                <p>
                  Your pension statements, tax slips (T4A) and letters go to this
                  address. An out-of-date address is a common cause of delays.
                </p>
                {!isLocked && (
                  <p>
                    Name or date of birth wrong?{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Tell us how to correct it
                    </a>
                    . You will need a supporting document.
                  </p>
                )}
              </HelpCard>
            )
          }
        >
          {isLocked && <ReadOnlyNotice />}

          {/* ===================== GUARDIAN / CASUALTY DOSSIER VIEW ===================== */}
          {isGuardian ? (
            <div className="fade-in-slide">
              {/* Prestigious Military Casualty Hero Dossier */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0B2545 0%, #103460 60%, #15457F 100%)',
                  borderRadius: '12px',
                  padding: '28px 30px',
                  color: '#FFFFFF',
                  marginBottom: '24px',
                  boxShadow: '0 8px 20px rgba(11, 37, 69, 0.18)',
                  border: '1px solid #1E4E8C',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative background watermark */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-10px',
                    fontSize: '120px',
                    opacity: 0.06,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  🍁
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span
                        style={{
                          background: 'rgba(217, 119, 6, 0.25)',
                          border: '1px solid #F59E0B',
                          color: '#FDE68A',
                          fontSize: '12px',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '4px 12px',
                          borderRadius: '999px',
                        }}
                      >
                        🎖️ Official Military Casualty Dossier
                      </span>
                      <span style={{ fontSize: '13px', color: '#93C5FD', fontFamily: "'IBM Plex Mono', monospace" }}>
                        Ref: {mockData.applicationRef}
                      </span>
                    </div>

                    <h1 style={{ margin: '0 0 6px', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1.2 }}>
                      {mockData.personal.fullName}
                    </h1>

                    <p style={{ margin: '0 0 16px', fontSize: '17px', color: '#BFDBFE', lineHeight: 1.4 }}>
                      General · Regular Force · <strong>34 Years 182 Days</strong> Pensionable Service
                    </p>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(4px)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        borderLeft: '4px solid #EF4444',
                        fontSize: '15px',
                        color: '#FEE2E2',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>🕯️</span>
                      <span>
                        <strong>Died on Active Operational Service:</strong> 15 October 2026 (Syria) · Age 68
                      </span>
                    </div>
                  </div>

                  {/* Official DND Seal Box */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '16px 20px',
                      textAlign: 'center',
                      minWidth: '170px',
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div style={{ fontSize: '26px', marginBottom: '4px' }}>🛡️</div>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93C5FD', fontWeight: 800 }}>
                      DND Certified
                    </div>
                    <div style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>
                      Casualty File Sealed
                    </div>
                    <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '4px' }}>
                      Directorate of Casualty Support
                    </div>
                  </div>
                </div>
              </div>

              {/* Sole Surviving Beneficiary Card - Highlighted in Rich Gold & Navy */}
              <div
                style={{
                  background: '#FFFBEB',
                  border: '2px solid #F59E0B',
                  borderRadius: '12px',
                  padding: '22px 24px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.12)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#F59E0B',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    ⭐
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B45309' }}>
                      Designated Sole Survivor Beneficiary
                    </span>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#78350F' }}>
                      Jenny Villa (Daughter, Age 20)
                    </h2>
                  </div>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '16px', color: '#92400E', lineHeight: 1.5 }}>
                  Spouse predeceased (General Felix Villa was widowed). Under the <strong>Canadian Forces Superannuation Act (CFSA)</strong>, Jenny Villa is the sole designated dependent child beneficiary entitled to all survivor pension annuities and capital death benefits.
                </p>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✓</span> Authority verified: Sarah Villa acts as legal guardian/representative for disbursement.
                </div>
              </div>

              {/* Identification & Vital Records Card */}
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
                    padding: '16px 22px',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🎖️</span>
                    <span style={{ fontWeight: 800, fontSize: '17px', color: '#0F172A' }}>
                      Military Identification & Vital Records
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', background: '#E2E8F0', color: '#334155', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                    Official CAF File
                  </span>
                </div>

                <div style={{ padding: '20px 22px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Military Service Number
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0B335E', fontFamily: "'IBM Plex Mono', monospace", marginTop: '4px' }}>
                      {mockData.serviceNumber}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Regular Force · Commissioned
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Date of Birth
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                      {mockData.personal.dateOfBirth}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Age 68 at time of casualty
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Social Insurance Number (Masked)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', fontFamily: "'IBM Plex Mono', monospace", marginTop: '4px' }}>
                      {mockData.personal.maskedSin}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Validated with CRA
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Marital Status on Record
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                      Widowed
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Spouse predeceased
                    </div>
                  </div>
                </div>
              </div>

              {/* Estate & Guardian Contact Record Card */}
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
                    padding: '16px 22px',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🏛️</span>
                    <span style={{ fontWeight: 800, fontSize: '17px', color: '#0F172A' }}>
                      Official Estate & Legal Representation
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', background: '#E2E8F0', color: '#334155', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                    Active Representation
                  </span>
                </div>

                <div style={{ padding: '20px 22px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      Mailing Address for Pension Correspondence
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '16px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '16px', lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>Estate of General Felix Villa</div>
                      <div style={{ color: '#0B5CAD', fontWeight: 700 }}>c/o Sarah Villa (Legal Guardian for Jenny Villa)</div>
                      <div style={{ color: '#334155' }}>450 Sussex Drive</div>
                      <div style={{ color: '#334155' }}>Ottawa, Ontario K1N 1J9</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      Official Contact Channels
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Primary Telephone</div>
                        <div style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                          {mockData.personal.phoneLines[0]}
                        </div>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Estate Records Email</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0B5CAD', fontFamily: "'IBM Plex Mono', monospace", marginTop: '2px' }}>
                          {mockData.personal.email}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontSize: '14px', color: '#475569' }}>
                        <span>Official Language: <strong>English</strong></span>
                        <span>Residency: <strong>Canada</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Casualty Record Verified Callout */}
              <div
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  marginBottom: '28px',
                }}
              >
                <span style={{ fontSize: '24px', color: '#16A34A', flexShrink: 0 }}>✓</span>
                <div style={{ fontSize: '15px', color: '#166534', lineHeight: 1.5 }}>
                  <strong>Casualty record locked & verified:</strong> This record was verified by the Department of National Defence Directorate of Casualty Support Management (DCSM). All survivor pension disbursements will be issued according to these validated credentials.
                </div>
              </div>
            </div>
          ) : (
            /* Living member standard summary */
            <>
              <h1 className="page-title">Personal details</h1>
              <p className="page-lead">
                Personal record on file for {mockData.personal.fullName}.
              </p>
              <SummaryList items={summaryItems} />
            </>
          )}

          {isLocked ? (
            <>
              {isGuardian && (
                <p style={{ margin: '20px 0 0', fontSize: '15px', color: '#64748B' }}>
                  Something looks wrong with this casualty record?{' '}
                  <a
                    href="#note"
                    onClick={(e) => {
                      e.preventDefault();
                      setSendBackOpen(true);
                    }}
                    style={{ fontWeight: 600, color: '#0B5CAD' }}
                  >
                    Report an issue to Pension Centre counselors
                  </a>
                  . Your access link remains open while files are verified.
                </p>
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
                <Link to={bankHref} className="btn btn--secondary" style={{ fontSize: '16px', padding: '12px 20px' }}>
                  Skip to Bank Details (Step 6) ➔
                </Link>
                <Link
                  to={nextHref}
                  className="btn btn--primary"
                  style={{
                    fontSize: '18px',
                    padding: '14px 28px',
                    fontWeight: 700,
                    borderRadius: '8px',
                  }}
                >
                  Continue to Step 2: Service Record ➔
                </Link>
              </div>
            </>
          ) : (
            <StepFooter backTo="/application" onContinue={handleContinue} />
          )}

          <SendBackDialog
            isOpen={sendBackOpen}
            onClose={() => setSendBackOpen(false)}
          />
        </StepLayout>
      </main>
    </>
  );
};

export default PersonalPage;
