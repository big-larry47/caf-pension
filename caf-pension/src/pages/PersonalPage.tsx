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
                  This casualty file was compiled by the Department of National Defence following General Kelvin Miller's active operational service in Damascus, Syria.
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
              {/* Official Military Casualty Dossier Card */}
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
                  className="card-header-mobile-hide"
                  style={{
                    padding: '16px 22px',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🍁</span>
                    <span style={{ fontWeight: 800, fontSize: '17px', color: '#0F172A' }}>
                      Official Military Service Record
                    </span>
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
                      Ref: {mockData.applicationRef}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        background: '#E2E8F0',
                        color: '#0F172A',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      DND Certified
                    </span>
                  </div>
                </div>

                <div style={{ padding: '20px 22px' }}>
                  <div className="military-dossier-card">
                    {/* LEFT COLUMN: Portrait Photo + Medals and Honors */}
                    <div>
                      {/* Portrait Photo */}
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

                    {/* RIGHT COLUMN: Header, Identity Details, Service Info, Biography */}
                    <div>
                      {/* Header: Rank + Name */}
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
                        <h1
                          style={{
                            margin: '2px 0 0',
                            fontSize: '26px',
                            fontWeight: 900,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                            color: '#0F172A',
                            lineHeight: 1.15,
                            fontFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                          }}
                        >
                          Kelvin Miller
                        </h1>
                      </div>

                      {/* Key-Value Table 1: Service ID, Rank, Branch, Unit, Status */}
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
                          <span className="military-dossier-val" style={{ color: '#B91C1C' }}>Killed in action</span>
                        </div>
                      </div>

                      {/* Divider & Casualty section hidden on mobile to prevent packed appearance */}
                      <div className="hide-on-mobile">
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
                            <span className="military-dossier-val" style={{ color: '#B91C1C' }}>Killed in action</span>
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
                      Jenny Miller (Daughter)
                    </h2>
                  </div>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '16px', color: '#92400E', lineHeight: 1.5 }}>
                  Spouse predeceased (General Kelvin Miller was widowed). Under the <strong>Canadian Forces Superannuation Act (CFSA)</strong>, Jenny Miller is the sole designated dependent child beneficiary entitled to all survivor pension annuities and capital death benefits.
                </p>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✓</span> Authority verified: Margaretha Byers acts as Power of Attorney for disbursement.
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
                    Official Certificate File #554321
                  </span>
                </div>

                <div style={{ padding: '20px 22px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Registration & Service No.
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0B335E', fontFamily: "'IBM Plex Mono', monospace", marginTop: '4px' }}>
                      554321
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Service ID: M554321 · Regular Force
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Date & Place of Birth
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                      1959-10-07
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Chicoutimi, Quebec · Age 65
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Date, Place & Cause of Death
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#B91C1C', marginTop: '4px' }}>
                      2025-04-18
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Damascus, Syria · Killed in action
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Certificate Issue & Origin
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                      2025-04-20
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Canadian · Christian (Father: Kelvin)
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Social Insurance Number (Masked)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', fontFamily: "'IBM Plex Mono', monospace", marginTop: '4px' }}>
                      ••• ••• 321
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
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>Estate of General Kelvin Miller</div>
                      <div style={{ color: '#0B5CAD', fontWeight: 700 }}>c/o Margaretha Byers (Power of Attorney for Jenny Miller)</div>
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
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to={`/g/${token}/step/3`} className="btn btn--secondary" style={{ fontSize: '15px', padding: '12px 18px', border: '1.5px solid #0B5CAD', color: '#0B5CAD' }}>
                    ★ Jump to Step 3: Benefit Plan ➔
                  </Link>
                  <Link to={bankHref} className="btn btn--secondary" style={{ fontSize: '15px', padding: '12px 18px' }}>
                    Skip to Bank Details (Step 6) ➔
                  </Link>
                </div>
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
