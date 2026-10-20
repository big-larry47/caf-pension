import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';
import { ProgressStepper } from '../components/ProgressStepper';
import { GuardianStepper } from '../components/GuardianStepper';
import { ActingForBanner } from '../components/ActingForBanner';
import { ReadOnlyNotice } from '../components/ReadOnlyNotice';
import { SendBackDialog } from '../components/SendBackDialog';
import { StepLayout } from '../components/StepLayout';
import { HelpCard } from '../components/HelpCard';
import { Callout } from '../components/Callout';
import { RadioCard } from '../components/RadioCard';
import { StepFooter } from '../components/StepFooter';
import { SeniorGuideBanner } from '../components/SeniorGuideBanner';

interface BenefitPageProps {
  readOnly?: boolean;
  isGuardian?: boolean;
}

export const BenefitPage: React.FC<BenefitPageProps> = ({
  readOnly = false,
  isGuardian = false,
}) => {
  const { state, updateState, markStepComplete } = useApplication();
  const navigate = useNavigate();
  const [sendBackOpen, setSendBackOpen] = useState(false);

  const inviteActive =
    state.invite.status === 'sent' ||
    state.invite.status === 'opened' ||
    state.invite.status === 'verified';

  // Guardian can actively choose Jenny's benefit option on Step 3!
  const isLocked = isGuardian ? false : (readOnly || inviteActive);
  const token = state.invite.token || 'demo-token';

  useEffect(() => {
    document.title = 'Step 3 Benefit option - CAF Pension Centre';
  }, []);

  const handleContinue = () => {
    markStepComplete(3, isGuardian ? 'guardian' : 'member');
    if (isGuardian) {
      navigate(`/g/${token}/step/4`);
    } else {
      navigate('/application/family');
    }
  };

  const nextHref = isGuardian ? `/g/${token}/step/4` : '/application/family';
  const prevHref = isGuardian ? `/g/${token}/step/2` : '/application/service';
  const bankHref = isGuardian ? `/g/${token}/deposit` : '/application/deposit';

  const memberBenefitOptions = [
    {
      id: 'deferred' as const,
      title: 'Deferred annuity',
      amount: mockData.benefitAmounts.deferredAnnuity,
      desc: 'A full, unreduced monthly pension that starts at age 60.',
      note: 'Indexed to inflation. Includes survivor benefits.',
      disabled: false,
    },
    {
      id: 'allowance' as const,
      title: 'Annual allowance',
      amount: mockData.benefitAmounts.annualAllowance,
      desc: 'A smaller monthly pension that can start as early as age 50.',
      note: 'Reduced for each year it starts before 60.',
      disabled: false,
    },
    {
      id: 'transfer' as const,
      title: 'Transfer value',
      amount: mockData.benefitAmounts.transferValue,
      desc: 'A one-time payment moved into a locked-in retirement account.',
      note: 'Available because you are under 50 with 2 or more years of service.',
      disabled: false,
    },
    {
      id: 'immediate' as const,
      title: 'Immediate annuity',
      amount: mockData.benefitAmounts.immediateAnnuity,
      desc: 'A monthly pension that starts right after release.',
      note: 'You do not meet the age and service rules for this option.',
      disabled: true,
    },
  ];

  const guardianBenefitOptions = [
    {
      id: 'deferred' as const,
      title: 'Monthly Survivor Annuity for Jenny Villa',
      amount: '$6,480.00 / month',
      desc: 'A full, regular monthly income deposited directly for Jenny’s living and educational needs.',
      note: 'Indexed annually to inflation (cost of living). Guaranteed monthly support for life.',
      disabled: false,
    },
    {
      id: 'transfer' as const,
      title: 'Lump-Sum Capital Death Benefit',
      amount: '$1,240,500.00 one-time payout',
      desc: 'A single, one-time full settlement payment transferred directly to Jenny’s trust or locked-in investment account.',
      note: 'Paid in full as a lump sum. No further monthly pension payments.',
      disabled: false,
    },
    {
      id: 'allowance' as const,
      title: 'Annual Allowance (Reduced Monthly Income)',
      amount: '$5,120.00 / month',
      desc: 'A lower monthly payment starting immediately, designed to provide immediate flexible liquidity.',
      note: 'Reduced monthly amount calculated for early emergency and transition costs.',
      disabled: false,
    },
  ];

  const benefitOptions = isGuardian ? guardianBenefitOptions : memberBenefitOptions;

  return (
    <>
      {isGuardian ? (
        <>
          <ActingForBanner />
          <GuardianStepper currentStep={3} />
        </>
      ) : (
        <ProgressStepper currentStep={3} />
      )}

      <main className="container container--wide">
        {isGuardian && <SeniorGuideBanner token={token} currentStep={3} />}
        <StepLayout
          aside={
            isGuardian ? (
              <HelpCard title="Choosing for Jenny Villa">
                <p style={{ margin: '0 0 10px', fontSize: '15px', lineHeight: 1.5 }}>
                  <strong>Monthly Annuity ($6,480/mo):</strong> Best for steady, predictable monthly income that automatically adjusts for inflation each year.
                </p>
                <p style={{ margin: '0 0 10px', fontSize: '15px', lineHeight: 1.5 }}>
                  <strong>Lump-Sum ($1,240,500):</strong> Best if you wish to manage funds within a trust or locked-in investment portfolio.
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
                  Need advice? Call toll-free <strong>1-800-267-0325</strong> to speak directly with a pension counselor.
                </p>
              </HelpCard>
            ) : (
              <>
                <HelpCard title="Compare before you choose">
                  <p>
                    A transfer value includes the value of indexing and survivor
                    benefits. An annuity bought later from an insurer usually does
                    not.
                  </p>
                  <p>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Open the pension estimator
                    </a>
                  </p>
                </HelpCard>
                <HelpCard title="If you choose a transfer value">
                  <p>
                    Your bank fills in a lock-in certification instead of the
                    direct deposit step. We'll show you how at the end.
                  </p>
                </HelpCard>
              </>
            )
          }
        >
          {isLocked && <ReadOnlyNotice />}

          <h1 className="page-title">
            {isGuardian ? `Choose survivor benefit for Jenny Villa` : 'Benefit option'}
          </h1>
          <p className="page-lead">
            {isGuardian
              ? `As legal guardian, please choose how the late ${mockData.personal.fullName}'s pension benefits should be paid to Jenny Villa (age 20).`
              : `Survivor benefit entitlement on file for the late ${mockData.personal.fullName}.`}
          </p>

          {isLocked ? (
            <>
              {/* Matching G5 GViewStep.dc.html exactly */}
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  padding: '18px 20px',
                  background: '#FFFFFF',
                  border: '2px solid var(--color-success)',
                  borderRadius: '8px',
                }}
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flex: 'none', marginTop: '4px' }}
                >
                  <path d="M5 12l5 5 9-10" />
                </svg>
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-success)',
                    }}
                  >
                    Chosen option
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <b style={{ fontSize: '19px' }}>Deferred annuity</b>
                    <b style={{ fontSize: '19px' }}>
                      {mockData.benefitAmounts.deferredAnnuity}
                    </b>
                  </span>
                  <span style={{ fontSize: '16px', color: 'var(--color-ink-2)' }}>
                    A full, unreduced monthly pension that starts at age 60.
                  </span>
                </span>
              </div>

              <dl
                style={{
                  margin: '20px 0 0',
                  background: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '12px',
                    padding: '14px 24px',
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  <dt style={{ fontWeight: 600 }}>Options not chosen</dt>
                  <dd style={{ margin: 0 }}>Annual allowance, transfer value</dd>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '12px',
                    padding: '14px 24px',
                  }}
                >
                  <dt style={{ fontWeight: 600 }}>Confirmed final</dt>
                  <dd style={{ margin: 0 }}>Yes, on 15 October 2026</dd>
                </div>
              </dl>

              {isGuardian && (
                <p style={{ margin: '24px 0 0', fontSize: '16px' }}>
                  Something looks wrong?{' '}
                  <a
                    href="#note"
                    onClick={(e) => {
                      e.preventDefault();
                      setSendBackOpen(true);
                    }}
                  >
                    Report an issue with this benefit calculation to Pension Centre counselors
                  </a>
                  . Your link stays open while we review the file.
                </p>
              )}

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
                <Link to={prevHref} className="btn btn--secondary">
                  Previous step
                </Link>
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link to={nextHref} className="link">
                    Next step
                  </Link>
                  <Link to={bankHref} className="btn btn--primary">
                    Go to bank details
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              {isGuardian ? (
                <Callout variant="info" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '17px', lineHeight: 1.5 }}>
                    <strong>You are choosing Jenny Villa's survivor pension benefit.</strong> As her legal guardian, select whether Jenny receives regular monthly payments or a single lump-sum payout. Take your time, or call <strong>1-800-267-0325</strong> if you'd like guidance from a pension counselor.
                  </div>
                </Callout>
              ) : (
                <Callout variant="warning" style={{ marginBottom: '24px' }}>
                  <b>This choice is final once payments start.</b> Choose by{' '}
                  <b>{mockData.deadline}</b>. Not sure?{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Book a call with a pension officer
                  </a>
                  .
                </Callout>
              )}

              <fieldset
                style={{
                  border: 0,
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <legend className="legend-title">
                  {isGuardian ? 'Survivor Benefit Options' : 'Your options'}
                </legend>
                {benefitOptions.map((opt) => (
                  <RadioCard
                    key={opt.id}
                    id={`benefit-${opt.id}`}
                    name="benefit"
                    checked={state.benefitOption === opt.id}
                    disabled={opt.disabled}
                    onChange={() => updateState({ benefitOption: opt.id })}
                    title={opt.title}
                    amount={opt.amount}
                    desc={opt.desc}
                    note={opt.note}
                  />
                ))}
              </fieldset>

              {isGuardian ? (
                <label
                  style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    marginTop: '24px',
                    padding: '18px 20px',
                    background: '#FFFFFF',
                    border: state.benefitConfirmed ? '2px solid var(--color-success)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-card)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    id="guardian-benefit-confirm"
                    checked={state.benefitConfirmed}
                    onChange={(e) =>
                      updateState({ benefitConfirmed: e.target.checked })
                    }
                    style={{
                      width: '24px',
                      height: '24px',
                      margin: '2px 0 0',
                      accentColor: 'var(--color-primary)',
                      flex: 'none',
                    }}
                  />
                  <span style={{ fontSize: '17px', lineHeight: 1.5, color: '#1E293B' }}>
                    <strong>I confirm this survivor benefit option for Jenny Villa.</strong> I understand this choice establishes the payment structure for her CAF survivor benefit once approved.
                  </span>
                </label>
              ) : (
                <label
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    marginTop: '24px',
                    padding: '16px 20px',
                    background: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={state.benefitConfirmed}
                    onChange={(e) =>
                      updateState({ benefitConfirmed: e.target.checked })
                    }
                    style={{
                      width: '22px',
                      height: '22px',
                      margin: '2px 0 0',
                      accentColor: 'var(--color-primary)',
                      flex: 'none',
                    }}
                  />
                  <span>
                    I understand that I can't change my benefit option after my
                    first payment, or after my transfer value is paid.
                  </span>
                </label>
              )}

              {isGuardian ? (
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
                  <Link to={prevHref} className="btn btn--secondary" style={{ fontSize: '16px' }}>
                    ← Back to Step 2
                  </Link>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        markStepComplete(3, 'guardian');
                        navigate(nextHref);
                      }}
                      className="btn btn--secondary"
                      style={{ fontSize: '16px' }}
                    >
                      Save & Continue to Step 4 →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        markStepComplete(3, 'guardian');
                        navigate(bankHref);
                      }}
                      className="btn btn--primary"
                      style={{ fontSize: '18px', padding: '12px 24px', fontWeight: 700 }}
                    >
                      Save Choice & Go to Bank Details (Step 6) ➔
                    </button>
                  </div>
                </div>
              ) : (
                <StepFooter
                  backTo="/application/service"
                  onContinue={handleContinue}
                />
              )}
            </>
          )}

          <SendBackDialog
            isOpen={sendBackOpen}
            onClose={() => setSendBackOpen(false)}
          />
        </StepLayout>
      </main>
    </>
  );
};
