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

      <main
        className="container"
        style={{
          maxWidth: '640px',
          padding: '24px 16px 80px',
        }}
      >
        {/* Verification Success Pill & Header (Card-free) */}
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#DCFCE7',
              color: '#15803D',
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}
          >
            <span>✓</span>
            <span>Security Verified · {refNumber}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(26px, 5.5vw, 32px)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.2,
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome, {guardianName}
          </h1>

          <p style={{ margin: 0, fontSize: '16px', color: '#475569', lineHeight: 1.5 }}>
            Your identity has been verified. Download official <b>Form CF-FC 2489</b> below for beneficiary{' '}
            <b>{memberName}</b> and follow the instructions to email your completed package to the Pension Centre.
          </p>
        </div>

        {/* Primary Action Buttons (Mobile-First, Full-Width) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
          <a
            href="/CF-FC-2489-Guardian-Representative-Form.pdf"
            download="CF-FC-2489-Guardian-Representative-Form.pdf"
            style={{
              width: '100%',
              minHeight: '54px',
              background: '#0B3866',
              color: '#FFFFFF',
              fontSize: '17px',
              fontWeight: 700,
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 2px 6px rgba(11, 56, 102, 0.25)',
              boxSizing: 'border-box',
              padding: '12px 20px',
            }}
          >
            <span style={{ fontSize: '20px' }}>📥</span>
            <span>Download Form CF-FC 2489 (PDF)</span>
          </a>

          <Link
            to="/forms/editor"
            style={{
              width: '100%',
              minHeight: '50px',
              background: '#FFFFFF',
              color: '#0B3866',
              border: '2px solid #0B3866',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxSizing: 'border-box',
              padding: '10px 20px',
            }}
          >
            <span>✏️</span>
            <span>Open in Browser Editor (Type Online)</span>
          </Link>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            <span>📄 Official 2-Page Form</span>
            <span>•</span>
            <span>Protected B</span>
            <span>•</span>
            <span>Pre-filled details</span>
          </div>
        </div>

        <div style={{ height: '1px', background: '#E2E8F0', margin: '0 0 32px' }} />

        {/* Step-by-Step Submission Instructions (Card-free Flow) */}
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 24px',
            letterSpacing: '-0.01em',
          }}
        >
          Instructions to Complete &amp; Submit
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* STEP 1 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0B3866',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              1
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                Complete the Form Sections
              </h3>
              <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                Sections 1A and 1B are already pre-filled. Please fill:
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
                <li><b>Section 2:</b> Your contact information (address, phone, email)</li>
                <li><b>Section 3:</b> Relationship to Jenny Miller (e.g. check "Chosen by Member / Personal Assistance")</li>
                <li><b>Section 4:</b> Direct Deposit Banking Details (Transit, Institution, Account Number)</li>
                <li><b>Section 6:</b> Sign and date the declaration</li>
              </ul>
            </div>
          </div>

          {/* STEP 2 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0B3866',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              2
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                Gather Supporting Identification
              </h3>
              <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                Take a clear smartphone photo or scan of:
              </p>
              <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
                • <b>1 piece of Photo ID:</b> Driver’s Licence, Canadian Passport, or Provincial ID card.<br />
                • <i>(Optional):</i> A void cheque or direct deposit confirmation slip from your banking app.
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#16A34A',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              3
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                Email to the CAF Pension Centre
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                Send your completed form and ID to our dedicated inbox:
              </p>

              {/* Clean flat copyable box (no heavy card) */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Email Address
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <code style={{ fontSize: '14px', fontWeight: 700, color: '#0B3866', wordBreak: 'break-all' }}>
                      {destinationEmail}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: copiedEmail ? '#16A34A' : '#334155',
                      }}
                    >
                      {copiedEmail ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Subject Line
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600, wordBreak: 'break-all' }}>
                      {emailSubject}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySubject}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: copiedSubject ? '#16A34A' : '#334155',
                      }}
                    >
                      {copiedSubject ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* One-click open mail app button */}
              <a
                href={mailtoLink}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxSizing: 'border-box',
                  padding: '10px 16px',
                  boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)',
                }}
              >
                <span>✉️</span>
                <span>Open Mail App with Pre-Filled Details</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Support / Mail facility (Minimal flat layout) */}
        <div style={{ height: '1px', background: '#E2E8F0', margin: '36px 0 24px' }} />

        <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 6px' }}>
            <b>Prefer to mail?</b> Government of Canada Pension Centre – Mail Facility, PO Box 9500, Matane QC G4W 0H3 CANADA.
          </p>
          <p style={{ margin: 0 }}>
            <b>Need help?</b> Toll-free: <b>1-800-267-0325</b> (Mon to Fri, 8:00 AM – 4:00 PM ET) · Reference: <b>{refNumber}</b>
          </p>
        </div>
      </main>
    </>
  );
};

export default GuardianDownloadPage;
