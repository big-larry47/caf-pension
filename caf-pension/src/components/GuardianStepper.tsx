import React from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';

interface GuardianStepperProps {
  currentStep: number; // 1 to 7
  isViewStep?: boolean;
}

const STEP_NAMES = [
  'Personal details',
  'Service & release',
  'Benefit option',
  'Family',
  'Deductions & tax',
  'Direct deposit',
  'Review',
];

export const GuardianStepper: React.FC<GuardianStepperProps> = ({
  currentStep,
  isViewStep = false,
}) => {
  const { state } = useApplication();
  const token = state.invite.token || 'demo-token';
  const currentIndex = currentStep - 1;
  const memberName = mockData.personal.fullName;

  return (
    <nav aria-label="Application progress" className="progress-stepper guardian-stepper">
      <div className="progress-stepper__inner">
        <div className="progress-stepper__top">
          <span>
            {currentStep === 3 ? (
              <>
                <b style={{ color: 'var(--color-ink)' }}>
                  Step 3 of 7
                </b>{' '}
                · Benefit option (Your choice for Jenny)
              </>
            ) : currentStep <= 5 ? (
              <>
                <b style={{ color: 'var(--color-ink)' }}>
                  Viewing step {currentStep} of 7
                </b>{' '}
                · Casualty records for the late {memberName}
              </>
            ) : (
              <>
                <b style={{ color: 'var(--color-ink)' }}>
                  Step {currentStep} of 7
                </b>{' '}
                · {STEP_NAMES[currentIndex]}
              </>
            )}
          </span>
          <span>
            {currentStep <= 5 && currentStep !== 3
              ? 'Your tasks: steps 3, 6, and 7'
              : 'All changes saved'}
          </span>
        </div>
        <ol
          className="progress-stepper__bar-list"
          style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
        >
          {STEP_NAMES.map((name, i) => {
            const stepNum = i + 1;
            const isCurrent = i === currentIndex;
            const locked = i < 5 && i !== 2;

            let href = `/g/${token}/step/${stepNum}`;
            if (i === 5) href = `/g/${token}/deposit`;
            if (i === 6) href = `/g/${token}/review`;

            let tag = 'CAF Official Record';
            if (i === 2) {
              tag = isCurrent ? 'In progress' : (state.benefitConfirmed ? 'Chosen by you' : 'Your choice');
            } else if (i === 5) {
              tag = isCurrent ? 'In progress' : (state.guardianDeposit.submitted ? 'Done by you' : 'Your turn');
            } else if (i === 6) {
              tag = isCurrent ? 'In progress' : 'Your turn';
            }

            // Step bar color indicator
            let barColor = 'var(--color-border)';
            if (locked) {
              barColor = 'var(--color-success)';
            } else if (i === 2) {
              if (isCurrent) {
                barColor = 'var(--color-primary)';
              } else if (state.benefitConfirmed) {
                barColor = 'var(--color-success)';
              } else {
                barColor = 'var(--color-accent)';
              }
            } else if (i === 5) {
              if (isViewStep) {
                barColor = 'var(--color-accent)';
              } else if (isCurrent) {
                barColor = 'var(--color-primary)';
              } else if (state.guardianDeposit.submitted) {
                barColor = 'var(--color-success)';
              }
            } else if (i === 6) {
              if (isCurrent) {
                barColor = 'var(--color-primary)';
              }
            }

            return (
              <li key={stepNum} style={{ position: 'relative' }}>
                <Link
                  to={href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '14px',
                    lineHeight: 1.3,
                    textDecoration: 'none',
                    color: isCurrent
                      ? 'var(--color-ink)'
                      : locked
                      ? 'var(--color-ink-2)'
                      : 'var(--color-muted-2)',
                    fontWeight: isCurrent ? 700 : 500,
                    outline: isCurrent
                      ? '2px solid var(--color-primary)'
                      : 'none',
                    outlineOffset: '4px',
                    borderRadius: '2px',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      height: '6px',
                      borderRadius: '3px',
                      background: barColor,
                    }}
                    aria-hidden="true"
                  />
                  <span>
                    {stepNum}. {name}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--color-muted)',
                    }}
                  >
                    {tag}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
