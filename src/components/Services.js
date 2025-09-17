'use client'

import { servicesData } from '@/data/services'
import Image from 'next/image'
import Link from 'next/link'
import { usePlannerAvailability } from '@/hooks/usePlannerAvailability'
import { useEffect, useRef, useState } from 'react'

export default function Services() {
  const cardRefs = useRef([])
  const [revealedCards, setRevealedCards] = useState(() =>
    servicesData.map(() => false)
  )

  const { enabled: plannerEnabled } = usePlannerAvailability()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const targets = cardRefs.current.filter(Boolean)

    if (!('IntersectionObserver' in window)) {
      setRevealedCards(servicesData.map(() => true))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index)
            setRevealedCards(prev => {
              if (prev[index]) return prev
              const updated = [...prev]
              updated[index] = true
              return updated
            })
          }
        })
      },
      { threshold: 0.35 }
    )

    targets.forEach(card => observer.observe(card))

    return () => {
      targets.forEach(card => observer.unobserve(card))
      observer.disconnect()
    }
  }, [])

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
            const isRevealed = revealedCards[index]

            return (
              <div
                key={index}
                ref={el => {
                  cardRefs.current[index] = el
                }}
                data-index={index}
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
                  <div
                    className={`md:hidden transition-all duration-500 ease-out ${
                      isRevealed
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0'
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary p-6 text-white shadow-xl">
                      <div className="absolute -right-10 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" aria-hidden="true" />
                      <div className="relative flex flex-col gap-4">
                        <div>
                          <h4 className="text-lg font-semibold uppercase tracking-wide text-white/90">
                            {plannerEnabled ? 'Build Your Menu' : 'Request A Quote'}
                          </h4>
                          <p className="text-sm text-white/80">
                            {plannerEnabled ? 'Share your guest count and craft a custom Gujarati feast in minutes.' : 'Tell us about your celebration and our team will shape a personalised plan.'}
                          </p>
                        </div>
                        <Link
                          href={plannerEnabled ? '/planner' : '/contact'}
                          className="inline-flex items-center justify-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur transition hover:bg-white/30"
                        >
                          {plannerEnabled ? 'Start Planning' : 'Request A Quote'}
                        </Link>
                      </div>
                    </div>
                  </div>
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
                    <Link
                      href={plannerEnabled ? '/planner' : '/contact'}
                      className="hidden md:inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {plannerEnabled ? 'Plan Your Event' : 'Request A Quote'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
