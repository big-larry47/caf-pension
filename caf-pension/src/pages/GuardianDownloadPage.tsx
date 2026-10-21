import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';

export const GuardianDownloadPage: React.FC = () => {
  const { state } = useApplication();
  const { token } = useParams<{ token: string }>();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);

  useEffect(() => {
    document.title = 'Guardian Form Download & Instructions - CAF Pension Centre';
    window.scrollTo(0, 0);
  }, []);

  // Security gate: ONLY accessible after successfully answering the security questions
  if (state.invite.status !== 'verified') {
    return <Navigate to={`/g/${token || 'demo-token'}`} replace />;
  }

  const guardianName = state.guardianProfile.fullName || 'Margaretha Byers';
  const memberName = mockData.personal.fullName; // Jenny Miller
  const refNumber = 'CAF-SRV-2026-9082';
  const destinationEmail = 'pension-pensions.caf-fac@forces.gc.ca';
  const emailSubject = `Guardian Form CF-FC 2489 — ${memberName} — Ref ${refNumber}`;
  const emailBody = `Canadian Armed Forces Pension Centre,\n\nPlease find attached the completed and signed Form CF-FC 2489 (Guardian / Representative Appointment & Direct Deposit Information) along with supporting identification for beneficiary ${memberName} (Reference: ${refNumber}).\n\nSubmitted by:\n${guardianName}\nRepresentative / Guardian for ${memberName}\n\nThank you,\n${guardianName}`;

  const mailtoLink = `mailto:${destinationEmail}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(destinationEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopySubject = () => {
    navigator.clipboard?.writeText(emailSubject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2500);
  };

  return (
    <>
      <ActingForBanner dateText={`Verified File: ${refNumber}`} />
      <main className="container" style={{ maxWidth: '860px', paddingBottom: '64px', paddingTop: '16px' }}>
        
        {/* Verification Success Banner */}
        <div
          role="status"
          style={{
            background: '#F0FDF4',
            border: '2px solid #22C55E',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#22C55E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Security Verified
              </span>
              <span style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600 }}>
                Reference: {refNumber}
              </span>
            </div>
            <h1
              style={{
                margin: '6px 0 4px',
                fontSize: '22px',
                fontWeight: 700,
                color: '#14532D',
                lineHeight: 1.3,
              }}
            >
              Welcome, {guardianName}
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#166534', lineHeight: 1.45 }}>
              Your identity has been confirmed. You are authorized to access the official Canadian Armed Forces Pension
              Representative Form package for beneficiary <b>{memberName}</b>.
            </p>
          </div>
        </div>

        {/* Primary Download & Editor Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid #0B3866',
            borderRadius: '12px',
            padding: '28px',
            marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(11, 56, 102, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#0B3866',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Official Pension Document
              </span>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0B3866' }}>
                Form CF-FC 2489 (2 Pages)
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: '15px', color: '#4B5563' }}>
                Pre-filled with late General Kelvin Miller's military service record and beneficiary Jenny Miller's information.
              </p>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <span>📄 Official Form</span>
              <span>•</span>
              <span>2 Pages</span>
              <span>•</span>
              <span>Protected B</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              padding: '20px',
              background: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
            }}
          >
            <a
              href="/CF-FC-2489-Guardian-Representative-Form.pdf"
              download="CF-FC-2489-Guardian-Representative-Form.pdf"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#0B3866',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '17px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(11, 56, 102, 0.25)',
                transition: 'background 0.15s ease',
              }}
            >
              <span style={{ fontSize: '20px' }}>📥</span>
              Download Form CF-FC 2489 (PDF)
            </a>

            <Link
              to="/forms/editor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                color: '#0B3866',
                border: '2px solid #0B3866',
                padding: '12px 22px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>✏️</span>
              Open in Browser Editor
            </Link>
          </div>

          <p style={{ margin: '14px 0 0', fontSize: '13px', color: '#64748B' }}>
            💡 <b>Tip:</b> You can print the downloaded PDF and write by hand with a blue or black pen, or click <b>Open in Browser Editor</b> to type directly into the form fields before printing or saving.
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0B3866', marginBottom: '18px' }}>
          Instructions to Complete & Submit Your Form
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* STEP 1 */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '10px',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0B3866',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                1
              </span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                Complete the Form Sections
              </h3>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '15px', color: '#374151', lineHeight: 1.5 }}>
              Sections 1A and 1B are already pre-filled. Please fill in the following:
            </p>
            <ul style={{ margin: 0, paddingLeft: '22px', fontSize: '15px', color: '#374151', lineHeight: 1.6 }}>
              <li>
                <b>Section 2 (Guardian Information):</b> Your full name, residential mailing address, phone number, and email.
              </li>
              <li>
                <b>Section 3 (Relationship to Beneficiary):</b> Confirm your relationship to Jenny Miller (e.g. check "Chosen by Member / Personal Assistance").
              </li>
              <li>
                <b>Section 4 (Direct Deposit Banking Information):</b> Your 5-digit Branch Transit Number, 3-digit Financial Institution Number, and Account Number.
              </li>
              <li>
                <b>Section 6 (Confirmation & Signature):</b> Sign and date the form.
              </li>
            </ul>
          </div>

          {/* STEP 2 */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '10px',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0B3866',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                2
              </span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                Gather Supporting Documents
              </h3>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '15px', color: '#374151', lineHeight: 1.5 }}>
              Prepare clear digital copies (scanned PDF or clear smartphone photos) of:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '14px',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>
                  🪪 1. Government-Issued Photo ID
                </div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Driver’s Licence, Canadian Passport, or Provincial Photo ID card (front and back).
                </div>
              </div>
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '14px',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>
                  🏦 2. Void Cheque or Bank Slip (Optional)
                </div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  A void cheque or direct deposit form from your online banking to ensure zero error in deposit transit/account numbers.
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #0B3866',
              borderRadius: '10px',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(11, 56, 102, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0B3866',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                3
              </span>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0B3866' }}>
                Email the Completed Package to the Pension Centre
              </h3>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '15px', color: '#374151', lineHeight: 1.5 }}>
              Once the form is completed and signed, email it directly to the Canadian Armed Forces Pension processing team:
            </p>

            {/* Email Details Card */}
            <div
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '18px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Recipient Email Address
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <code
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#0B3866',
                      background: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                    }}
                  >
                    {destinationEmail}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: '#FFFFFF',
                      border: '1px solid #94A3B8',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: copiedEmail ? '#15803D' : '#334155',
                    }}
                  >
                    {copiedEmail ? '✓ Copied' : '📋 Copy Email'}
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Subject Line
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <code
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#1E293B',
                      background: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      wordBreak: 'break-all',
                    }}
                  >
                    {emailSubject}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopySubject}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: '#FFFFFF',
                      border: '1px solid #94A3B8',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: copiedSubject ? '#15803D' : '#334155',
                    }}
                  >
                    {copiedSubject ? '✓ Copied' : '📋 Copy Subject'}
                  </button>
                </div>
              </div>
            </div>

            {/* Mailto Button */}
            <div style={{ marginBottom: '20px' }}>
              <a
                href={mailtoLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#1F6F4A',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 4px rgba(31, 111, 74, 0.25)',
                }}
              >
                <span>✉️</span>
                Open Email App with Pre-Filled Details
              </a>
            </div>

            {/* Attachment Checklist */}
            <div
              style={{
                background: '#FEF9C3',
                border: '1px solid #FDE047',
                borderRadius: '8px',
                padding: '14px 18px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#854D0E', marginBottom: '6px' }}>
                📎 Check before sending your email:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#713F12', lineHeight: 1.5 }}>
                <li>Did you attach all 2 pages of the completed and signed Form CF-FC 2489?</li>
                <li>Did you attach a copy/photo of your government-issued photo ID?</li>
                <li>Did you include reference number <b>{refNumber}</b> in the subject line?</li>
              </ul>
            </div>
          </div>

          {/* Alternative Submission: Mail & Fax */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '20px 24px',
            }}
          >
            <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: '#334155' }}>
              Alternative Submission Methods (Mail or Fax)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <b style={{ fontSize: '14px', color: '#0F172A' }}>📬 By Mail:</b>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569', lineHeight: 1.45 }}>
                  Government of Canada Pension Centre – Mail Facility<br />
                  PO Box 9500<br />
                  Matane QC G4W 0H3<br />
                  CANADA
                </p>
              </div>
              <div>
                <b style={{ fontSize: '14px', color: '#0F172A' }}>📠 By Secure Fax:</b>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569', lineHeight: 1.45 }}>
                  Toll-free fax: <b>1-418-566-4988</b><br />
                  Attn: Canadian Armed Forces Pension Services
                </p>
                <div style={{ marginTop: '8px' }}>
                  <b style={{ fontSize: '14px', color: '#0F172A' }}>📞 Need Help by Phone?</b>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#475569' }}>
                    Toll-free: <b>1-800-267-0325</b> (Mon to Fri 8:00 AM – 4:00 PM ET)
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </>
  );
};

export default GuardianDownloadPage;
