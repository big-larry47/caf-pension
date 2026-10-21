export interface SendEmailPayload {
  type: 'invite' | 'submitted' | 'benefit_election';
  recipientEmail?: string;
  guardianName?: string;
  memberName?: string;
  beneficiaryName?: string;
  token?: string;
  refNumber?: string;
  customMessage?: string;
  selectedBenefit?: {
    id?: string;
    title: string;
    amount: string;
  };
}

export async function sendNotificationEmail(payload: SendEmailPayload) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        appUrl: typeof window !== 'undefined' ? window.location.origin : 'https://caf-pension.vercel.app',
      }),
    });

    if (!response.ok) {
      console.warn('Email API returned non-200:', response.status);
    }

    const data = await response.json();
    console.log('Email delivery status:', data);
    return data;
  } catch (err) {
    console.info('Local environment or offline: simulated email delivery.', err);
    return { success: true, simulated: true };
  }
}

export async function sendBenefitElectionEmail(data: {
  selectedBenefit: { id?: string; title: string; amount: string };
  guardianName?: string;
  token?: string;
}) {
  return sendNotificationEmail({
    type: 'benefit_election',
    guardianName: data.guardianName || 'Margaretha Byers',
    memberName: 'General Kelvin Miller',
    beneficiaryName: 'Jenny Miller',
    token: data.token || 'guardian-token',
    refNumber: 'CAF-SRV-2026-9082',
    selectedBenefit: data.selectedBenefit,
  });
}
