import React from 'react';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';

export const GuardianDonePage: React.FC = () => {
  const { state } = useApplication();
  const memberName = mockData.personal.fullName;
  const refNumber = mockData.applicationRef || 'CAF-2026-88421';

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans text-[#14263C]">
      <main className="max-w-[720px] mx-auto px-6 py-12">
        <div
          role="status"
          className="bg-[#1F6F4A] text-white rounded-[10px] p-8 text-center shadow-sm"
        >
          <svg
            aria-hidden="true"
            className="w-12 h-12 mx-auto mb-3 stroke-white stroke-[2.5]"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M7 12.5l3.5 3.5L17 9" />
          </svg>
          <h1 className="text-3xl font-bold mb-2 leading-tight">Application submitted</h1>
          <p className="text-lg text-emerald-100">
            Survivor pension & benefits for <strong>Jenny Villa</strong> (surviving daughter of the late General Felix Villa)
          </p>
          <div className="mt-4 pt-4 border-t border-emerald-600/50">
            <p className="text-sm text-emerald-200 uppercase tracking-wider font-semibold">Reference number</p>
            <p className="text-2xl font-bold tracking-wider mt-1">{refNumber}</p>
          </div>
        </div>

        <p className="mt-6 text-[#14263C]">
          We've emailed a confirmation to you as legal guardian for Jenny Villa. This link no longer works.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">What happens next</h2>
        <ol className="space-y-4 pl-6 list-decimal text-base">
          <li>
            <strong>Application review.</strong> The CAF Pension Centre will review the casualty file and confirm survivor benefit entitlement for Jenny Villa.
          </li>
          <li>
            <strong>Direct deposit confirmation.</strong> We will verify the bank account provided for direct deposit.
          </li>
          <li>
            <strong>Payments start.</strong> The first survivor pension payment is scheduled to be deposited within 30 to 45 calendar days.
          </li>
        </ol>

        <div className="flex gap-4 flex-wrap items-center mt-8">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center min-h-[48px] px-6 border-2 border-[#0B5CAD] text-[#0B5CAD] hover:bg-blue-50 font-semibold rounded-md transition-colors"
          >
            Download a copy (PDF)
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center min-h-[48px] px-6 border-2 border-[#0B5CAD] text-[#0B5CAD] hover:bg-blue-50 font-semibold rounded-md transition-colors"
          >
            Print mailing cover sheet
          </button>
        </div>

        <p className="mt-8 text-sm text-[#4A5565]">
          Questions? Call 1-800-267-0325 and give the reference number.
        </p>
      </main>
    </div>
  );
};

export default GuardianDonePage;
