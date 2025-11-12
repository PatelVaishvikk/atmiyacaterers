'use client'

const serviceAreas = [
  {
    city: 'Windsor',
    headline: 'Best Caterers in Windsor',
    description:
      'Full-service Gujarati and Indian catering for Detroit Riverfront weddings, university events, and private pooja gatherings. We handle live chaat counters, premium thalis, and corporate buffets.'
  },
  {
    city: 'Toronto',
    headline: 'Toronto & GTA Gujarati Catering',
    description:
      'From downtown rooftop receptions to Mississauga convention centres, we deliver chef-led stations, upscale canapés, and sattvik-friendly menus tailored to your guest list.'
  },
  {
    city: 'Etobicoke',
    headline: 'Etobicoke Special Event Catering',
    description:
      'Popular with community halls and lakefront venues, our Etobicoke team curates multi-course Gujarati feasts, Jain-friendly menus, and interactive dessert bars.'
  },
  {
    city: 'London',
    headline: 'London, Ontario Celebrations',
    description:
      'Trusted by Western University groups and local wedding planners for vibrant Gujarati flavours, late-night snacks, and next-day brunch spreads.'
  },
  {
    city: 'Waterloo',
    headline: 'Waterloo & Kitchener Functions',
    description:
      'Serving tech offices, student galas, and traditional ceremonies with customizable buffet, plated, or live-station experiences.'
  }
]

export default function RegionalServiceAreas() {
  return (
    <section className="section-padding bg-white">
      <div className="container space-y-12">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Serving Southwestern Ontario & The GTA</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
            Gujarati & Indian Catering Across Windsor, Toronto, Etobicoke, London & Waterloo
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Wherever you need authentic Indian cuisine, our Atmiya chefs bring venue-ready staffing, rentals coordination,
            and flavour-packed menus that honour Gujarati traditions with modern presentation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceAreas.map(area => (
            <article key={area.city} className="rounded-2xl border border-gray-100 bg-light/60 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">{area.city}</p>
              <h3 className="mt-2 text-2xl font-serif font-semibold text-secondary">{area.headline}</h3>
              <p className="mt-4 text-gray-700 leading-relaxed">{area.description}</p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-secondary via-accent to-primary p-8 text-center text-white shadow-lg">
          <h3 className="text-2xl font-serif font-semibold">Need Indian or Gujarati Catering Anywhere in Ontario?</h3>
          <p className="mt-3 text-base md:text-lg text-white/90">
            Tell us your city, guest count, and dietary preferences—we will respond with a detailed proposal, sample menus,
            and delivery or on-site chef options within 24 hours.
          </p>
        </div>
      </div>
    </section>
  )
}
