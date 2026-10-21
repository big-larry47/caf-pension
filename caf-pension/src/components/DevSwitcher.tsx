import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplication, InviteStatus } from '../context/ApplicationContext';

export const DevSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, updateState, setInviteStatus } = useApplication();
  const navigate = useNavigate();
  const location = useLocation();

  // Completely omit DevSwitcher on printable/form pages and PDF generation routes
  if (
    location.pathname.startsWith('/forms/') ||
    location.pathname.includes('/paper-form')
  ) {
    return null;
  }

  const token = state.invite.token || 'demo-token';

  const handleStatusChange = (newStatus: InviteStatus) => {
    setInviteStatus(newStatus);
  };

  const handleSwitchActor = (actor: 'member' | 'guardian') => {
    updateState({ activeActor: actor });
    if (actor === 'guardian') {
      navigate(`/g/${token}`);
    } else {
      navigate('/application');
    }
  };

  return (
    <div
      className="dev-switcher no-print"
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 10000,
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
      }}
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            background: 'var(--color-ink)',
            color: '#FFFFFF',
            border: '2px solid #8FA6C2',
            borderRadius: '999px',
            padding: '8px 16px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: state.activeActor === 'guardian' ? '#B4480C' : '#1F6F4A',
            }}
          />
          Dev Switcher ({state.activeActor})
        </button>
      ) : (
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid var(--color-ink)',
            borderRadius: '10px',
            padding: '16px',
            width: '320px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              borderBottom: '1px solid var(--color-divider)',
              paddingBottom: '8px',
            }}
          >
            <b style={{ fontSize: '14px', color: 'var(--color-ink)' }}>
              Dev Controls
            </b>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 0,
                fontSize: '16px',
                cursor: 'pointer',
                color: 'var(--color-muted)',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Switch Persona / View:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSwitchActor('member')}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-primary)',
                  background:
                    state.activeActor === 'member'
                      ? 'var(--color-primary)'
                      : '#FFFFFF',
                  color: state.activeActor === 'member' ? '#FFFFFF' : 'var(--color-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => handleSwitchActor('guardian')}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-accent)',
                  background:
                    state.activeActor === 'guardian'
                      ? 'var(--color-accent)'
                      : '#FFFFFF',
                  color: state.activeActor === 'guardian' ? '#FFFFFF' : 'var(--color-accent)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Guardian
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label
              htmlFor="dev-invite-status"
              style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}
            >
              Invite Status:
            </label>
            <select
              id="dev-invite-status"
              value={state.invite.status}
              onChange={(e) => handleStatusChange(e.target.value as InviteStatus)}
              style={{
                width: '100%',
                height: '34px',
                borderRadius: '6px',
                border: '1px solid var(--color-muted-2)',
                padding: '0 8px',
                font: 'inherit',
              }}
            >
              <option value="none">none (Member alone)</option>
              <option value="sent">sent (Waiting for guardian)</option>
              <option value="opened">opened (Guardian opened link)</option>
              <option value="verified">verified (Guardian confirmed)</option>
              <option value="submitted">submitted (Application finished)</option>
              <option value="expired">expired (Link expired)</option>
              <option value="cancelled">cancelled (Cancelled by member)</option>
            </select>
          </div>

          <div>
            <span style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Jump to Screen:
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                maxHeight: '160px',
                overflowY: 'auto',
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/application')}
                style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', cursor: 'pointer' }}
              >
                Hub (Overview)
              </button>
              <button
                type="button"
                onClick={() => navigate('/application/deposit')}
                style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', cursor: 'pointer' }}
              >
                G1 (Deposit Choice)
              </button>
              <button
                type="button"
                onClick={() => navigate('/application/deposit/bank')}
                style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', cursor: 'pointer' }}
              >
                Member Bank
              </button>
              <button
                type="button"
                onClick={() => navigate('/application/review')}
                style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', cursor: 'pointer' }}
              >
                Member Review (Step 7)
              </button>
              <button
                type="button"
                onClick={() => navigate('/dev/invite-preview')}
                style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', cursor: 'pointer' }}
              >
                G3 (Invite Preview)
              </button>
              <button
                type="button"
                onClick={() => navigate(`/g/${token}`)}
                style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', cursor: 'pointer' }}
              >
                G4 (Guardian Verify)
              </button>
              <button
                type="button"
                onClick={() => navigate(`/g/${token}/form-package`)}
                style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', cursor: 'pointer', background: '#DCFCE7', color: '#166534', fontWeight: 600 }}
              >
                G5 (Download &amp; Instructions)
              </button>
              <button
                type="button"
                onClick={() => navigate('/forms/editor')}
                style={{ textAlign: 'left', padding: '4px 6px', fontSize: '12px', cursor: 'pointer', background: '#F1F5F9' }}
              >
                Form Editor (WYSIWYG)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
