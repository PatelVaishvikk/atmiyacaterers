'use client'

import { useMemo } from 'react'

const faqs = [
  {
    question: 'Which cities do you cater to?',
    answer:
      'We regularly serve events across Windsor-Essex, the Greater Toronto Area (Toronto, Mississauga, Brampton, Etobicoke), London, Waterloo Region, and most of Southwestern Ontario. Travel outside these hubs is available on request.'
  },
  {
    question: 'Do you offer Jain, Swaminarayan, vegan, or allergy-friendly menus?',
    answer:
      'Yes. Our chefs prepare separate prep lines for Jain, Swaminarayan, vegan, gluten-free, and nut-free menus. Share your guest list and dietary matrix and we will map safe dishes plus special labelling.'
  },
  {
    question: 'How early should we book Atmiya Caterers?',
    answer:
      'Booking at least one month before your event gives us enough time to secure chefs, tastings, and logistics. For peak wedding or festival weekends we still recommend reaching out sooner if you can, but we regularly confirm celebrations 4 weeks out.'
  },
  {
    question: 'Do you help arrange décor, rentals, and on-site staffing?',
    answer:
      'Absolutely. Our team can coordinate mandap décor partners, buffet styling, live counters, servers, bartenders, and rental logistics so you only deal with one point of contact.'
  },
  {
    question: 'How do we get a proposal or tasting?',
    answer:
      'Share your event date, guest count, and city via email (atmiyacaterers@gmail.com) or WhatsApp (+1 519-992-7920). We will respond within 24 hours with a curated menu shortlist and tasting options.'
  }
]

export default function FAQSection() {
  const faqJsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }),
    []
  )

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">FAQs</p>
          <h2 className="mt-3 text-4xl font-serif font-bold text-secondary">Questions planners ask us the most</h2>
          <p className="mt-4 text-lg text-gray-600">
            Transparent answers about travel, dietary needs, staffing, tastings, and planning timelines so you can book with confidence.
          </p>
        </div>
        <div className="mx-auto max-w-4xl divide-y divide-gray-200 rounded-2xl border border-gray-100 bg-light/60 shadow-sm">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="group" open={index === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="text-lg font-semibold text-secondary">{faq.question}</span>
                <span className="text-secondary transition group-open:rotate-45">＋</span>
              </summary>
              <div className="px-6 pb-6 text-gray-700 leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
    </section>
  )
}
