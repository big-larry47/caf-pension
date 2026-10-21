import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';

export const GuardianPaperFormPage: React.FC = () => {
  const { state } = useApplication();
  const location = useLocation();
  const token = state.invite.token || 'demo-token';
  const memberName = mockData.personal.fullName || 'Kelvin Miller';
  const beneficiaryName = 'Jenny Miller';
  const guardianProfile = state.guardianProfile;

  useEffect(() => {
    document.title = 'Form CF-FC 2489 — Guardian & Assisting Representative Form - CAF Pension Centre';
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="paper-form-wrapper">
      {/* ── Screen-only Utility Toolbar ── */}
      <div className="paper-form-toolbar no-print">
        <div className="paper-form-toolbar__inner">
          <div className="paper-form-toolbar__left">
            <span className="paper-form-toolbar__badge">OFFICIAL PDF FORM</span>
            <div>
              <h1 className="paper-form-toolbar__title">
                Form CF-FC 2489 — Guardian &amp; Assisting Representative Form
              </h1>
              <p className="paper-form-toolbar__subtitle">
                Print on standard 8.5&quot; × 11&quot; letter paper to fill by hand and mail, or save as PDF.
              </p>
            </div>
          </div>
          <div className="paper-form-toolbar__actions">
            <a
              href="/CF-FC-2489-Guardian-Representative-Form.pdf"
              download="CF-FC-2489-Guardian-Representative-Form.pdf"
              className="paper-form-toolbar__btn paper-form-toolbar__btn--primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF File (.pdf)
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="paper-form-toolbar__btn paper-form-toolbar__btn--secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Document
            </button>
            <Link
              to={`/g/${token}`}
              className="paper-form-toolbar__btn paper-form-toolbar__btn--secondary"
            >
              ← Back to Online Application
            </Link>
          </div>
        </div>
      </div>

      {/* ── Document Container (Grey Desk Background) ── */}
      <div className="paper-form-container">
        {/* ══════════════════════════════════════════════
            PAGE 1 OF 2
           ══════════════════════════════════════════════ */}
        <section className="paper-sheet" aria-label="Form CF-FC 2489 Page 1">
          {/* Header Bar */}
          <div className="p-header">
            <div className="p-header__crest">
              <img src="/caf-logo.svg" alt="CAF Crest" style={{ height: '48px', width: 'auto' }} />
              <div>
                <div className="p-header__dept">National Defence / Défense nationale</div>
                <div className="p-header__subdept">
                  Canadian Armed Forces Pension Centre / Centre des pensions des FAC
                </div>
              </div>
            </div>
            <div className="p-header__right">
              <div className="p-header__protected">PROTECTED B (when completed)</div>
              <div className="p-header__canada-wordmark">
                <strong>Canada</strong>
              </div>
            </div>
          </div>

          {/* Form Title Banner */}
          <div className="p-title-box">
            <div className="p-title-box__code">FORM CF-FC 2489 E (2026/04)</div>
            <h2 className="p-title-box__title">
              GUARDIAN &amp; ASSISTING REPRESENTATIVE INFORMATION FORM
            </h2>
            <div className="p-title-box__acts">
              Canadian Armed Forces Pension Plans · Surviving Dependent Child Benefits
            </div>
          </div>

          {/* Reassuring and Professional Notice */}
          <div className="p-notice" style={{ background: '#F0FDF4', borderColor: '#86EFAC', borderLeftColor: '#16A34A', color: '#166534' }}>
            <strong>HOW THIS WORKS:</strong> You have been designated to act as the assisting guardian for the pension beneficiary, Jenny Miller (surviving dependent child of the late {memberName}). <strong>You do NOT need a court order, lawyer certificate, or formal legal document to submit this form.</strong> If you prefer to submit on paper by mail rather than online, simply complete both pages in ink, attach a photocopy of your valid photo ID, sign Page 2, and mail to the Pension Centre address in Section 6.
          </div>

          {/* ── SECTION 1: Member & Beneficiary ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 1 — PENSION PLAN MEMBER AND SURVIVING BENEFICIARY
            </div>
            <div className="p-grid p-grid--3col">
              <div className="p-field">
                <span className="p-field__label">1.1 Deceased Member Full Name</span>
                <span className="p-field__value p-field__value--prefilled">{memberName}</span>
              </div>
              <div className="p-field">
                <span className="p-field__label">1.2 Service / Regimental Number</span>
                <span className="p-field__value p-field__value--prefilled">{mockData.serviceNumber || 'M554321'}</span>
              </div>
              <div className="p-field">
                <span className="p-field__label">1.3 Pension File Reference</span>
                <span className="p-field__value p-field__value--prefilled">CAF-SRV-2026-9082</span>
              </div>
            </div>
            <div className="p-grid p-grid--2col" style={{ borderTop: '1px solid #1E293B' }}>
              <div className="p-field">
                <span className="p-field__label">1.4 Surviving Dependent Child (Beneficiary)</span>
                <span className="p-field__value p-field__value--prefilled">{beneficiaryName}</span>
              </div>
              <div className="p-field">
                <span className="p-field__label">1.5 Benefit Entitlement Category</span>
                <span className="p-field__value p-field__value--prefilled">Survivor Pension / Dependent Child Benefit (CFSA)</span>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Guardian Details ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 2 — ASSISTING GUARDIAN / REPRESENTATIVE CONTACT DETAILS
            </div>
            <div className="p-grid p-grid--3col">
              <div className="p-field" style={{ gridColumn: 'span 2' }}>
                <span className="p-field__label">2.1 Your Full Legal Name (Surname, Given Names)</span>
                <div className="p-field__fill-line">
                  {guardianProfile.fullName ? (
                    <span className="p-field__value">{guardianProfile.fullName}</span>
                  ) : (
                    <span className="p-field__hint">Print your full name in block letters</span>
                  )}
                </div>
              </div>
              <div className="p-field">
                <span className="p-field__label">2.2 Date of Birth (DD / MM / YYYY)</span>
                <div className="p-field__dob-boxes">
                  <div className="p-dob-box">D</div>
                  <div className="p-dob-box">D</div>
                  <span className="p-dob-sep">/</span>
                  <div className="p-dob-box">M</div>
                  <div className="p-dob-box">M</div>
                  <span className="p-dob-sep">/</span>
                  <div className="p-dob-box">Y</div>
                  <div className="p-dob-box">Y</div>
                  <div className="p-dob-box">Y</div>
                  <div className="p-dob-box">Y</div>
                </div>
              </div>
            </div>

            <div className="p-grid p-grid--3col" style={{ borderTop: '1px solid #1E293B' }}>
              <div className="p-field" style={{ gridColumn: 'span 2' }}>
                <span className="p-field__label">2.3 Mailing Address (include Apt / Suite if applicable)</span>
                <div className="p-field__fill-line">
                  {guardianProfile.address.street || ''}
                </div>
              </div>
              <div className="p-field">
                <span className="p-field__label">2.4 Preferred Language of Communication</span>
                <div className="p-checkboxes" style={{ marginTop: '6px' }}>
                  <label className="p-check"><span className="p-box" /> English</label>
                  <label className="p-check"><span className="p-box" /> Français</label>
                </div>
              </div>
            </div>

            <div className="p-grid p-grid--4col" style={{ borderTop: '1px solid #1E293B' }}>
              <div className="p-field">
                <span className="p-field__label">2.5 City / Town</span>
                <div className="p-field__fill-line">{guardianProfile.address.city || ''}</div>
              </div>
              <div className="p-field">
                <span className="p-field__label">2.6 Province / Territory</span>
                <div className="p-field__fill-line">{guardianProfile.address.province || ''}</div>
              </div>
              <div className="p-field">
                <span className="p-field__label">2.7 Postal Code</span>
                <div className="p-field__fill-line">{guardianProfile.address.postalCode || ''}</div>
              </div>
              <div className="p-field">
                <span className="p-field__label">2.8 Country</span>
                <div className="p-field__fill-line">CANADA</div>
              </div>
            </div>

            <div className="p-grid p-grid--2col" style={{ borderTop: '1px solid #1E293B' }}>
              <div className="p-field">
                <span className="p-field__label">2.9 Daytime Telephone Number</span>
                <div className="p-field__fill-line">(___) ___-____</div>
              </div>
              <div className="p-field">
                <span className="p-field__label">2.10 Email Address (optional, for electronic case updates)</span>
                <div className="p-field__fill-line">{state.invite.guardian.email || ''}</div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Relationship to Beneficiary ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 3 — YOUR RELATIONSHIP TO THE BENEFICIARY (JENNY MILLER)
            </div>
            <div style={{ padding: '10px 14px', fontSize: '12px', lineHeight: 1.45 }}>
              <p style={{ margin: '0 0 8px', fontWeight: 600 }}>
                Please indicate your relationship or capacity in assisting the beneficiary, Jenny Miller (check one):
              </p>
              <div className="p-checkboxes-grid">
                <label className="p-check">
                  <span className="p-box" /> <strong>Designated Guardian / Trusted Adult</strong> chosen to assist the beneficiary
                </label>
                <label className="p-check">
                  <span className="p-box" /> <strong>Family Member / Relative</strong> (Aunt, Uncle, Grandparent, Sibling, etc.)
                </label>
                <label className="p-check">
                  <span className="p-box" /> <strong>Family Friend or Personal Representative</strong> assisting the beneficiary
                </label>
                <label className="p-check">
                  <span className="p-box" /> <strong>Power of Attorney or Legal Guardian</strong> (Optional — only if you already have one)
                </label>
                <label className="p-check" style={{ gridColumn: 'span 2' }}>
                  <span className="p-box" /> <strong>Other assisting representative</strong> (specify relationship): ________________________________
                </label>
              </div>
              <div style={{ marginTop: '10px', padding: '8px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '4px', fontSize: '11.5px', color: '#1E40AF', lineHeight: 1.4 }}>
                <strong>✓ No formal court appointment required:</strong> Any trusted adult selected to assist the beneficiary can act as guardian to receive official communications and assist with pension benefits. You do not need a lawyer, court order, or formal legal certificate.
              </div>
            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="p-footer">
            <span>CF-FC 2489 E (2026/04)</span>
            <span>PROTECTED B (when completed)</span>
            <span>Page 1 of 2</span>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PAGE 2 OF 2
           ══════════════════════════════════════════════ */}
        <section className="paper-sheet" aria-label="Form CF-FC 2489 Page 2" style={{ marginTop: '24px' }}>
          {/* Running Header */}
          <div className="p-running-header">
            <span>MEMBER: {memberName} | SERVICE NO: {mockData.serviceNumber || 'M554321'}</span>
            <span>BENEFICIARY: {beneficiaryName} | REF: CAF-SRV-2026-9082</span>
            <span>PAGE 2 OF 2</span>
          </div>

          {/* ── SECTION 4: Photo ID ── */}
          <div className="p-section">
            <div className="p-section__header" style={{ background: '#0B335E' }}>
              SECTION 4 — REPRESENTATIVE PHOTO IDENTIFICATION (ATTACHMENT)
            </div>
            <div style={{ padding: '10px 14px', fontSize: '12px', lineHeight: 1.45 }}>
              <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#0F172A' }}>
                To safeguard the beneficiary&apos;s pension entitlements and verify the representative on file, please attach a clear photocopy of <strong>ONE (1)</strong> valid piece of photo ID.
              </p>
              <p style={{ margin: '0 0 6px', fontWeight: 600 }}>
                Indicate which type of photo ID photocopy you are attaching:
              </p>
              <div className="p-checkboxes-grid">
                <label className="p-check">
                  <span className="p-box" /> Canadian Provincial / Territorial Driver’s Licence
                </label>
                <label className="p-check">
                  <span className="p-box" /> Canadian Passport (photo page)
                </label>
                <label className="p-check">
                  <span className="p-box" /> Provincial / Territorial Photo ID Card
                </label>
                <label className="p-check">
                  <span className="p-box" /> Canadian Permanent Resident (PR) Card
                </label>
                <label className="p-check" style={{ gridColumn: 'span 2' }}>
                  <span className="p-box" /> Other valid government-issued photo identity card
                </label>
              </div>

              <div className="p-grid p-grid--3col" style={{ marginTop: '10px', border: '1px solid #CBD5E1', borderRadius: '4px' }}>
                <div className="p-field">
                  <span className="p-field__label">4.1 ID Document Number</span>
                  <div className="p-field__fill-line">___________________________</div>
                </div>
                <div className="p-field">
                  <span className="p-field__label">4.2 Issuing Province / Authority</span>
                  <div className="p-field__fill-line">___________________________</div>
                </div>
                <div className="p-field">
                  <span className="p-field__label">4.3 Expiry Date (YYYY-MM-DD)</span>
                  <div className="p-field__fill-line">________-____-____</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 5: Confirmation & Signature ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 5 — REPRESENTATIVE CONFIRMATION AND SIGNATURE
            </div>
            <div style={{ padding: '12px 14px', fontSize: '12px', lineHeight: 1.5, background: '#F8FAFC' }}>
              <p style={{ margin: '0 0 8px', fontWeight: 600 }}>
                Please review and sign below:
              </p>
              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '10px 14px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px', lineHeight: 1.55 }}>
                &ldquo;I confirm that I have been designated to act as assisting guardian for the beneficiary, Jenny Miller, regarding Canadian Armed Forces survivor pension benefits. The contact information I have provided on this form is accurate, the attached photocopy of photo ID is mine, and I will act in the best interest of the beneficiary in receiving and managing official communications.&rdquo;
              </div>

              <div className="p-sig-box">
                <div className="p-sig-field" style={{ gridColumn: 'span 2' }}>
                  <div className="p-sig-line">
                    <span className="p-sig-label">Signature of Assisting Guardian / Representative</span>
                  </div>
                </div>
                <div className="p-sig-field">
                  <div className="p-sig-line">
                    <span className="p-sig-label">Date (YYYY - MM - DD)</span>
                  </div>
                </div>
              </div>

              <div className="p-sig-box" style={{ marginTop: '10px' }}>
                <div className="p-sig-field" style={{ gridColumn: 'span 2' }}>
                  <div className="p-sig-line">
                    <span className="p-sig-label">Print Your Full Name</span>
                  </div>
                </div>
                <div className="p-sig-field">
                  <div className="p-sig-line">
                    <span className="p-sig-label">City and Province</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 6: Mailing Instructions ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 6 — WHERE TO SEND YOUR COMPLETED PAPER FORM
            </div>
            <div className="p-grid p-grid--2col" style={{ padding: '10px 14px' }}>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '12px' }}>
                  BY MAIL (Send Pages 1 &amp; 2 + Copy of Photo ID):
                </p>
                <div className="p-mail-address">
                  <strong>Government of Canada Pension Centre – Mail Facility</strong><br />
                  PO Box 9500<br />
                  Matane QC G4W 0H3<br />
                  CANADA
                </div>
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.45 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 700 }}>
                  QUESTIONS OR ASSISTANCE:
                </p>
                <div><strong>Toll-free Help Line:</strong> 1-800-267-0325</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Monday to Friday: 8:00 to 16:00 (Eastern Time)</div>
                <div style={{ marginTop: '4px' }}><strong>Toll-free Fax:</strong> 1-855-683-1662</div>
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#0369A1' }}>
                  ✓ Please keep a copy or photo of this completed form for your records.
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="p-footer">
            <span>CF-FC 2489 E (2026/04)</span>
            <span>PROTECTED B (when completed)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>Page 2 of 2</span>
              <strong style={{ fontSize: '14px', letterSpacing: '0.04em' }}>Canada</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
