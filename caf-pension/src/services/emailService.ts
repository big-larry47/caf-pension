export interface SendEmailPayload {
  type: 'invite' | 'submitted';
  recipientEmail: string;
  guardianName?: string;
  memberName?: string;
  token?: string;
  refNumber?: string;
  customMessage?: string;
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
