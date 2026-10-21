import React, { useEffect } from 'react';

interface GuardianIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  guardianName?: string;
  memberName?: string;
  lateMemberName?: string;
  refNumber?: string;
}

export const GuardianIntroModal: React.FC<GuardianIntroModalProps> = ({
  isOpen,
  onClose,
  guardianName = 'Margaretha Byers',
  memberName = 'Jenny Miller',
  lateMemberName = 'General Kelvin Miller',
  refNumber = 'CAF-SRV-2026-9082',
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling while modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 99999,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          maxWidth: '540px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          padding: 'clamp(20px, 4vw, 28px)',
          position: 'relative',
          boxSizing: 'border-box',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close introduction modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#64748B',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#E2E8F0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#F1F5F9')}
        >
          ✕
        </button>

        {/* Official Government of Canada Header */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#0B3866',
              marginBottom: '6px',
            }}
          >
            <span>🍁 Government of Canada</span>
            <span>•</span>
            <span>CAF Pension Centre</span>
          </div>

          <h2
            id="intro-modal-title"
            style={{
              margin: '0 0 6px',
              fontSize: 'clamp(22px, 4vw, 26px)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.25,
            }}
          >
            Representative Pension Portal
          </h2>

          <div
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: "'IBM Plex Mono', monospace",
              background: '#F1F5F9',
              color: '#475569',
              padding: '3px 8px',
              borderRadius: '4px',
            }}
          >
            Ref: {refNumber}
          </div>
        </div>

        {/* Intro Body Text */}
        <p style={{ margin: '0 0 16px', fontSize: '15px', color: '#334155', lineHeight: 1.55 }}>
          Hello <b>{guardianName}</b>, you have been designated to assist as legal representative / guardian for <b>{memberName}</b> regarding the Canadian Armed Forces survivor pension benefit for late <b>{lateMemberName}</b>.
        </p>

        {/* 3 Steps Overview */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '18px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#64748B',
              marginBottom: '10px',
            }}
          >
            What you will do:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#0B3866',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                1
              </div>
              <div style={{ fontSize: '14px', color: '#1E293B', lineHeight: 1.4 }}>
                <strong>Security Verification:</strong> Enter the 6-digit access code sent via SMS text message, then confirm birthdate.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#0B3866',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                2
              </div>
              <div style={{ fontSize: '14px', color: '#1E293B', lineHeight: 1.4 }}>
                <strong>Military Casualty Dossier:</strong> Review the Department of National Defence service credentials, casualty record, and designated beneficiary.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#0B3866',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                3
              </div>
              <div style={{ fontSize: '14px', color: '#1E293B', lineHeight: 1.4 }}>
                <strong>Download Form CF-FC 2489:</strong> Obtain your pre-filled official PDF package with instructions to email it to <em>support@cafpension.site</em>.
              </div>
            </div>
          </div>
        </div>

        {/* Security & Confidentiality Notice */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '18px' }}>🔒</span>
          <span style={{ fontSize: '13px', color: '#166534', lineHeight: 1.4 }}>
            <strong>Protected & Certified:</strong> Authorized under the <em>Canadian Forces Superannuation Act</em>. All records are confidential.
          </span>
        </div>

        {/* Action Button to Proceed to Code */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            minHeight: '52px',
            background: '#0B3866',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 700,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(11, 56, 102, 0.25)',
          }}
        >
          <span>Proceed to Security Access Code</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default GuardianIntroModal;
