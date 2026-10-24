import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';

export const GuardianStatusPage: React.FC = () => {
  const { state } = useApplication();
  const { token } = useParams<{ token: string }>();
  const tokenParam = token || 'guardian-token';

  useEffect(() => {
    document.title = 'Approved Claim Status · CAF Pension Centre';
    window.scrollTo(0, 0);
  }, []);

  const guardianName = state.guardianProfile.fullName || 'Margaretha Byers';
  const beneficiaryName = mockData.personal.fullName || 'Jenny Miller';
  const memberName = 'General Kelvin Miller';
  const regNumber = '554321';
  const refNumber = 'CAF-SRV-2026-9082';
  const fileNumber = 'CF-FC 2489-APP-2026';

  const benefitOptionMap: Record<string, { title: string; amount: string; subtitle: string }> = {
    transfer: {
      title: 'Single Lump-Sum Death Benefit',
      amount: '$789,400.00 CAD',
      subtitle: 'One-time tax-sheltered capital payment',
    },
    deferred: {
      title: 'Monthly Survivor Annuity for Jenny Miller',
      amount: '$6,480.00 / month',
      subtitle: 'Indexed lifetime monthly survivor benefit',
    },
    allowance: {
      title: 'Annual Child Allowance (Reduced Monthly Income)',
      amount: '$5,120.00 / month',
      subtitle: 'Structured transitional income benefit',
    },
  };

  const selectedBenefit = benefitOptionMap[state.benefitOption] || benefitOptionMap.transfer;

  return (
    <>
      <ActingForBanner dateText={`Approved File: ${refNumber}`} />

      <main
        className="container"
        style={{
          maxWidth: '740px',
          padding: '24px 16px 80px',
        }}
      >
        {/* Breadcrumb / Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '18px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#0B3866',
            }}
          >
            <span>🍁 Government of Canada</span>
            <span>•</span>
            <span>CAF Pension Centre</span>
            <span>•</span>
            <span style={{ color: '#15803D' }}>File Closed & Approved</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F1F5F9',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#334155',
            }}
          >
            <span>Ref:</span>
            <span>{refNumber}</span>
          </div>
        </div>

        {/* Official Approved Banner */}
        <section
          aria-label="Official Status Banner"
          style={{
            background: 'linear-gradient(135deg, #14532D 0%, #15803D 60%, #166534 100%)',
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '30px 24px',
            boxShadow: '0 4px 14px rgba(22, 101, 52, 0.25)',
            marginBottom: '28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <span style={{ fontSize: '14px' }}>✓</span>
            <span>Claim Adjudicated & Approved</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 900,
              lineHeight: 1.2,
              margin: '0 0 10px',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            Survivor Pension Entitlement Finalized
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.5,
              color: '#DCFCE7',
              margin: '0 0 20px',
              maxWidth: '620px',
            }}
          >
            Form <strong>CF-FC 2489</strong> (Guardian / Legal Representative Declaration) and the casualty documentation for the late <strong>{memberName}</strong> have been formally certified and processed by the Directorate of Pension Services.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#BBF7D0', fontWeight: 700 }}>
                Official Decision
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                APPROVED
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#BBF7D0', fontWeight: 700 }}>
                Effective Date
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                October 24, 2026
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#BBF7D0', fontWeight: 700 }}>
                Authority
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                CFSA §55 / DND Adjudication
              </div>
            </div>
          </div>
        </section>

        {/* Approved Benefit Payout Card */}
        <section
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '14px',
              marginBottom: '18px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0B3866',
                }}
              >
                Elected & Confirmed Benefit
              </span>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '4px 0 0',
                }}
              >
                {selectedBenefit.title}
              </h2>
            </div>

            <div
              style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '6px 12px',
                borderRadius: '8px',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                Disbursement Status
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#065F46' }}>
                Queued for Electronic Transfer
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                Approved Capital Amount
              </div>
              <div
                style={{
                  fontSize: 'clamp(26px, 4vw, 34px)',
                  fontWeight: 900,
                  color: '#0B3866',
                  fontFamily: 'monospace',
                  letterSpacing: '-0.02em',
                  marginTop: '2px',
                }}
              >
                {selectedBenefit.amount}
              </div>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                {selectedBenefit.subtitle}
              </div>
            </div>

            <div
              style={{
                textAlign: 'right',
                minWidth: '160px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                Payment Date
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0B3866', marginTop: '2px' }}>
                January 7th, 2027
              </div>
              <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>
                Direct Deposit Verified
              </div>
            </div>
          </div>

          {/* Record of Parties Table */}
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#334155',
              margin: '0 0 12px',
            }}
          >
            Official Parties on Record
          </h3>

          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, width: '38%' }}>
                    Designated Beneficiary
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700 }}>
                    {beneficiaryName} <span style={{ color: '#64748B', fontWeight: 500 }}>(Surviving Dependent Daughter)</span>
                  </td>
                </tr>

                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>
                    Deceased Member
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700 }}>
                    {memberName} <span style={{ color: '#0B3866', fontWeight: 700, fontFamily: 'monospace' }}>(Reg #{regNumber})</span>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                      4-Star General · Royal Canadian Air Force · Killed in Action
                    </div>
                  </td>
                </tr>

                <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>
                    Authorized Legal Representative
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700 }}>
                    {guardianName}
                    <div style={{ fontSize: '12px', color: '#15803D', fontWeight: 700, marginTop: '2px' }}>
                      ✓ Verified Fiduciary & Attorney-in-Fact on File
                    </div>
                  </td>
                </tr>

                <tr style={{ background: '#F8FAFC' }}>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>
                    Case & Document Number
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700, fontFamily: 'monospace' }}>
                    {refNumber} / {fileNumber}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Disbursement Account Details */}
        <section
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '14px',
              marginBottom: '18px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0B3866',
                }}
              >
                Direct Deposit & Disbursement
              </span>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '4px 0 0',
                }}
              >
                Disbursement Account Details
              </h2>
            </div>

            <div
              style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#065F46' }}>
                Verified on File
              </span>
            </div>
          </div>

          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, width: '38%' }}>
                    Designated Guardian
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700 }}>
                    Margaretha Byers
                  </td>
                </tr>

                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>
                    Financial Institution
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700 }}>
                    TD Canada Trust / Account ending in [*******6672]
                  </td>
                </tr>

                <tr style={{ background: '#FFFFFF' }}>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>
                    Payment Date
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0B3866', fontWeight: 800, fontSize: '15px' }}>
                    January 7th, 2027
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Actionable Documents & Archive */}
        <section
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 16px',
            }}
          >
            Official Documents & Record Copies
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span style={{ fontSize: '24px' }}>🖨️</span>
              <div style={{ flex: 1 }}>
                <div>Print Official Entitlement Statement</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  PDF / Hardcopy · Case Reference {refNumber}
                </div>
              </div>
              <span style={{ color: '#0B3866', fontSize: '18px' }}>⎙</span>
            </button>

            <Link
              to={`/g/${tokenParam}/case-file`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              <span style={{ fontSize: '24px' }}>🎖️</span>
              <div style={{ flex: 1 }}>
                <div>Military Casualty Dossier</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  General Kelvin Miller · Service Record
                </div>
              </div>
              <span style={{ color: '#0B3866', fontSize: '18px' }}>&rarr;</span>
            </Link>
          </div>
        </section>



        {/* Official Contact Footer */}
        <footer
          style={{
            borderTop: '1px solid #CBD5E1',
            paddingTop: '20px',
            fontSize: '13px',
            color: '#64748B',
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            Government of Canada Pension Centre · Canadian Armed Forces Services
          </div>
          <div>
            Toll-free Enquiry Line: <strong>1-800-267-0325</strong> (Canada & US) · Mon to Fri, 8:00 AM to 5:00 PM EST
          </div>
          <div>
            Postal Address: Government of Canada Pension Centre, 105 McGillivray Dr, Centralia, ON N0M 1K0
          </div>
        </footer>
      </main>
    </>
  );
};

export default GuardianStatusPage;
