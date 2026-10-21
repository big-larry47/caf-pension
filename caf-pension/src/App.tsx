import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import { AppHeader } from './components/AppHeader';
import { DevSwitcher } from './components/DevSwitcher';
import { StartPage } from './pages/StartPage';
import { VerifyPage } from './pages/VerifyPage';
import { ApplicantPage } from './pages/ApplicantPage';
import { HubPage } from './pages/HubPage';
import { PersonalPage } from './pages/PersonalPage';
import { ServicePage } from './pages/ServicePage';
import { BenefitPage } from './pages/BenefitPage';
import { FamilyPage } from './pages/FamilyPage';
import { DeductionsPage } from './pages/DeductionsPage';
import { MemberDepositChoicePage } from './pages/MemberDepositChoicePage';
import { MemberBankDepositPage } from './pages/MemberBankDepositPage';
import { MemberReviewPage } from './pages/MemberReviewPage';
import { MemberDonePage } from './pages/MemberDonePage';
import { InvitePreviewPage } from './pages/InvitePreviewPage';
import { GuardianVerifyPage } from './pages/GuardianVerifyPage';
import { GuardianStepViewPage } from './pages/GuardianStepViewPage';
import { GuardianDepositPage } from './pages/GuardianDepositPage';
import { GuardianReviewPage } from './pages/GuardianReviewPage';
import { GuardianDonePage } from './pages/GuardianDonePage';
import { GuardianExpiredPage } from './pages/GuardianExpiredPage';
import { GuardianDownloadPage } from './pages/GuardianDownloadPage';
import { ScrollToTop } from './components/ScrollToTop';

export const App: React.FC = () => {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppHeader />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public/Entry flow */}
              <Route path="/" element={<StartPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/applicant" element={<ApplicantPage />} />

              {/* Member application flow */}
              <Route path="/application" element={<HubPage />} />
              <Route path="/application/personal" element={<PersonalPage />} />
              <Route path="/application/service" element={<ServicePage />} />
              <Route path="/application/benefit" element={<BenefitPage />} />
              <Route path="/application/family" element={<FamilyPage />} />
              <Route path="/application/deductions" element={<DeductionsPage />} />
              <Route path="/application/deposit" element={<MemberDepositChoicePage />} />
              <Route path="/application/deposit/bank" element={<MemberBankDepositPage />} />
              <Route path="/application/review" element={<MemberReviewPage />} />
              <Route path="/application/submitted" element={<MemberDonePage />} />

              {/* Dev / Guardian Invitation preview */}
              <Route path="/dev/invite-preview" element={<InvitePreviewPage />} />

              {/* Guardian streamlined flow: Security verify -> Download & Email instructions */}
              <Route path="/g/:token" element={<GuardianVerifyPage />} />
              <Route path="/g/:token/form-package" element={<GuardianDownloadPage />} />
              <Route path="/g/:token/download" element={<GuardianDownloadPage />} />
              <Route path="/g/:token/expired" element={<GuardianExpiredPage />} />

              {/* Redirect old editor and multi-step routes directly to the form package page */}
              <Route path="/forms/*" element={<Navigate to="/g/demo-token/form-package" replace />} />
              <Route path="/g/:token/paper-form" element={<Navigate to="/g/demo-token/form-package" replace />} />
              <Route path="/g/:token/step/:stepNumber" element={<Navigate to="/g/demo-token/form-package" replace />} />
              <Route path="/g/:token/deposit" element={<Navigate to="/g/demo-token/form-package" replace />} />
              <Route path="/g/:token/review" element={<Navigate to="/g/demo-token/form-package" replace />} />
              <Route path="/g/:token/submitted" element={<Navigate to="/g/demo-token/form-package" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <DevSwitcher />
        </div>
      </BrowserRouter>
    </ApplicationProvider>
  );
};

export default App;
