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

  const isLocked = readOnly || (inviteActive && !isGuardian);
  const token = state.invite.token || 'demo-token';

  useEffect(() => {
    document.title = 'Step 3 Benefit option - CAF Pension Centre';
  }, []);

  const handleContinue = () => {
    markStepComplete(3, 'member');
    navigate('/application/family');
  };

  const nextHref = isGuardian ? `/g/${token}/step/4` : '/application/family';
  const prevHref = isGuardian ? `/g/${token}/step/2` : '/application/service';
  const bankHref = isGuardian ? `/g/${token}/deposit` : '/application/deposit';

  const benefitOptions = [
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

  return (
    <>
      {isGuardian ? (
        <>
          <ActingForBanner />
          <GuardianStepper currentStep={3} isViewStep />
        </>
      ) : (
        <ProgressStepper currentStep={3} />
      )}

      <main className="container container--wide">
        <StepLayout
          aside={
            isGuardian ? (
              <HelpCard title="Do I need to read every step?">
                <p>
                  No, you can go straight to the bank details. But you'll confirm
                  the whole application before you submit in step 7, so it helps
                  to look now.
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
            {isGuardian ? `Survivor pension options for Jenny Villa` : 'Benefit option'}
          </h1>
          <p className="page-lead">
            {isGuardian
              ? `Survivor annuity and dependent child benefits designated for Jenny Villa based on the late ${mockData.personal.fullName}'s service.`
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
              <Callout variant="warning" style={{ marginBottom: '24px' }}>
                <b>This choice is final once payments start.</b> Choose by{' '}
                <b>{mockData.deadline}</b>. Not sure?{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Book a call with a pension officer
                </a>
                .
              </Callout>

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
                <legend className="legend-title">Your options</legend>
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

              <StepFooter
                backTo="/application/service"
                onContinue={handleContinue}
              />
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
