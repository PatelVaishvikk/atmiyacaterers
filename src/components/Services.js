'use client'

import { servicesData } from '@/data/services'
import Image from 'next/image'

const CATERING_EMAIL = 'atmiyacaterers@gmail.com'
const WHATSAPP_NUMBER = '+1 (519) 992-7920'

const sanitisePhoneNumber = phone => phone.replace(/[^\d]/g, '')

const buildEmailLink = (subject, body) =>
  `mailto:${CATERING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

const buildWhatsappLink = (message) => {
  const digits = sanitisePhoneNumber(WHATSAPP_NUMBER)
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export default function Services() {
  const primaryMessage = 'Hi Atmiya Caterers,\nI am planning an event in ___ on ___ for ___ guests.\nPlease share curated Gujarati/Indian menu ideas, service styles, and pricing.\n\nThank you!'
  const globalEmailLink = buildEmailLink('Plan Catering with Atmiya', primaryMessage)
  const globalWhatsappLink = buildWhatsappLink(primaryMessage)
  const highlightLabels = servicesData
    .map(service => ({
      title: service.title,
      subtitle: service.ctaLabel ?? `Book ${service.title}`
    }))
    .slice(0, 6)

  return (
    <section className="section-padding bg-light">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer comprehensive catering solutions tailored to your unique needs and preferences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl focus-within:-translate-y-2 focus-within:shadow-2xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-within:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-serif font-semibold drop-shadow-md">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 p-6 md:p-8">
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span
                          className="mr-2 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden text-white md:pointer-events-none md:absolute md:inset-0 md:flex md:translate-y-full md:flex-col md:justify-between md:bg-secondary/95 md:p-8 md:transition-transform md:duration-300 md:ease-out md:group-hover:translate-y-0 md:group-hover:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:pointer-events-auto">
                  <div>
                    <h3 className="text-2xl font-serif font-semibold">
                      {service.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-white/90">
                      {service.description}
                    </p>
                  </div>
                  <div>
                    <ul className="mb-6 space-y-2 text-base">
                      {service.features.map((feature, idx) => (
                        <li key={`hover-${idx}`} className="flex items-center gap-3">
                          <span
                            className="inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-secondary via-accent to-primary p-8 text-white shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">Work With Atmiya</p>
              <h3 className="text-3xl font-serif font-semibold">
                Tell us once. We curate menus, staffing, rentals, and tasting sessions for every city we serve.
              </h3>
              <p className="text-white/90">
                Drop your guest count, dietary notes, and venue details—our catering desk replies within 24 hours on your preferred channel.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={globalEmailLink}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-secondary shadow-lg transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Email Our Catering Desk
                </a>
                <a
                  href={globalWhatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  WhatsApp {WHATSAPP_NUMBER}
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {highlightLabels.map(highlight => (
                <div key={highlight.title} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wide text-white/80">{highlight.title}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{highlight.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
