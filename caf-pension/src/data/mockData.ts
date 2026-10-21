export interface MockData {
  applicationRef: string;
  serviceNumber: string;
  releaseDate: string;
  pensionableServiceYears: string;
  deadline: string;
  personal: {
    fullName: string;
    displayTitle: string;
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
    age?: number;
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
  applicationRef: 'DND-CAS-554321',
  serviceNumber: 'M554321',
  releaseDate: '18 April 2025 (Killed in Action - Damascus, Syria)',
  pensionableServiceYears: '34',
  deadline: '18 May 2025',
  personal: {
    fullName: 'General Kelvin Miller',
    displayTitle: 'the late General Kelvin Miller',
    dateOfBirth: '07 October 1959 (Chicoutimi, QC)',
    maskedSin: '••• ••• 321',
    mailingAddressLines: [
      'Estate of General Kelvin Miller',
      'c/o Margaretha Byers, Power of Attorney for Jenny Miller',
      '450 Sussex Drive',
      'Ottawa, Ontario K1N 1J9',
    ],
    phoneLines: ['613-555-0194', '613-555-0182'],
    email: 'estate.kelvin.miller@caf-fac.ca',
    statusNote: 'Killed in action on 18 April 2025 in Damascus, Syria (Registration #554321). Born in Chicoutimi, Quebec. Spouse predeceased (widowed). Survived by daughter Jenny Miller.',
  },
  beneficiary: {
    fullName: 'Jenny Miller',
    relationship: 'Daughter (Sole surviving child)',
    guardianName: 'Margaretha Byers',
  },
  service: {
    componentAtRelease: 'Regular Force',
    dateOfEnrolment: '12 September 1977',
    releaseDate: '18 April 2025',
    releaseItem: '3B - Killed in Action (Damascus, Syria)',
    pensionableServiceFormatted: '34 years 182 days',
    ageAtRelease: '65 (Casualty on active NATO peacekeeping mission)',
  },
  benefitAmounts: {
    deferredAnnuity: '$6,480.00 / month survivor annuity for Jenny Miller',
    annualAllowance: '$5,120.00 / month',
    transferValue: '$789,400.00 lump-sum death benefit',
    immediateAnnuity: 'Survivor Child / Dependent Annuity (payable to Margaretha Byers, Power of Attorney for Jenny Miller)',
  },
  deductions: {
    pshcpPremiumText: 'Survivor continuation coverage under Comprehensive Family.',
    pdspPremiumText: 'Dental continuation coverage for surviving dependent.',
    sdbAmount: '$84.20 (Supplementary Death Benefit to Jenny Miller)',
    healthCarePlanAmount: '$112.50',
    pastServiceBuyBackAmount: '$0.00',
    totalBeforeTaxAmount: '$250.90',
  },
  deposit: {
    defaultHolderName: 'Margaretha Byers (Power of Attorney for Jenny Miller)',
    chequeName: 'Margaretha Byers (Power of Attorney for Jenny Miller)',
  },
};
