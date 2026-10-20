import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    type,
    recipientEmail,
    guardianName,
    memberName = 'General Kelvin Miller',
    token = 'demo-token',
    refNumber = 'CAF-2026-849204',
    customMessage,
    appUrl = 'https://caf-pension.vercel.app',
  } = req.body || {};

  if (!recipientEmail) {
    return res.status(400).json({ error: 'recipientEmail is required' });
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const from = process.env.SMTP_FROM || `"CAF Pension Centre" <noreply@caf-pension.ca>`;

  const inviteUrl = `${appUrl.replace(/\/$/, '')}/g/${token}`;

  let subject = '';
  let html = '';

  if (type === 'invite') {
    subject = `Action required: Finish pension application for ${memberName}`;
    html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #14263C; line-height: 1.5;">
        <div style="background: #14263C; color: #FFFFFF; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700;">CAF Pension Centre</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #C9D6E6;">Online pension application · Canadian Armed Forces</p>
        </div>

        <div style="padding: 32px 24px; background: #FFFFFF; border: 1px solid #DCE3EB; border-top: none;">
          <h1 style="font-size: 22px; color: #14263C; margin-top: 0;">Hello ${guardianName || 'Guardian'},</h1>
          <p style="font-size: 16px;">
            <strong>${memberName}</strong> has completed their portion of the Canadian Armed Forces retirement pension application and has designated you as their legal representative to finish the final steps (direct deposit and legal declaration).
          </p>

          ${
            customMessage
              ? `<blockquote style="background: #F4F6F8; border-left: 4px solid #0B5CAD; margin: 20px 0; padding: 12px 16px; font-style: italic; color: #4A5565;">
                  "${customMessage}"
                </blockquote>`
              : ''
          }

          <div style="background: #F4F6F8; border: 1px solid #DCE3EB; border-radius: 6px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0 0 6px; font-size: 14px; color: #4A5565;">Your one-time security code:</p>
            <p style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #14263C;">123456</p>
          </div>

          <div style="margin: 28px 0;">
            <a href="${inviteUrl}" style="display: inline-block; background: #0B5CAD; color: #FFFFFF; text-decoration: none; padding: 14px 28px; font-weight: 600; border-radius: 6px; font-size: 16px;">
              Open and Complete Application
            </a>
          </div>

          <p style="font-size: 14px; color: #64748B;">
            This link is valid for 14 days. If the button above does not work, copy and paste this URL into your browser:<br>
            <a href="${inviteUrl}" style="color: #0B5CAD; word-break: break-all;">${inviteUrl}</a>
          </p>

          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0 20px;" />

          <p style="font-size: 13px; color: #64748B; margin: 0;">
            Government of Canada Pension Centre · PO Box 9500, Matane QC G4W 0H3<br>
            Questions? Call 1-800-267-0325 (Mon–Fri 8:00 to 16:00 ET).
          </p>
        </div>
      </div>
    `;
  } else if (type === 'submitted') {
    subject = `Application Submitted: CAF Pension Application for ${memberName} (${refNumber})`;
    html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #14263C; line-height: 1.5;">
        <div style="background: #14263C; color: #FFFFFF; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700;">CAF Pension Centre</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #C9D6E6;">Online pension application · Canadian Armed Forces</p>
        </div>

        <div style="padding: 32px 24px; background: #FFFFFF; border: 1px solid #DCE3EB; border-top: none;">
          <div style="background: #1F6F4A; color: #FFFFFF; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <h2 style="margin: 0 0 6px; font-size: 20px;">Application Successfully Submitted</h2>
            <p style="margin: 0; font-size: 15px;">Reference: <strong>${refNumber}</strong></p>
          </div>

          <p style="font-size: 16px;">
            Hello ${guardianName || 'Guardian'},
          </p>
          <p style="font-size: 15px;">
            The pension application for <strong>${memberName}</strong> has been received by the Government of Canada Pension Centre.
          </p>

          <h3 style="font-size: 16px; margin: 24px 0 12px;">Next Steps Required by Mail</h3>
          <ol style="padding-left: 20px; font-size: 14px; color: #334155;">
            <li style="margin-bottom: 8px;">
              <strong>Mail your proof of authority:</strong> Send the original, a notarized copy, or certified true copy by courier to:
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px; margin: 6px 0; border-radius: 4px; font-family: monospace;">
                Government of Canada Pension Centre – Mail Facility<br>
                PO Box 9500, Matane QC G4W 0H3<br>
                (Write reference <strong>${refNumber}</strong> on the envelope)
              </div>
            </li>
            <li style="margin-bottom: 8px;">
              <strong>Verification:</strong> We will check your authority documents and verify the banking details provided.
            </li>
            <li>
              <strong>First Payment:</strong> First pension deposit is scheduled within 45 days of the release date upon document verification.
            </li>
          </ol>

          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0 20px;" />

          <p style="font-size: 13px; color: #64748B; margin: 0;">
            Government of Canada Pension Centre · 1-800-267-0325
          </p>
        </div>
      </div>
    `;
  } else {
    return res.status(400).json({ error: 'Invalid type parameter' });
  }

  // Check if SMTP is configured
  if (!host || !user || !pass) {
    console.log(`[SMTP SIMULATION] To: ${recipientEmail} | Subject: "${subject}"`);
    return res.status(200).json({
      success: true,
      simulated: true,
      message: 'SMTP credentials not configured. Email logged to server console in simulation mode.',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to: recipientEmail,
      subject,
      html,
    });

    return res.status(200).json({
      success: true,
      simulated: false,
      messageId: info.messageId,
    });
  } catch (err: any) {
    console.error('SMTP Error:', err);
    return res.status(500).json({
      error: 'Failed to send email via SMTP',
      details: err.message,
    });
  }
}
