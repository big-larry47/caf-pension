import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ProgressStepper } from '../components/ProgressStepper';
import { StepLayout } from '../components/StepLayout';
import { HelpCard } from '../components/HelpCard';
import { ErrorSummary, FormError } from '../components/ErrorSummary';

export const MemberReviewPage: React.FC = () => {
  const { state, updateState, markStepComplete } = useApplication();
  const navigate = useNavigate();

  const [declared, setDeclared] = useState(state.memberReviewDeclared);
  const [signature, setSignature] = useState(state.memberSignature);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Step 7 Review and submit - CAF Pension Centre';
  }, []);

  const errors: FormError[] = [];
  if (submitted) {
    if (!declared) {
      errors.push({
        targetId: 'decl-check',
        message: 'Confirm the declaration before submitting',
      });
    }
    const cleanSig = signature.trim().toLowerCase();
    const cleanExpected = mockData.personal.fullName.trim().toLowerCase();
    if (!cleanSig || cleanSig !== cleanExpected) {
      errors.push({
        targetId: 'sig',
        message: `Type your full name (${mockData.personal.fullName}) to sign`,
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const cleanSig = signature.trim().toLowerCase();
    const cleanExpected = mockData.personal.fullName.trim().toLowerCase();

    if (declared && cleanSig === cleanExpected) {
      updateState({
        memberReviewDeclared: true,
        memberSignature: signature,
      });
      markStepComplete(7, 'member');
      navigate('/application/submitted');
    }
  };

  const sections = [
    {
      n: 1,
      name: 'Personal details',
      href: '/application/personal',
      rows: [
        { k: 'Name', v: mockData.personal.fullName },
        { k: 'Mailing address', v: 'Ottawa, Ontario' },
      ],
    },
    {
      n: 2,
      name: 'Service and release',
      href: '/application/service',
      rows: [
        { k: 'Release date', v: mockData.service.releaseDate },
        { k: 'Pensionable service', v: `${mockData.pensionableServiceYears} years` },
      ],
    },
    {
      n: 3,
      name: 'Benefit option',
      href: '/application/benefit',
      rows: [
        { k: 'Option', v: 'Deferred annuity' },
        { k: 'Estimate', v: mockData.benefitAmounts.deferredAnnuity },
      ],
    },
    {
      n: 4,
      name: 'Family and beneficiaries',
      href: '/application/family',
      rows: [
        { k: 'Marital status', v: state.maritalStatus },
        {
          k: 'Death benefit',
          v: `Kept · ${state.beneficiaryName || 'Beneficiary'}`,
        },
      ],
    },
    {
      n: 5,
      name: 'Deductions and tax',
      href: '/application/deductions',
      rows: [
        { k: 'Province', v: state.province },
        { k: 'Health care plan', v: state.joinPshcp ? 'Joined' : 'Not joined' },
      ],
    },
    {
      n: 6,
      name: 'Direct deposit',
      href: '/application/deposit/bank',
      rows: [
        { k: 'Account holder', v: state.memberDeposit.holderName || mockData.personal.fullName },
        {
          k: 'Bank numbers',
          v: state.memberDeposit.account
            ? `Transit ${state.memberDeposit.transit || '12345'} · Inst. ${
                state.memberDeposit.institution || '003'
              } · Acct ••••${state.memberDeposit.account.slice(-4) || '4567'}`
            : 'Transit 12345 · Inst. 003 · Acct ••••4567',
        },
      ],
    },
  ];

  return (
    <>
      <ProgressStepper currentStep={7} />
      <main className="container container--wide">
        <StepLayout
          aside={
            <>
              <HelpCard title="After you submit">
                <p>
                  You'll get an email confirmation with your reference number.
                  Keep it for your records.
                </p>
              </HelpCard>
              <HelpCard title="Need help?">
                <p>
                  Call <b>1-800-267-0325</b>. Have your service number ready.
                </p>
              </HelpCard>
            </>
          }
        >
          {errors.length > 0 && <ErrorSummary errors={errors} />}

          <h1 className="page-title">Check your application, then submit</h1>
          <p className="page-lead">
            This is everything we'll send to the Pension Centre for you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sections.map((s) => (
              <section
                key={s.n}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: '18px' }}>
                    {s.n}. {s.name}
                  </h2>
                  <span
                    style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: 'var(--color-success-bg)',
                        color: 'var(--color-success)',
                      }}
                    >
                      Completed by you
                    </span>
                    <Link
                      to={s.href}
                      style={{ fontSize: '15px', fontWeight: 600 }}
                    >
                      Change
                      <span className="sr-only"> {s.name}</span>
                    </Link>
                  </span>
                </div>
                <dl style={{ margin: 0, padding: '6px 20px 12px' }}>
                  {s.rows.map((r, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '12px',
                        padding: '6px 0',
                        fontSize: '16px',
                      }}
                    >
                      <dt style={{ color: 'var(--color-muted)' }}>{r.k}</dt>
                      <dd style={{ margin: 0, fontWeight: 600 }}>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <section
              style={{
                marginTop: '28px',
                background: '#FFFFFF',
                border: '2px solid var(--color-ink)',
                borderRadius: '8px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '22px' }}>Declaration</h2>
              <label
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <input
                  id="decl-check"
                  type="checkbox"
                  checked={declared}
                  onChange={(e) => setDeclared(e.target.checked)}
                  style={{
                    width: '22px',
                    height: '22px',
                    margin: '2px 0 0',
                    accentColor: 'var(--color-primary)',
                    flex: 'none',
                  }}
                />
                <span>
                  I have reviewed this application and the information is true
                  and complete.
                </span>
              </label>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 280px', maxWidth: '420px' }}>
                  <label
                    htmlFor="sig"
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '2px',
                    }}
                  >
                    Type your full name to sign
                  </label>
                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: '15px',
                      color: 'var(--color-muted)',
                    }}
                  >
                    Enter: {mockData.personal.fullName}
                  </p>
                  <input
                    id="sig"
                    autoComplete="name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      height: '48px',
                      padding: '0 14px',
                      font: 'inherit',
                      border:
                        submitted &&
                        signature.trim().toLowerCase() !==
                          mockData.personal.fullName.trim().toLowerCase()
                          ? '3px solid var(--color-error)'
                          : '2px solid var(--color-muted-2)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
                <div style={{ flex: '0 1 180px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                    Date
                  </div>
                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: '15px',
                      color: 'var(--color-muted)',
                    }}
                  >
                    Filled in for you
                  </p>
                  <div
                    style={{
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 600,
                    }}
                  >
                    15 October 2026
                  </div>
                </div>
              </div>
            </section>

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
              <Link
                to="/application/deposit/bank"
                className="btn btn--secondary"
              >
                Back
              </Link>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Link to="/application" className="link">
                  Save and exit
                </Link>
                <button type="submit" className="btn btn--primary">
                  Submit application
                </button>
              </div>
            </div>
          </form>
        </StepLayout>
      </main>
    </>
  );
};
