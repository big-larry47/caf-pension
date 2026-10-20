import React, { useState } from 'react';
import { mockData } from '../data/mockData';

interface SendBackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberName?: string;
}

export const SendBackDialog: React.FC<SendBackDialogProps> = ({
  isOpen,
  onClose,
  memberName = mockData.personal.fullName,
}) => {
  const [note, setNote] = useState('');
  const [error, setError] = useState(false);
  const [sentToast, setSentToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setSentToast(true);
    setTimeout(() => {
      setSentToast(false);
      setNote('');
      onClose();
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-back-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(20, 38, 60, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '560px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          boxSizing: 'border-box',
        }}
      >
        {sentToast ? (
          <div
            role="status"
            style={{
              background: 'var(--color-success-bg)',
              border: '2px solid var(--color-success)',
              borderRadius: '8px',
              padding: '16px 20px',
              color: 'var(--color-success)',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Note sent to {memberName}. Your link remains open.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 id="send-back-title" style={{ margin: '0 0 12px', fontSize: '22px' }}>
              Send application back to {memberName}
            </h2>
            <p style={{ margin: '0 0 18px', color: 'var(--color-ink-2)' }}>
              Explain what looks wrong or needs updating in steps 1 to 5. We'll
              email your note to {memberName}. Your link stays open while they
              update it.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="send-back-note"
                style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}
              >
                Note for {memberName} <span aria-hidden="true">*</span>
              </label>
              {error && (
                <p
                  style={{
                    margin: '0 0 6px',
                    fontSize: '15px',
                    color: 'var(--color-error)',
                    fontWeight: 600,
                  }}
                  role="alert"
                >
                  Error: enter a note for {memberName}
                </p>
              )}
              <textarea
                id="send-back-note"
                rows={4}
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  if (e.target.value.trim()) setError(false);
                }}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px',
                  font: 'inherit',
                  border: error
                    ? '3px solid var(--color-error)'
                    : '2px solid var(--color-muted-2)',
                  borderRadius: '6px',
                  resize: 'vertical',
                }}
                placeholder="For example: Please check the marital status or chosen benefit option before we proceed."
              />
            </div>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn--secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                Send note
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
