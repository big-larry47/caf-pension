import React from 'react';

interface ProgressStepperProps {
  currentStep: number; // 1 to 7
}

export const STEP_NAMES = [
  'Personal details',
  'Service & release',
  'Benefit option',
  'Family',
  'Deductions & tax',
  'Direct deposit',
  'Review',
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  const currentIndex = currentStep - 1;
  const currentTitle = STEP_NAMES[currentIndex] || '';

  return (
    <nav aria-label="Application progress" className="progress-stepper">
      <div className="progress-stepper__inner">
        <div className="progress-stepper__top">
          <span>
            <b>Step {currentStep} of 7</b> · {currentTitle}
          </span>
          <span>All changes saved</span>
        </div>
        <ol
          className="progress-stepper__bar-list"
          style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
        >
          {STEP_NAMES.map((name, i) => {
            const stepNum = i + 1;
            const isCompleted = i < currentIndex;
            const isCurrent = i === currentIndex;
            const stateText = isCompleted
              ? 'completed'
              : isCurrent
              ? 'current step'
              : 'not started';

            const itemClass = isCurrent
              ? 'progress-stepper__item progress-stepper__item--current'
              : isCompleted
              ? 'progress-stepper__item progress-stepper__item--completed'
              : 'progress-stepper__item';

            return (
              <li key={stepNum} className={itemClass}>
                <span className="progress-stepper__bar" aria-hidden="true" />
                <span className="progress-stepper__label">
                  {stepNum}. {name}
                  <span className="sr-only"> ({stateText})</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
