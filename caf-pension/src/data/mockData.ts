export interface MockData {
  applicationRef: string;
  serviceNumber: string;
  releaseDate: string;
  pensionableServiceYears: string;
  deadline: string;
  personal: {
    fullName: string;
    dateOfBirth: string;
    maskedSin: string;
    mailingAddressLines: string[];
    phoneLines: string[];
    email: string;
    statusNote: string;
  };
  beneficiary: {
    fullName: string;
    relationship: string;
    age: number;
    guardianName: string;
  };
  service: {
    componentAtRelease: string;
    dateOfEnrolment: string;
    releaseDate: string;
    releaseItem: string;
    pensionableServiceFormatted: string;
    ageAtRelease: string;
  };
  benefitAmounts: {
    deferredAnnuity: string;
    annualAllowance: string;
    transferValue: string;
    immediateAnnuity: string;
  };
  deductions: {
    pshcpPremiumText: string;
    pdspPremiumText: string;
    sdbAmount: string;
    healthCarePlanAmount: string;
    pastServiceBuyBackAmount: string;
    totalBeforeTaxAmount: string;
  };
  deposit: {
    defaultHolderName: string;
    chequeName: string;
  };
}

export const mockData: MockData = {
  applicationRef: 'CAF-2026-849204',
  serviceNumber: 'V18492047',
  releaseDate: '15 October 2026 (Date of Death)',
  pensionableServiceYears: '34',
  deadline: '15 November 2026',
  personal: {
    fullName: 'The late General Felix Villa (Deceased)',
    dateOfBirth: '14 August 1958',
    maskedSin: '••• ••• 842',
    mailingAddressLines: [
      'Estate of General Felix Villa',
      'c/o Sarah Villa, Legal Guardian for Jenny Villa',
      '450 Sussex Drive',
      'Ottawa, Ontario K1N 1J9',
    ],
    phoneLines: ['613-555-0194', '613-555-0182'],
    email: 'estate.felix.villa@caf-fac.ca',
    statusNote: 'Deceased at age 68 while deployed on operational service in Syria. Spouse predeceased (widowed). Survived by daughter Jenny Villa (age 20).',
  },
  beneficiary: {
    fullName: 'Jenny Villa',
    relationship: 'Daughter (Sole surviving child)',
    age: 20,
    guardianName: 'Sarah Villa',
  },
  service: {
    componentAtRelease: 'Regular Force',
    dateOfEnrolment: '01 September 1978',
    releaseDate: '15 October 2026',
    releaseItem: '3B - Died on Operational Service (Syria)',
    pensionableServiceFormatted: '34 years 182 days',
    ageAtRelease: '68 (Deceased on active deployment in Syria)',
  },
  benefitAmounts: {
    deferredAnnuity: '$6,480.00 / month survivor annuity for Jenny Villa',
    annualAllowance: '$5,120.00 / month',
    transferValue: '$1,240,500.00 lump-sum death benefit',
    immediateAnnuity: 'Survivor Child / Dependent Annuity (payable to Guardian for Jenny Villa)',
  },
  deductions: {
    pshcpPremiumText: 'Survivor continuation coverage under Comprehensive Family.',
    pdspPremiumText: 'Dental continuation coverage for surviving dependent.',
    sdbAmount: '$84.20 (Supplementary Death Benefit to Jenny Villa)',
    healthCarePlanAmount: '$112.50',
    pastServiceBuyBackAmount: '$0.00',
    totalBeforeTaxAmount: '$250.90',
  },
  deposit: {
    defaultHolderName: 'Sarah Villa (In Trust for Jenny Villa)',
    chequeName: 'Sarah Villa (Legal Guardian for Jenny Villa)',
  },
};
