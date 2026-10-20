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

interface FamilyPageProps {
  readOnly?: boolean;
  isGuardian?: boolean;
}

export const FamilyPage: React.FC<FamilyPageProps> = ({
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
    document.title = 'Step 4 Family and beneficiaries - CAF Pension Centre';
  }, []);

  const handleContinue = () => {
    markStepComplete(4, 'member');
    navigate('/application/deductions');
  };

  const nextHref = isGuardian ? `/g/${token}/step/5` : '/application/deductions';
  const prevHref = isGuardian ? `/g/${token}/step/3` : '/application/benefit';
  const bankHref = isGuardian ? `/g/${token}/deposit` : '/application/deposit';

  return (
    <>
      {isGuardian ? (
        <>
          <ActingForBanner />
          <GuardianStepper currentStep={4} isViewStep />
        </>
      ) : (
        <ProgressStepper currentStep={4} />
      )}

      <main className="container container--wide">
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
                  Your pension includes benefits for an eligible survivor and
                  dependent children. We need their details now so payments are
                  not delayed later.
                </p>
                {!isLocked && (
                  <p>
                    Separated or divorced with a court order?{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Pension division
                    </a>{' '}
                    is handled separately.
                  </p>
                )}
              </HelpCard>
            )
          }
        >
          {isLocked && <ReadOnlyNotice />}

          <h1 className="page-title">Your family and beneficiaries</h1>
          <p className="page-lead">
            {isGuardian
              ? `Survivor and death benefits situation for ${mockData.personal.fullName}.`
              : 'We use this to set up survivor and death benefits. Tell us about your situation on your release date.'}
          </p>

          {isLocked ? (
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px 24px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Marital status</div>
                  <div style={{ fontWeight: 600 }}>{state.maritalStatus}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Dependent children</div>
                  <div style={{ fontWeight: 600 }}>
                    {state.hasDependentChildren === 'yes' ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Supplementary Death Benefit</div>
                  <div style={{ fontWeight: 600 }}>
                    {state.keepSdb === 'yes' ? 'Yes, kept' : 'No, ended'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Beneficiary</div>
                  <div style={{ fontWeight: 600 }}>
                    {state.beneficiaryName || 'Jenny Villa'} ({state.beneficiaryRelationship || 'Daughter, Age 20'})
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <div style={{ maxWidth: '420px' }}>
                <label
                  htmlFor="status"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    fontSize: '20px',
                    marginBottom: '8px',
                  }}
                >
                  Marital status
                </label>
                <select
                  id="status"
                  value={state.maritalStatus}
                  onChange={(e) => updateState({ maritalStatus: e.target.value })}
                  className="field__select"
                >
                  <option value="Married">Married</option>
                  <option value="Common-law">Common-law</option>
                  <option value="Single">Single</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {state.maritalStatus !== 'Widowed' && state.maritalStatus !== 'Single' && (
                <Card
                  style={{
                    marginTop: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: '20px' }}>
                    Spouse or common-law partner
                  </h2>
                  <div className="form-grid">
                    <div>
                      <label htmlFor="sg" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                        Given name
                      </label>
                      <input
                        id="sg"
                        autoComplete="off"
                        value={state.spouseGivenName}
                        onChange={(e) => updateState({ spouseGivenName: e.target.value })}
                        className="field__input"
                      />
                    </div>
                    <div>
                      <label htmlFor="ss" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                        Surname
                      </label>
                      <input
                        id="ss"
                        autoComplete="off"
                        value={state.spouseSurname}
                        onChange={(e) => updateState({ spouseSurname: e.target.value })}
                        className="field__input"
                      />
                    </div>
                    <div>
                      <label htmlFor="sd" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                        Date of birth
                      </label>
                      <input
                        id="sd"
                        type="date"
                        value={state.spouseDob}
                        onChange={(e) => updateState({ spouseDob: e.target.value })}
                        className="field__input"
                      />
                    </div>
                    <div>
                      <label htmlFor="sm" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                        Date of marriage
                      </label>
                      <input
                        id="sm"
                        type="date"
                        value={state.marriageDate}
                        onChange={(e) => updateState({ marriageDate: e.target.value })}
                        className="field__input"
                      />
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '15px', color: 'var(--color-muted)' }}>
                    Common-law? We'll ask for the date you started living together, and may send you a statutory declaration to sign.
                  </p>
                </Card>
              )}

              <fieldset style={{ border: 0, margin: '28px 0 0', padding: 0 }}>
                <legend style={{ fontWeight: 600, fontSize: '20px', marginBottom: '4px', padding: 0 }}>
                  Do you have dependent children?
                </legend>
                <p style={{ margin: '0 0 10px', fontSize: '15px', color: 'var(--color-muted)' }}>
                  Under 18, or under 25 and in full-time school.
                </p>
                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="kids"
                      checked={state.hasDependentChildren === 'yes'}
                      onChange={() => updateState({ hasDependentChildren: 'yes' })}
                      style={{ width: '22px', height: '22px', margin: 0, accentColor: 'var(--color-primary)' }}
                    />
                    Yes
                  </label>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="kids"
                      checked={state.hasDependentChildren === 'no'}
                      onChange={() => updateState({ hasDependentChildren: 'no' })}
                      style={{ width: '22px', height: '22px', margin: 0, accentColor: 'var(--color-primary)' }}
                    />
                    No
                  </label>
                </div>
              </fieldset>

              <fieldset style={{ border: 0, margin: '28px 0 0', padding: 0 }}>
                <legend style={{ fontWeight: 600, fontSize: '20px', marginBottom: '4px', padding: 0 }}>
                  Keep your Supplementary Death Benefit after release?
                </legend>
                <p style={{ margin: '0 0 10px', fontSize: '15px', color: 'var(--color-muted)' }}>
                  A life insurance benefit paid to your beneficiary. The premium comes off your monthly pension.
                </p>
                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="sdb"
                      checked={state.keepSdb === 'yes'}
                      onChange={() => updateState({ keepSdb: 'yes' })}
                      style={{ width: '22px', height: '22px', margin: 0, accentColor: 'var(--color-primary)' }}
                    />
                    Yes, keep it
                  </label>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="sdb"
                      checked={state.keepSdb === 'no'}
                      onChange={() => updateState({ keepSdb: 'no' })}
                      style={{ width: '22px', height: '22px', margin: 0, accentColor: 'var(--color-primary)' }}
                    />
                    No, end it
                  </label>
                </div>
              </fieldset>

              <div className="form-grid" style={{ marginTop: '16px', maxWidth: '640px' }}>
                <div>
                  <label htmlFor="bn" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Beneficiary's full name
                  </label>
                  <input
                    id="bn"
                    value={state.beneficiaryName}
                    onChange={(e) => updateState({ beneficiaryName: e.target.value })}
                    className="field__input"
                  />
                </div>
                <div>
                  <label htmlFor="br" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Relationship to you
                  </label>
                  <input
                    id="br"
                    value={state.beneficiaryRelationship}
                    onChange={(e) => updateState({ beneficiaryRelationship: e.target.value })}
                    className="field__input"
                  />
                </div>
              </div>

              <StepFooter backTo="/application/benefit" onContinue={handleContinue} />
            </>
          )}

          {isLocked && (
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
                    Send this back to {mockData.personal.fullName} with a note
                  </a>
                  . They'll get an email, and your link stays open.
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
