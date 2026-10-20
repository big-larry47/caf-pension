import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '../data/mockData';

export type Actor = 'member' | 'guardian';
export type AuthorityType = 'poa' | 'guardian' | 'trustee' | 'other';
export type InviteStatus =
  | 'none'
  | 'sent'
  | 'opened'
  | 'verified'
  | 'submitted'
  | 'expired'
  | 'cancelled';

export interface Invite {
  token: string;
  status: InviteStatus;
  sentAt: string;
  expiresAt: string;
  guardian: {
    fullName: string;
    role: AuthorityType;
    email: string;
    mobile: string;
    message?: string;
  };
  memberConsent: boolean;
}

export interface GuardianProfile {
  fullName: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  language: 'en' | 'fr';
  authorityType: AuthorityType;
  authorityFile?: { name: string; pages?: number };
  declared: boolean;
}

export interface DepositData {
  ownerType?: 'member' | 'joint' | 'trust';
  holderName: string;
  transit: string;
  institution: string;
  account: string;
  accountConfirm: string;
  voidChequeFile?: { name: string };
  authorized: boolean;
  submitted: boolean;
}

export interface SectionMeta {
  completedBy: Actor;
  completedAt: string;
}

export interface ApplicationState {
  // Verify
  serviceNumber: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  sinLast3: string;
  otp: string;

  // Applicant
  who: 'member' | 'poa' | 'survivor';
  force: 'regular' | 'reserve' | 'both';

  // Step 1: Personal
  contactLanguage: 'en' | 'fr';
  liveAbroad: 'no' | 'yes';

  // Step 2: Service
  releaseDateFinal: 'yes' | 'no';
  buyBackElected: 'yes' | 'no' | 'not-sure';

  // Step 3: Benefit
  benefitOption: 'deferred' | 'allowance' | 'transfer' | 'immediate';
  benefitConfirmed: boolean;

  // Step 4: Family
  maritalStatus: string;
  spouseGivenName: string;
  spouseSurname: string;
  spouseDob: string;
  marriageDate: string;
  hasDependentChildren: 'yes' | 'no';
  keepSdb: 'yes' | 'no';
  beneficiaryName: string;
  beneficiaryRelationship: string;

  // Step 5: Deductions
  province: string;
  td1Option: 'basic' | 'other';
  extraTaxMonthly: string;
  joinPshcp: boolean;
  joinPdsp: boolean;

  // Step 6: Deposit Choice
  depositChoice: 'me' | 'guardian';

  // Step 6: Member Deposit
  bankLocation: 'canada' | 'outside';
  memberDeposit: DepositData;

  // Guardian Flow
  invite: Invite;
  guardianProfile: GuardianProfile;
  guardianDeposit: DepositData;
  guardianSignature: string;
  guardianDeclared1: boolean;
  guardianDeclared2: boolean;

  // Member Review (Step 7)
  memberReviewDeclared: boolean;
  memberSignature: string;

  // Completion & metadata
  completedSteps: number[]; // 1 to 7
  sectionMeta: Record<number, SectionMeta>;

  // Current dev active actor
  activeActor: Actor;
}

const defaultState: ApplicationState = {
  // Verify prefilled
  serviceNumber: 'V18492047',
  dobDay: '14',
  dobMonth: '08',
  dobYear: '1958',
  sinLast3: '842',
  otp: '492815',

  // Applicant
  who: 'survivor',
  force: 'regular',

  // Step 1: Personal
  contactLanguage: 'en',
  liveAbroad: 'no',

  // Step 2: Service
  releaseDateFinal: 'yes',
  buyBackElected: 'no',

  // Step 3: Benefit
  benefitOption: 'deferred',
  benefitConfirmed: true,

  // Step 4: Family
  maritalStatus: 'Widowed (Spouse deceased)',
  spouseGivenName: '',
  spouseSurname: '',
  spouseDob: '',
  marriageDate: '',
  hasDependentChildren: 'yes',
  keepSdb: 'yes',
  beneficiaryName: 'Jenny Villa',
  beneficiaryRelationship: 'Daughter (Age 20)',

  // Step 5: Deductions
  province: 'Ontario',
  td1Option: 'basic',
  extraTaxMonthly: '150.00',
  joinPshcp: true,
  joinPdsp: true,

  // Step 6: Deposit Choice
  depositChoice: 'guardian',

  // Step 6: Member Deposit
  bankLocation: 'canada',
  memberDeposit: {
    holderName: mockData.deposit.defaultHolderName,
    transit: '',
    institution: '',
    account: '',
    accountConfirm: '',
    authorized: false,
    submitted: false,
  },

  // Guardian Flow
  invite: {
    token: 'demo-token',
    status: 'none',
    sentAt: '15 October 2026',
    expiresAt: '29 October 2026',
    guardian: {
      fullName: 'Sarah Villa',
      role: 'guardian',
      email: 'sarah.villa@example.com',
      mobile: '6135551234',
      message:
        'Receiving survivor pension benefits on behalf of Jenny Villa (age 20), surviving daughter of the late General Felix Villa who passed away at 68 while deployed in Syria.',
    },
    memberConsent: true,
  },

  guardianProfile: {
    fullName: 'Sarah Villa',
    dateOfBirth: '1988-04-12',
    address: {
      street: '120 Queen Street, Apt 4B',
      city: 'Ottawa',
      province: 'Ontario',
      postalCode: 'K1P 5Z9',
    },
    language: 'en',
    authorityType: 'poa',
    authorityFile: { name: 'power-of-attorney.pdf', pages: 4 },
    declared: true,
  },

  guardianDeposit: {
    ownerType: 'member',
    holderName: mockData.personal.fullName,
    transit: '',
    institution: '',
    account: '',
    accountConfirm: '',
    authorized: false,
    submitted: false,
  },

  guardianSignature: '',
  guardianDeclared1: false,
  guardianDeclared2: false,

  // Member Review (Step 7)
  memberReviewDeclared: false,
  memberSignature: '',

  // Steps 1 to 5 completed initially by member
  completedSteps: [1, 2, 3, 4, 5],
  sectionMeta: {
    1: { completedBy: 'member', completedAt: '15 October 2026' },
    2: { completedBy: 'member', completedAt: '15 October 2026' },
    3: { completedBy: 'member', completedAt: '15 October 2026' },
    4: { completedBy: 'member', completedAt: '15 October 2026' },
    5: { completedBy: 'member', completedAt: '15 October 2026' },
  },

  activeActor: 'member',
};

const STORAGE_KEY = 'caf_pension_application_state_v3';

interface ApplicationContextType {
  state: ApplicationState;
  updateState: (updates: Partial<ApplicationState>) => void;
  markStepComplete: (step: number, actor?: Actor) => void;
  resetState: () => void;
  setInviteStatus: (status: InviteStatus) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ApplicationState>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultState, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to read from sessionStorage', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to write to sessionStorage', e);
    }
  }, [state]);

  const updateState = (updates: Partial<ApplicationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const markStepComplete = (step: number, actor: Actor = 'member') => {
    setState((prev) => {
      const now = '15 October 2026';
      const completed = prev.completedSteps.includes(step)
        ? prev.completedSteps
        : [...prev.completedSteps, step].sort((a, b) => a - b);

      return {
        ...prev,
        completedSteps: completed,
        sectionMeta: {
          ...prev.sectionMeta,
          [step]: { completedBy: actor, completedAt: now },
        },
      };
    });
  };

  const setInviteStatus = (status: InviteStatus) => {
    setState((prev) => ({
      ...prev,
      invite: {
        ...prev.invite,
        status,
      },
    }));
  };

  const resetState = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  return (
    <ApplicationContext.Provider
      value={{ state, updateState, markStepComplete, resetState, setInviteStatus }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};
