// src/lib/email.js
let resendClient = null;

async function getResend() {
  if (!process.env.RESEND_API_KEY) {
    console.log('[email] RESEND_API_KEY missing. Skipping send.');
    return null;
  }
  if (resendClient) return resendClient;
  const { Resend } = await import('resend');
  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

/** Never throws. Returns { ok: boolean, id?, error? } */
export async function sendEmail({ to, subject, html, text }) {
  try {
    const resend = await getResend();
    if (!resend) return { ok: false, error: 'No RESEND_API_KEY' };

    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const res = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    console.log('[email] response:', res);
    if (res?.id) return { ok: true, id: res.id };
    return { ok: false, error: 'Resend returned no id' };
  } catch (e) {
    const msg = String(e?.message || e);
    console.log('[email] send failed:', msg, e?.response?.data || '');
    return { ok: false, error: msg };
  }
}
