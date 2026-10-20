import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface StepFooterProps {
  backTo: string;
  continueTo?: string;
  onContinue?: () => void;
  continueText?: string;
  saveAndExitTo?: string;
  isSubmit?: boolean;
}

export const StepFooter: React.FC<StepFooterProps> = ({
  backTo,
  continueTo,
  onContinue,
  continueText = 'Save and continue',
  saveAndExitTo = '/application',
  isSubmit = false,
}) => {
  return (
    <div className="step-footer">
      <Button variant="secondary" to={backTo}>
        Back
      </Button>
      <div className="step-footer__right">
        <Link to={saveAndExitTo} className="link">
          Save and exit
        </Link>
        {continueTo ? (
          <Button variant="primary" to={continueTo} onClick={onContinue}>
            {continueText}
          </Button>
        ) : (
          <Button
            variant="primary"
            type={isSubmit ? 'submit' : 'button'}
            onClick={onContinue}
          >
            {continueText}
          </Button>
        )}
      </div>
    </div>
  );
};
