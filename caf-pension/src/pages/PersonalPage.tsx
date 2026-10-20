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
import { SummaryList, SummaryListItem } from '../components/SummaryList';
import { StepFooter } from '../components/StepFooter';
import { Card } from '../components/Card';
import { SeniorGuideBanner } from '../components/SeniorGuideBanner';

interface PersonalPageProps {
  readOnly?: boolean;
  isGuardian?: boolean;
}

export const PersonalPage: React.FC<PersonalPageProps> = ({
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
    document.title = 'Step 1 Personal details - CAF Pension Centre';
  }, []);

  const handleContinue = () => {
    markStepComplete(1, 'member');
    navigate('/application/service');
  };

  const nextHref = isGuardian ? `/g/${token}/step/2` : '/application/service';
  const prevHref = isGuardian ? '#' : '/application';
  const bankHref = isGuardian ? `/g/${token}/deposit` : '/application/deposit';

  const summaryItems: SummaryListItem[] = [
    {
      label: 'Full name',
      value: mockData.personal.fullName,
      action: !isLocked
        ? {
            text: 'Change',
            visuallyHiddenText: 'full name',
            onClick: () => {},
          }
        : undefined,
    },
    {
      label: 'Status & Beneficiary',
      value: mockData.personal.statusNote,
      mutedActionText: 'CAF Casualty Record',
    },
    {
      label: 'Date of birth',
      value: mockData.personal.dateOfBirth,
      mutedActionText: 'From service record',
    },
    {
      label: 'Social Insurance Number',
      value: mockData.personal.maskedSin,
      mutedActionText: 'From service record',
    },
    {
      label: 'Mailing address',
      value: (
        <>
          {mockData.personal.mailingAddressLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < mockData.personal.mailingAddressLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      ),
      action: !isLocked
        ? {
            text: 'Change',
            visuallyHiddenText: 'mailing address',
            onClick: () => {},
          }
        : undefined,
    },
    {
      label: 'Phone',
      value: (
        <>
          {mockData.personal.phoneLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < mockData.personal.phoneLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      ),
      action: !isLocked
        ? {
            text: 'Change',
            visuallyHiddenText: 'phone',
            onClick: () => {},
          }
        : undefined,
    },
    {
      label: 'Email',
      value: (
        <span style={{ overflowWrap: 'anywhere' }}>
          {mockData.personal.email}
        </span>
      ),
      action: !isLocked
        ? {
            text: 'Change',
            visuallyHiddenText: 'email',
            onClick: () => {},
          }
        : undefined,
    },
  ];

  return (
    <>
      {isGuardian ? (
        <>
          <ActingForBanner />
          <GuardianStepper currentStep={1} isViewStep />
        </>
      ) : (
        <ProgressStepper currentStep={1} />
      )}

      <main className="container container--wide">
        {isGuardian && <SeniorGuideBanner token={token} currentStep={1} />}
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
              <HelpCard title="Why we ask">
                <p>
                  Your pension statements, tax slips (T4A) and letters go to this
                  address. An out-of-date address is a common cause of delays.
                </p>
                {!isLocked && (
                  <p>
                    Name or date of birth wrong?{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Tell us how to correct it
                    </a>
                    . You will need a supporting document.
                  </p>
                )}
              </HelpCard>
            )
          }
        >
          {isLocked && <ReadOnlyNotice />}

          <h1 className="page-title">
            {isGuardian ? `Personal details for the late ${mockData.personal.fullName}` : 'Personal details'}
          </h1>
          <p className="page-lead">
            {isGuardian
              ? `Official personal and casualty record on file for the late ${mockData.personal.fullName}.`
              : `Official personal and casualty record on file for the late ${mockData.personal.fullName}.`}
          </p>

          <SummaryList items={summaryItems} />

          {isLocked ? (
            <Card style={{ marginTop: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Contact language</div>
                  <div style={{ fontWeight: 600 }}>
                    {state.contactLanguage === 'en' ? 'English' : 'French'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Living outside Canada</div>
                  <div style={{ fontWeight: 600 }}>
                    {state.liveAbroad === 'yes' ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <fieldset style={{ border: 0, margin: '28px 0 0', padding: 0 }}>
                <legend
                  style={{
                    fontWeight: 600,
                    fontSize: '20px',
                    marginBottom: '10px',
                    padding: 0,
                  }}
                >
                  Which language should we use to contact you?
                </legend>
                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="lang"
                      checked={state.contactLanguage === 'en'}
                      onChange={() => updateState({ contactLanguage: 'en' })}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    English
                  </label>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="lang"
                      checked={state.contactLanguage === 'fr'}
                      onChange={() => updateState({ contactLanguage: 'fr' })}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    French
                  </label>
                </div>
              </fieldset>

              <fieldset style={{ border: 0, margin: '24px 0 0', padding: 0 }}>
                <legend
                  style={{
                    fontWeight: 600,
                    fontSize: '20px',
                    marginBottom: '10px',
                    padding: 0,
                  }}
                >
                  Will you live outside Canada when your pension starts?
                </legend>
                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="abroad"
                      checked={state.liveAbroad === 'no'}
                      onChange={() => updateState({ liveAbroad: 'no' })}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    No
                  </label>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="abroad"
                      checked={state.liveAbroad === 'yes'}
                      onChange={() => updateState({ liveAbroad: 'yes' })}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    Yes
                  </label>
                </div>
                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                  }}
                >
                  This changes the tax questions and banking options you see later.
                </p>
              </fieldset>
            </>
          )}

          {isLocked ? (
            <>
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
                    Report an issue with this record to Pension Centre counselors
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
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
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
            <StepFooter backTo="/application" onContinue={handleContinue} />
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
