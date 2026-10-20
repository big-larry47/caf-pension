import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { HelpCard } from '../components/HelpCard';
import { StepLayout } from '../components/StepLayout';

export const StartPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Apply for your Canadian Armed Forces pension - CAF Pension Centre';
  }, []);

  return (
    <main className="container container--wide">
      <p className="breadcrumb">
        Pay and pension › Canadian Armed Forces pensions › Apply
      </p>
      <h1 className="page-title page-title--large" style={{ maxWidth: '760px' }}>
        Apply for your Canadian Armed Forces pension
      </h1>
      <p className="page-lead page-lead--large" style={{ maxWidth: '760px' }}>
        Use this service if you are releasing, or have released, from the Regular
        Force or Reserve Force and want to start your pension benefits. It takes
        about 25 minutes, and you can save and come back at any time.
      </p>

      <StepLayout
        aside={
          <>
            <HelpCard title="Not the right service?">
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <li>
                  <a href="#">Applying as a survivor or for an estate</a>
                </li>
                <li>
                  <a href="#">Get a pension estimate first</a>
                </li>
                <li>
                  <a href="#">Change banking details on an existing pension</a>
                </li>
              </ul>
            </HelpCard>
            <HelpCard title="Need help?">
              <p>
                Call the Pension Centre at <b>1-800-267-0325</b>. Have your
                service number ready.
              </p>
            </HelpCard>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card padded>
            <h2 style={{ margin: '0 0 12px', fontSize: '24px' }}>
              Before you start, have these ready
            </h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>
                Your <b>service number</b> and <b>Social Insurance Number</b>
              </li>
              <li>
                Your <b>Pension Benefit Options Statement</b>, if you have
                received it
              </li>
              <li>Your spouse or common-law partner's name and date of birth</li>
              <li>
                Your <b>banking information</b> for direct wire deposit: institution number, transit
                (branch) number and account number.
              </li>
            </ul>
          </Card>

          <Card padded>
            <h2 style={{ margin: '0 0 8px', fontSize: '24px' }}>
              Sign in to start
            </h2>
            <p style={{ margin: '0 0 20px', color: 'var(--color-ink-2)' }}>
              Choose how you want to sign in. Your progress is saved to your
              account.
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '460px',
              }}
            >
              <Link
                to="/verify"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '52px',
                  padding: '0 24px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-input)',
                }}
              >
                Sign in with GCKey
              </Link>
              <Link
                to="/verify"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '52px',
                  padding: '0 24px',
                  background: '#FFFFFF',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '2px solid var(--color-primary)',
                  borderRadius: 'var(--radius-input)',
                }}
              >
                Sign in with your bank (Sign-In Partner)
              </Link>
              <Link
                to="/verify"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '52px',
                  padding: '0 24px',
                  background: '#FFFFFF',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '2px solid var(--color-primary)',
                  borderRadius: 'var(--radius-input)',
                }}
              >
                Still serving? Sign in through CWA
              </Link>
            </div>
          </Card>

          <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-muted)' }}>
            Protected B when completed. Your personal information is collected
            under the Canadian Forces Superannuation Act and used only to
            administer your pension.
          </p>
        </div>
      </StepLayout>
    </main>
  );
};
