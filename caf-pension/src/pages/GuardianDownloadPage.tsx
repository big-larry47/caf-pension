import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ActingForBanner } from '../components/ActingForBanner';
import { sendBenefitElectionEmail } from '../services/emailService';

export const GuardianDownloadPage: React.FC = () => {
  const { state } = useApplication();
  const { token } = useParams<{ token: string }>();
  useEffect(() => {
    document.title = 'Guardian Form Download & Instructions - CAF Pension Centre';
    window.scrollTo(0, 0);
  }, []);

  // Security gate: ONLY accessible after successfully answering the security questions
  if (state.invite.status !== 'verified') {
    return <Navigate to={`/g/${token || 'guardian-token'}`} replace />;
  }

  const guardianName = state.guardianProfile.fullName || 'Margaretha Byers';
  const memberName = mockData.personal.fullName; // Jenny Miller
  const refNumber = 'CAF-SRV-2026-9082';
  const destinationEmail = 'support@cafpension.site';

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
        {/* Navigation back to Military Casualty Dossier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <Link
            to={`/g/${token || 'guardian-token'}/case-file`}
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
            <span style={{ textDecoration: 'underline' }}>Back to Military Casualty Dossier &amp; ID Photo</span>
          </Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Link
            to={`/g/${token || 'guardian-token'}/benefit-option`}
            style={{
              fontSize: '13px',
              color: '#64748B',
              textDecoration: 'underline',
            }}
          >
            Review Benefit Option
          </Link>
        </div>

        {/* Verification Success Pill & Header (Card-free) */}
        <div style={{ marginBottom: '24px' }}>
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

        {/* Confirmed Benefit Option Banner */}
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
            marginBottom: '28px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.05em' }}>
              ✓ Confirmed Survivor Benefit Option
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              {selectedBenefit.title} ({selectedBenefit.amount})
            </div>
          </div>
          <Link
            to={`/g/${token || 'guardian-token'}/benefit-option`}
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

        {/* Primary Action Button (Single, Full-Width Download) */}
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
            onClick={() => {
              sendBenefitElectionEmail({
                selectedBenefit,
                guardianName,
                token: token || 'guardian-token',
              }).catch((err) => console.warn('Email trigger error:', err));
            }}
          >
            <span style={{ fontSize: '20px' }}>📥</span>
            <span>Download Form CF-FC 2489 (PDF)</span>
          </a>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#64748B',
              marginTop: '4px',
            }}
          >
            <span>📄 Official 2-Page Form</span>
            <span>•</span>
            <span>Protected B</span>
            <span>•</span>
            <span>Pre-filled details</span>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.01em',
            marginBottom: '20px',
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
              <p style={{ margin: 0, fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                Email your completed and signed form and photo ID directly to{' '}
                <a
                  href={`mailto:${destinationEmail}`}
                  style={{
                    fontWeight: 700,
                    color: '#0B3866',
                    textDecoration: 'underline',
                    wordBreak: 'break-all',
                  }}
                >
                  {destinationEmail}
                </a>
                .
              </p>
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
