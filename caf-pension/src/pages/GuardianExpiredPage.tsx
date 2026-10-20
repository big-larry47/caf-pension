import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import { mockData } from '../data/mockData';

export const GuardianExpiredPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { state } = useApplication();
  const memberName = mockData.personal.fullName;
  const isSubmitted = state.invite.status === 'submitted';
  const isCancelled = state.invite.status === 'cancelled';

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans text-[#14263C]">
      <main className="max-w-[640px] mx-auto px-6 py-16">
        <div className="bg-white rounded-lg border border-[#DCE3EB] p-8 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-[#9A3412] mb-4">
            <svg
              className="w-6 h-6 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {isSubmitted ? 'Application already submitted' : 'This link is no longer valid'}
          </h1>

          {isSubmitted ? (
            <div>
              <p className="text-gray-700 mb-4">
                The pension application for {memberName} has already been submitted. For security reasons, this one-time link cannot be used again to view or edit the application.
              </p>
              <Link
                to={`/g/${token}/submitted`}
                className="inline-flex items-center justify-center min-h-[44px] px-5 bg-[#0B5CAD] text-white font-semibold rounded hover:bg-[#08427C] transition-colors"
              >
                View submission confirmation
              </Link>
            </div>
          ) : isCancelled ? (
            <p className="text-gray-700">
              {memberName} has cancelled this invitation or chosen to complete their application directly. Please get in touch with {memberName} if you believe this was done in error.
            </p>
          ) : (
            <p className="text-gray-700">
              This invitation link has expired. Invitation links are valid for 14 days after being sent. Please contact {memberName} to request a new link.
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-[#4A5565]">
            <p>
              Need assistance? Call the CAF Pension Centre at <strong className="text-gray-900">1-800-267-0325</strong> (Monday to Friday, 8:00 to 16:00 ET).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuardianExpiredPage;
