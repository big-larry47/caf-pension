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

interface DeductionsPageProps {
  readOnly?: boolean;
  isGuardian?: boolean;
}

export const DeductionsPage: React.FC<DeductionsPageProps> = ({
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
    document.title = 'Step 5 Deductions and tax - CAF Pension Centre';
  }, []);

  const handleContinue = () => {
    markStepComplete(5, 'member');
    navigate('/application/deposit');
  };

  const nextHref = isGuardian ? `/g/${token}/deposit` : '/application/deposit';
  const prevHref = isGuardian ? `/g/${token}/step/4` : '/application/family';
  const bankHref = isGuardian ? `/g/${token}/deposit` : '/application/deposit';

  return (
    <>
      {isGuardian ? (
        <>
          <ActingForBanner />
          <GuardianStepper currentStep={5} isViewStep />
        </>
      ) : (
        <ProgressStepper currentStep={5} />
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
              <HelpCard title="Want to see your net pension?">
                <p>
                  The Pension Centre quotes gross amounts. Use the estimator to
                  see what lands in your account after these deductions.
                </p>
                <p>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Estimate my net pension
                  </a>
                </p>
              </HelpCard>
            )
          }
        >
          {isLocked && <ReadOnlyNotice />}

          <h1 className="page-title">Tax and deductions</h1>
          <p className="page-lead">
            {isGuardian
              ? `Tax choices and insurance plans for ${mockData.personal.fullName}.`
              : 'These decide how much is taken off each payment before it reaches your bank.'}
          </p>

          <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '22px' }}>Income tax</h2>
            {isLocked ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Province of residence</div>
                  <div style={{ fontWeight: 600 }}>{state.province}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>Tax credits claim</div>
                  <div style={{ fontWeight: 600 }}>
                    {state.td1Option === 'basic' ? 'Basic personal amount only' : 'Other credits'}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ maxWidth: '360px' }}>
                  <label htmlFor="prov" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Province or territory where you'll live
                  </label>
                  <select
                    id="prov"
                    value={state.province}
                    onChange={(e) => updateState({ province: e.target.value })}
                    className="field__select"
                  >
                    <option value="Ontario">Ontario</option>
                    <option value="Quebec">Quebec</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Other…">Other…</option>
                  </select>
                </div>

                <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
                  <legend style={{ fontWeight: 600, marginBottom: '8px', padding: 0 }}>
                    Tax credits (TD1)
                  </legend>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <input
                        type="radio"
                        name="td1"
                        checked={state.td1Option === 'basic'}
                        onChange={() => updateState({ td1Option: 'basic' })}
                        style={{ width: '22px', height: '22px', margin: '2px 0 0', accentColor: 'var(--color-primary)', flex: 'none' }}
                      />
                      Claim the basic personal amount only
                    </label>
                    <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <input
                        type="radio"
                        name="td1"
                        checked={state.td1Option === 'other'}
                        onChange={() => updateState({ td1Option: 'other' })}
                        style={{ width: '22px', height: '22px', margin: '2px 0 0', accentColor: 'var(--color-primary)', flex: 'none' }}
                      />
                      I have other credits, take me through the federal and provincial TD1 questions
                    </label>
                  </div>
                </fieldset>

                <div style={{ maxWidth: '300px' }}>
                  <label htmlFor="xtra" style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}>
                    Extra tax to deduct each month (optional)
                  </label>
                  <p style={{ margin: '0 0 8px', fontSize: '15px', color: 'var(--color-muted)' }}>
                    Useful if you also have other income.
                  </p>
                  <div className="dollar-input">
                    <span className="dollar-input__prefix">$</span>
                    <input
                      id="xtra"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={state.extraTaxMonthly}
                      onChange={(e) => updateState({ extraTaxMonthly: e.target.value })}
                      className="dollar-input__input"
                    />
                  </div>
                </div>
              </>
            )}
          </Card>

          <Card style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px' }}>Health and dental</h2>
            {isLocked ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <b>Public Service Health Care Plan:</b> {state.joinPshcp ? 'Enrolled' : 'Declined'}
                </div>
                <div>
                  <b>Pensioners\' Dental Services Plan:</b> {state.joinPdsp ? 'Enrolled' : 'Declined'}
                </div>
              </div>
            ) : (
              <>
                <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={state.joinPshcp}
                    onChange={(e) => updateState({ joinPshcp: e.target.checked })}
                    style={{ width: '22px', height: '22px', margin: '2px 0 0', accentColor: 'var(--color-primary)', flex: 'none' }}
                  />
                  <span>
                    <b>Join the Public Service Health Care Plan as a pensioner</b>
                    <br />
                    <span style={{ fontSize: '15px', color: 'var(--color-muted)' }}>
                      Premium taken from your pension. {mockData.deductions.pshcpPremiumText}
                    </span>
                  </span>
                </label>
                <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={state.joinPdsp}
                    onChange={(e) => updateState({ joinPdsp: e.target.checked })}
                    style={{ width: '22px', height: '22px', margin: '2px 0 0', accentColor: 'var(--color-primary)', flex: 'none' }}
                  />
                  <span>
                    <b>Join the Pensioners' Dental Services Plan</b>
                    <br />
                    <span style={{ fontSize: '15px', color: 'var(--color-muted)' }}>
                      Premium taken from your pension. {mockData.deductions.pdspPremiumText}
                    </span>
                  </span>
                </label>
              </>
            )}
          </Card>

          <Card style={{ marginTop: '20px' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '22px' }}>
              Your monthly deductions so far
            </h2>
            <table className="deductions-table">
              <tbody>
                <tr>
                  <th scope="row">Supplementary Death Benefit</th>
                  <td>{mockData.deductions.sdbAmount}</td>
                </tr>
                <tr>
                  <th scope="row">Health care plan</th>
                  <td>{mockData.deductions.healthCarePlanAmount}</td>
                </tr>
                <tr>
                  <th scope="row">Past service buy-back</th>
                  <td>{mockData.deductions.pastServiceBuyBackAmount}</td>
                </tr>
                <tr className="deductions-table__total">
                  <th scope="row">Total before tax</th>
                  <td>{mockData.deductions.totalBeforeTaxAmount}</td>
                </tr>
              </tbody>
            </table>
          </Card>

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
          ) : (
            <StepFooter backTo="/application/family" onContinue={handleContinue} />
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
