import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

const ensureArray = value => (Array.isArray(value) ? value : [])

const formatCurrency = value => {
  const numeric = Number(value) || 0
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(numeric)))
}

const resolveRecipient = () =>
  process.env.PLANNER_ENQUIRY_EMAIL ||
  process.env.CONTACT_EMAIL ||
  process.env.EMAIL_TO ||
  process.env.EMAIL_FROM

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid request payload' }, { status: 400 })
    }

    const {
      event,
      guestCount,
      eventDate,
      eventLocation,
      notes,
      perGuestEstimate,
      estimatedTotal,
      budgetRange = {},
      tierFilter,
      menuSelections = [],
    } = body

    const recipient = resolveRecipient()
    if (!recipient) {
      return NextResponse.json(
        { success: false, error: 'Planner enquiry email recipient not configured.' },
        { status: 500 },
      )
    }

    const rangeMin = budgetRange?.min ?? estimatedTotal
    const rangeMax = budgetRange?.max ?? estimatedTotal

    const menuLines = ensureArray(menuSelections)
      .map(group => {
        const dishes = ensureArray(group?.dishes)
          .map(
            dish =>
              `<li><strong>${dish?.name || 'Unnamed dish'}</strong> — ${formatCurrency(dish?.price)} (${dish?.tier || 'tier'})</li>`,
          )
          .join('')

        if (!dishes) {
          return ''
        }

        return `<h4 style="margin:16px 0 6px 0;font-size:14px;">${group?.categoryLabel || group?.categoryId}</h4><ul style="margin:0 0 12px 16px;padding:0;">${dishes}</ul>`
      })
      .filter(Boolean)
      .join('')

    const textMenuLines = ensureArray(menuSelections)
      .map(group => {
        const dishes = ensureArray(group?.dishes)
          .map(dish => `  - ${dish?.name || 'Unnamed dish'} | ${formatCurrency(dish?.price)} (${dish?.tier || 'tier'})`)
          .join('\n')
        if (!dishes) return ''
        return `${group?.categoryLabel || group?.categoryId}\n${dishes}`
      })
      .filter(Boolean)
      .join('\n\n')

    const html = `
      <h2 style="margin:0 0 16px 0;">New menu planner submission</h2>
      <p><strong>Event:</strong> ${event?.name || '—'}</p>
      <p><strong>Event type id:</strong> ${event?.id || '—'}</p>
      <p><strong>Guests:</strong> ${guestCount || '—'}</p>
      <p><strong>Preferred date:</strong> ${eventDate || '—'}</p>
      <p><strong>Location:</strong> ${eventLocation || '—'}</p>
      <p><strong>Tier focus:</strong> ${tierFilter || 'all'}</p>
      <p><strong>Per guest estimate:</strong> ${formatCurrency(perGuestEstimate)}</p>
      <p><strong>Total estimate:</strong> ${formatCurrency(estimatedTotal)} (range ${formatCurrency(rangeMin)} – ${formatCurrency(rangeMax)})</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
      <h3 style="margin:0 0 12px 0;">Selected dishes</h3>
      ${menuLines || '<p>No dishes selected.</p>'}
    `

    const text = [
      `New menu planner submission`,
      `Event: ${event?.name || '—'}`,
      `Event type id: ${event?.id || '—'}`,
      `Guests: ${guestCount || '—'}`,
      `Preferred date: ${eventDate || '—'}`,
      `Location: ${eventLocation || '—'}`,
      `Tier focus: ${tierFilter || 'all'}`,
      `Per guest estimate: ${formatCurrency(perGuestEstimate)}`,
      `Total estimate: ${formatCurrency(estimatedTotal)} (range ${formatCurrency(rangeMin)} – ${formatCurrency(rangeMax)})`,
      notes ? `Notes: ${notes}` : '',
      '',
      'Selected dishes:',
      textMenuLines || 'No dishes selected.',
    ]
      .filter(Boolean)
      .join('\n')

    const subject = `New planner enquiry${event?.name ? ` - ${event.name}` : ''}`

    const emailResult = await sendEmail({
      to: recipient,
      subject,
      html,
      text,
    })

    if (!emailResult.ok) {
      return NextResponse.json({ success: false, error: emailResult.error || 'Email send failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Planner submit error', error)
    return NextResponse.json({ success: false, error: 'Failed to submit planner enquiry' }, { status: 500 })
  }
}
