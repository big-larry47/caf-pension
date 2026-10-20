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
  releaseDate: '15 October 2026',
  pensionableServiceYears: '34',
  deadline: '15 November 2026',
  personal: {
    fullName: 'General Felix Villa',
    dateOfBirth: '14 August 1958',
    maskedSin: '••• ••• 842',
    mailingAddressLines: [
      '450 Sussex Drive',
      'Ottawa, Ontario',
      'K1N 1J9',
    ],
    phoneLines: ['613-555-0194', '613-555-0182'],
    email: 'felix.villa@caf-fac.ca',
  },
  service: {
    componentAtRelease: 'Regular Force',
    dateOfEnrolment: '01 September 1978',
    releaseDate: '15 October 2026',
    releaseItem: '3B - Operational Service (Syria)',
    pensionableServiceFormatted: '34 years 182 days',
    ageAtRelease: '68',
  },
  benefitAmounts: {
    deferredAnnuity: '$6,480.00 / month at 60',
    annualAllowance: '$5,120.00 / month at 68',
    transferValue: '$1,240,500.00 lump sum',
    immediateAnnuity: 'Not available',
  },
  deductions: {
    pshcpPremiumText: '$112.50 per month for Comprehensive Family.',
    pdspPremiumText: '$54.20 per month.',
    sdbAmount: '$84.20',
    healthCarePlanAmount: '$112.50',
    pastServiceBuyBackAmount: '$0.00',
    totalBeforeTaxAmount: '$250.90',
  },
  deposit: {
    defaultHolderName: 'General Felix Villa',
    chequeName: 'General Felix Villa',
  },
};
