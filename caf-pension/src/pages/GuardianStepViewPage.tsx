import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { PersonalPage } from './PersonalPage';
import { ServicePage } from './ServicePage';
import { BenefitPage } from './BenefitPage';
import { FamilyPage } from './FamilyPage';
import { DeductionsPage } from './DeductionsPage';

export const GuardianStepViewPage: React.FC = () => {
  const { stepNumber: paramStep, n, token } = useParams<{ stepNumber?: string; n?: string; token: string }>();
  const { state } = useApplication();

  if (state.invite.status === 'submitted') {
    return <Navigate to={`/g/${token}/expired`} replace />;
  }

  if (state.invite.status !== 'verified') {
    return <Navigate to={`/g/${token}`} replace />;
  }

  const stepNumber = parseInt(paramStep || n || '1', 10);

  switch (stepNumber) {
    case 1:
      return <PersonalPage readOnly isGuardian />;
    case 2:
      return <ServicePage readOnly isGuardian />;
    case 3:
      return <BenefitPage readOnly={false} isGuardian />;
    case 4:
      return <FamilyPage readOnly isGuardian />;
    case 5:
      return <DeductionsPage readOnly isGuardian />;
    default:
      return <Navigate to={`/g/${token}/step/1`} replace />;
  }
};
