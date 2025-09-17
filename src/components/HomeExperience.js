export default function HomeExperience() {
  const highlights = [
    {
      title: 'Crafted flavours',
      description: 'Hand-ground masalas, seasonal produce, and heirloom recipes passed down through generations.',
    },
    {
      title: 'Immersive service',
      description: 'Hospitality ambassadors choreograph every course with white-glove precision and warmth.',
    },
    {
      title: 'Design-driven moments',
      description: 'Tablescapes, live studios, and storytelling stations that feel right out of a luxury magazine.',
    },
  ]

  const journey = [
    {
      step: 'Discover',
      detail: 'Start with our intelligent planner to map your occasion, guest count, and desired ambience.',
    },
    {
      step: 'Curate',
      detail: 'Handpick signature Gujarati dishes, fusion accents, and experience upgrades for wow moments.',
    },
    {
      step: 'Delight',
      detail: 'Relax while our culinary brigade executes flawless service, from setup to the final sweet bite.',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,53,0.08),_transparent_60%)]" aria-hidden="true" />
      <div className="relative container mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              The Atmiya Signature
            </span>
            <h2 className="font-serif text-4xl font-semibold text-secondary md:text-5xl">
              A celebration experience that feels bespoke from the first tasting to the final farewell.
            </h2>
            <p className="text-lg text-gray-600 md:text-xl">
              We orchestrate cuisine, design, and hospitality like theatre, curating immersive dining moments for Gujarati weddings, corporate galas, and everything in between.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {highlights.map(item => (
                <div key={item.title} className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-[0_20px_40px_-24px_rgba(44,62,80,0.35)]">
                  <h3 className="font-serif text-xl font-semibold text-secondary">{item.title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary/95 to-dark p-10 text-white shadow-2xl">
            <div className="absolute -right-16 top-1/3 h-40 w-40 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
            <div className="relative space-y-8">
              <h3 className="font-serif text-2xl font-semibold">Your Atmiya journey</h3>
              <ol className="space-y-6">
                {journey.map((item, index) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="mt-1 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/30 text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-white">{item.step}</p>
                      <p className="text-sm text-white/80">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="rounded-2xl bg-white/10 p-5 text-sm text-white/80">
                <p className="font-semibold text-white">Need ideas?</p>
                <p className="mt-1">
                  Explore curated menus, pricing, and experiences with our new planner, then reserve a tasting session with our culinary team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
