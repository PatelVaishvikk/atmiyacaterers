// src/emails/BookingConfirmation.js
export function bookingEmailHTML({ name, token, bookingDate, people }) {
  const dateStr = bookingDate ? new Date(bookingDate).toLocaleDateString() : '';
  const appUrl = process.env.APP_BASE_URL || '';
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:auto;padding:24px">
    <h2 style="margin:0 0 8px;color:#111">Your Booking is Confirmed 🎉</h2>
    <p style="margin:0 0 16px;color:#444">Hi ${name || 'Guest'}, thanks for booking with Atmiya Caterers.</p>

    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:16px 0;background:#fafafa">
      <p style="margin:0 0 8px;color:#111"><strong>Token:</strong>
        <span style="font-family:monospace;font-size:18px;background:#111;color:#fff;padding:4px 8px;border-radius:8px;margin-left:8px">${token}</span>
      </p>
      <p style="margin:8px 0;color:#111"><strong>Date:</strong> ${dateStr}</p>
      <p style="margin:8px 0;color:#111"><strong>People:</strong> ${people}</p>
    </div>

    <p style="margin:16px 0;color:#444">
      Bring your token <strong>${token}</strong> to the event check-in desk to collect your food.
    </p>

    <p style="margin:16px 0;color:#444">
      Book again: <a href="${appUrl}/garba-booking" style="color:#2563eb">Open booking page</a>
    </p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
    <p style="font-size:12px;color:#6b7280;margin:0">© ${new Date().getFullYear()} Atmiya Caterers</p>
  </div>`;
}

export function bookingEmailText({ name, token, bookingDate, people }) {
  const dateStr = bookingDate ? new Date(bookingDate).toLocaleDateString() : '';
  const appUrl = process.env.APP_BASE_URL || '';
  return `Your booking is confirmed

Hi ${name || 'Guest'},

Token: ${token}
Date: ${dateStr}
People: ${people}

Bring your token to collect your food.
Book again: ${appUrl}/garba-booking

© ${new Date().getFullYear()} Atmiya Caterers`;
}
