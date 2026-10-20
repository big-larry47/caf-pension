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
import { Card } from '../components/Card';
import { StepFooter } from '../components/StepFooter';
import { SeniorGuideBanner } from '../components/SeniorGuideBanner';

interface ServicePageProps {
  readOnly?: boolean;
  isGuardian?: boolean;
}

export const ServicePage: React.FC<ServicePageProps> = ({
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

  const isLocked = readOnly || isGuardian || inviteActive;
  const token = state.invite.token || 'demo-token';

  useEffect(() => {
    document.title = 'Step 2 Service and release - CAF Pension Centre';
  }, []);

  const handleContinue = () => {
    markStepComplete(2, 'member');
    navigate('/application/benefit');
  };

  const nextHref = isGuardian ? `/g/${token}/step/3` : '/application/benefit';
  const prevHref = isGuardian ? `/g/${token}/step/1` : '/application/personal';
  const bankHref = isGuardian ? `/g/${token}/deposit` : '/application/deposit';

  return (
    <>
      {isGuardian ? (
        <>
          <ActingForBanner />
          <GuardianStepper currentStep={2} isViewStep />
        </>
      ) : (
        <ProgressStepper currentStep={2} />
      )}

      <main className="container container--wide">
        {isGuardian && <SeniorGuideBanner token={token} currentStep={2} />}
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
              <HelpCard title="Why this matters">
                <p>
                  Your age and pensionable service at release decide whether you
                  can get an immediate pension, a reduced allowance, or a transfer
                  value.
                </p>
                <p>
                  Outstanding buy-back payments can be taken from your pension.
                  We'll show the amount in step 5.
                </p>
              </HelpCard>
            )
          }
        >
          {isLocked && <ReadOnlyNotice />}

          <h1 className="page-title">
            {isGuardian ? `Service record for the late ${mockData.personal.fullName}` : 'Service record'}
          </h1>
          <p className="page-lead">
            {isGuardian
              ? `Official service and deployment history on file for the late ${mockData.personal.fullName} (died on operational service in Syria).`
              : `Official service history on file for the late ${mockData.personal.fullName}.`}
          </p>

          <Card>
            <div className="info-grid">
              <div>
                <div className="info-grid__label">Component at release</div>
                <div className="info-grid__value">
                  {mockData.service.componentAtRelease}
                </div>
              </div>
              <div>
                <div className="info-grid__label">Date of enrolment</div>
                <div className="info-grid__value">
                  {mockData.service.dateOfEnrolment}
                </div>
              </div>
              <div>
                <div className="info-grid__label">Release date</div>
                <div className="info-grid__value">
                  {mockData.service.releaseDate}
                </div>
              </div>
              <div>
                <div className="info-grid__label">Release item</div>
                <div className="info-grid__value">
                  {mockData.service.releaseItem}
                </div>
              </div>
              <div>
                <div className="info-grid__label">Pensionable service</div>
                <div className="info-grid__value">
                  {mockData.service.pensionableServiceFormatted}
                </div>
              </div>
              <div>
                <div className="info-grid__label">Age at release</div>
                <div className="info-grid__value">
                  {mockData.service.ageAtRelease}
                </div>
              </div>
            </div>
            {!isLocked && (
              <p style={{ margin: '18px 0 0', fontSize: '15px' }}>
                Something wrong?{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Report a difference in your service
                </a>
                . You can keep going while we check it.
              </p>
            )}
          </Card>

          {isLocked ? (
            <Card style={{ marginTop: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Release date confirmed</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-ink)' }}>
                    Permanent & confirmed (15 October 2026 - Date of Casualty)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Paying for past service buy-back</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-ink)' }}>
                    No past service buy-back owing
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
                  Is your release date final?
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="final"
                      checked={state.releaseDateFinal === 'yes'}
                      onChange={() => updateState({ releaseDateFinal: 'yes' })}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    Yes, it is confirmed
                  </label>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="final"
                      checked={state.releaseDateFinal === 'no'}
                      onChange={() => updateState({ releaseDateFinal: 'no' })}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    No, it may still change
                  </label>
                </div>
              </fieldset>

              <fieldset style={{ border: 0, margin: '24px 0 0', padding: 0 }}>
                <legend
                  style={{
                    fontWeight: 600,
                    fontSize: '20px',
                    marginBottom: '4px',
                    padding: 0,
                  }}
                >
                  Are you still paying for past service you elected to buy back?
                </legend>
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: '15px',
                    color: 'var(--color-muted)',
                  }}
                >
                  For example, prior Reserve, RCMP or Public Service time.
                </p>
                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="elect"
                      checked={state.buyBackElected === 'yes'}
                      onChange={() => updateState({ buyBackElected: 'yes' })}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    Yes
                  </label>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="elect"
                      checked={state.buyBackElected === 'no'}
                      onChange={() => updateState({ buyBackElected: 'no' })}
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
                      name="elect"
                      checked={state.buyBackElected === 'not-sure'}
                      onChange={() => updateState({ buyBackElected: 'not-sure' })}
                      style={{
                        width: '22px',
                        height: '22px',
                        margin: 0,
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    I'm not sure
                  </label>
                </div>
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
                    Report an issue with this service record to Pension Centre counselors
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
            <StepFooter backTo="/application/personal" onContinue={handleContinue} />
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
