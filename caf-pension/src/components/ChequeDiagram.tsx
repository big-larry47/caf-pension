import React from 'react';
import { mockData } from '../data/mockData';

export const ChequeDiagram: React.FC = () => {
  return (
    <section
      aria-label="Where to find your numbers on a cheque"
      className="card"
      style={{ padding: '20px 24px', marginBottom: '24px' }}
    >
      <p style={{ margin: '0 0 12px', fontWeight: 600 }}>
        Find the numbers at the bottom of a cheque
      </p>
      <div className="cheque-diagram">
        <div className="cheque-diagram__top">
          <span>{mockData.deposit.chequeName}</span>
          <span>No. 0123</span>
        </div>
        <div className="cheque-diagram__rule" />
        <div className="cheque-diagram__micr">
          <span className="cheque-diagram__filler">0123</span>
          <span className="cheque-diagram__num">
            <span className="cheque-diagram__num-box cheque-diagram__num-box--transit">
              12345
            </span>
            <span className="cheque-diagram__num-label cheque-diagram__num-label--transit">
              Transit (5)
            </span>
          </span>
          <span className="cheque-diagram__num">
            <span className="cheque-diagram__num-box cheque-diagram__num-box--institution">
              003
            </span>
            <span className="cheque-diagram__num-label cheque-diagram__num-label--institution">
              Institution (3)
            </span>
          </span>
          <span className="cheque-diagram__num">
            <span className="cheque-diagram__num-box cheque-diagram__num-box--account">
              1234567
            </span>
            <span className="cheque-diagram__num-label cheque-diagram__num-label--account">
              Account (7 to 12)
            </span>
          </span>
        </div>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: '15px', color: 'var(--color-muted)' }}>
        No cheques? Your bank's app or website has a "direct deposit form" with the same three numbers.
      </p>
    </section>
  );
};
