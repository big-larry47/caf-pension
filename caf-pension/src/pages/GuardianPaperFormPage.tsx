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
    document.title = 'Form CF-FC 2489 — Guardian / Representative Form (PDF Paper Copy) - CAF Pension Centre';
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
                Form CF-FC 2489 — Guardian Information &amp; Declaration
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
              GUARDIAN AND AUTHORIZED REPRESENTATIVE INFORMATION AND DECLARATION
            </h2>
            <div className="p-title-box__acts">
              Canadian Forces Superannuation Act (CFSA) · Pension Act · Survivor &amp; Children Benefits
            </div>
          </div>

          {/* Notice banner */}
          <div className="p-notice">
            <strong>NOTICE TO REPRESENTATIVE:</strong> Use this paper form if you prefer not to submit your information online. Print in dark blue or black ink. Complete all sections, attach a photocopy of your valid government-issued photo ID (see Section 4), sign the declaration on Page 2, and mail both pages to the Pension Centre address shown in Section 6.
          </div>

          {/* ── SECTION 1: Member & Beneficiary ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 1 — DECEASED PENSION PLAN MEMBER AND SURVIVING BENEFICIARY
            </div>
            <div className="p-grid p-grid--3col">
              <div className="p-field">
                <span className="p-field__label">1.1 Deceased Member Full Legal Name</span>
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
                <span className="p-field__label">1.4 Surviving Child / Beneficiary Name</span>
                <span className="p-field__value p-field__value--prefilled">{beneficiaryName}</span>
              </div>
              <div className="p-field">
                <span className="p-field__label">1.5 Beneficiary Relationship &amp; Status</span>
                <span className="p-field__value p-field__value--prefilled">Surviving Dependent Child (Survivor Pension Entitlement)</span>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Guardian Details ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 2 — GUARDIAN / AUTHORIZED REPRESENTATIVE PERSONAL DETAILS
            </div>
            <div className="p-grid p-grid--3col">
              <div className="p-field" style={{ gridColumn: 'span 2' }}>
                <span className="p-field__label">2.1 Full Legal Name (Surname, Given Names)</span>
                <div className="p-field__fill-line">
                  {guardianProfile.fullName ? (
                    <span className="p-field__value">{guardianProfile.fullName}</span>
                  ) : (
                    <span className="p-field__hint">Print legal surname and first name in block letters</span>
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
                <span className="p-field__label">2.3 Street Address (including Apt / Suite / Unit / PO Box)</span>
                <div className="p-field__fill-line">
                  {guardianProfile.address.street || ''}
                </div>
              </div>
              <div className="p-field">
                <span className="p-field__label">2.4 Preferred Language</span>
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
                <span className="p-field__label">2.10 Email Address (for electronic status notifications)</span>
                <div className="p-field__fill-line">{state.invite.guardian.email || ''}</div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Legal Capacity ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 3 — LEGAL CAPACITY AND AUTHORITY TO ACT
            </div>
            <div style={{ padding: '8px 12px', fontSize: '12px', lineHeight: 1.4 }}>
              <p style={{ margin: '0 0 6px', fontWeight: 600 }}>
                Indicate the legal capacity in which you are representing Jenny Miller (check one):
              </p>
              <div className="p-checkboxes-grid">
                <label className="p-check">
                  <span className="p-box" /> <strong>Power of Attorney (POA)</strong> for property / personal care
                </label>
                <label className="p-check">
                  <span className="p-box" /> <strong>Court-Appointed Legal Guardian</strong> of minor child
                </label>
                <label className="p-check">
                  <span className="p-box" /> <strong>Assisting Family Member / Parent</strong> (non-court appointed)
                </label>
                <label className="p-check">
                  <span className="p-box" /> <strong>Trustee, Executor, or Estate Representative</strong>
                </label>
                <label className="p-check" style={{ gridColumn: 'span 2' }}>
                  <span className="p-box" /> <strong>Other authorized contact</strong> (specify relationship): ________________________________
                </label>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#475569', fontStyle: 'italic' }}>
                Note: If court order, letters probate, or power of attorney document is available, please attach a copy. If assisting as parent/custodian, completion of Sections 4 and 5 is sufficient.
              </p>
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
            <span>FILE REF: CAF-SRV-2026-9082</span>
            <span>PAGE 2 OF 2</span>
          </div>

          {/* ── SECTION 4: Mandatory Photo ID ── */}
          <div className="p-section">
            <div className="p-section__header p-section__header--alert">
              SECTION 4 — MANDATORY GOVERNMENT-ISSUED PHOTO IDENTIFICATION (REQUIRED)
            </div>
            <div style={{ padding: '10px 12px', fontSize: '12px', lineHeight: 1.45 }}>
              <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#991B1B' }}>
                ATTACHMENT MANDATORY: Under Government of Canada Pension Centre identity standards, you MUST attach a legible photocopy of ONE (1) valid, unexpired government-issued photo identification document.
              </p>
              <p style={{ margin: '0 0 6px', fontWeight: 600 }}>
                Indicate which type of photo ID photocopy is attached to this form:
              </p>
              <div className="p-checkboxes-grid">
                <label className="p-check">
                  <span className="p-box" /> Canadian Provincial / Territorial Driver’s Licence
                </label>
                <label className="p-check">
                  <span className="p-box" /> Canadian Passport (photo and signature page)
                </label>
                <label className="p-check">
                  <span className="p-box" /> Provincial / Territorial Photo Card (e.g. Photo ID, Age of Majority)
                </label>
                <label className="p-check">
                  <span className="p-box" /> Canadian Permanent Resident (PR) Card
                </label>
                <label className="p-check" style={{ gridColumn: 'span 2' }}>
                  <span className="p-box" /> Secure Certificate of Indian Status (SCIS) / Other official photo ID
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

          {/* ── SECTION 5: Declaration & Signature ── */}
          <div className="p-section">
            <div className="p-section__header">
              SECTION 5 — REPRESENTATIVE’S SOLEMN DECLARATION AND SIGNATURE
            </div>
            <div style={{ padding: '10px 12px', fontSize: '11.5px', lineHeight: 1.45, background: '#F8FAFC' }}>
              <div style={{ marginBottom: '8px', padding: '6px 8px', background: '#F1F5F9', borderLeft: '3px solid #0284C7', fontSize: '11px' }}>
                <strong>Privacy Act Statement:</strong> The personal information provided on this form is collected under the authority of the <em>Canadian Forces Superannuation Act</em> (CFSA) and <em>Pension Act</em>. Information is stored in Personal Information Bank PWGSC PPU 005. It is protected from unauthorized disclosure under the provisions of the <em>Privacy Act</em>.
              </div>
              <p style={{ margin: '0 0 6px' }}>
                <strong>I solemnly declare that:</strong>
              </p>
              <ol style={{ margin: '0 0 10px', paddingLeft: '20px' }}>
                <li>I am authorized to assist and act on behalf of the surviving dependent child named in Section 1 (<strong>Jenny Miller</strong>).</li>
                <li>All statements and information entered on this form and any attached documentation are true, complete, and accurate to the best of my knowledge and belief.</li>
                <li>The attached photocopy of my government-issued photo identification is a true and unaltered copy of my valid identity document.</li>
                <li>I acknowledge that knowingly providing false, misleading, or deceptive information constitutes an offence under the <em>Criminal Code of Canada</em> and may invalidate pension benefit claims.</li>
              </ol>

              <div className="p-sig-box">
                <div className="p-sig-field" style={{ gridColumn: 'span 2' }}>
                  <div className="p-sig-line">
                    <span className="p-sig-label">Signature of Guardian / Authorized Representative</span>
                  </div>
                </div>
                <div className="p-sig-field">
                  <div className="p-sig-line">
                    <span className="p-sig-label">Date (YYYY - MM - DD)</span>
                  </div>
                </div>
              </div>

              <div className="p-sig-box" style={{ marginTop: '8px' }}>
                <div className="p-sig-field" style={{ gridColumn: 'span 2' }}>
                  <div className="p-sig-line">
                    <span className="p-sig-label">Print Legal Name in Block Letters</span>
                  </div>
                </div>
                <div className="p-sig-field">
                  <div className="p-sig-line">
                    <span className="p-sig-label">City and Province of Signing</span>
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
            <div className="p-grid p-grid--2col" style={{ padding: '8px 12px' }}>
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
                  TELEPHONE / FAX CONTACT:
                </p>
                <div><strong>Toll-free Help Line:</strong> 1-800-267-0325</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Monday to Friday: 8:00 to 16:00 (Eastern Time)</div>
                <div style={{ marginTop: '4px' }}><strong>Toll-free Fax:</strong> 1-855-683-1662</div>
                <div><strong>Outside Canada &amp; US:</strong> 1-418-566-6298</div>
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#0369A1' }}>
                  ✓ Keep a copy of this form for your records before mailing.
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
