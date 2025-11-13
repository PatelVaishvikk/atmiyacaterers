'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePlannerAvailability } from '@/hooks/usePlannerAvailability'
import { motion } from 'framer-motion'

export default function Hero() {
  const { enabled: plannerEnabled } = usePlannerAvailability()
  const cities = ['Windsor', 'Toronto', 'Etobicoke', 'London', 'Waterloo']
  const [cityIndex, setCityIndex] = useState(0)
  const [phase, setPhase] = useState('typing')
  const [displayedCity, setDisplayedCity] = useState('')
  const currentCity = cities[cityIndex]

  useEffect(() => {
    let timeout
    if (phase === 'typing') {
      timeout = setTimeout(() => {
        const nextText = currentCity.slice(0, displayedCity.length + 1)
        setDisplayedCity(nextText)
        if (nextText === currentCity) {
          setPhase('pausing')
        }
      }, 110)
    } else if (phase === 'deleting') {
      timeout = setTimeout(() => {
        const nextRemaining = currentCity.slice(0, Math.max(displayedCity.length - 1, 0))
        setDisplayedCity(nextRemaining)
        if (nextRemaining.length === 0) {
          setPhase('typing')
          setCityIndex((cityIndex + 1) % cities.length)
        }
      }, 60)
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 1300)
    }

    return () => clearTimeout(timeout)
  }, [phase, displayedCity, currentCity, cityIndex, cities.length])

  return (
    <section className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden pt-16 pb-12 sm:pt-20 md:h-[85vh] md:pt-6">
      <Image
        src="/images/hero-bg.jpeg"
        alt="Fresh ingredients background"
        fill
        className="object-cover brightness-75"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-4 text-center max-w-4xl"
      >
        <div className="relative mx-auto mb-2 h-44 w-44 sm:h-56 sm:w-56 md:h-[330px] md:w-[330px]">
          <Image
            src="/images/logo.png"
            alt="Atmiya Catering Logo"
            fill
            className="object-contain"
          />
          <div className="absolute inset-0 rounded-full border-4 border-white/40 blur-[1px]" aria-hidden="true" />
          <div className="absolute inset-2 rounded-full border border-accent/60 animate-pulse" aria-hidden="true" />
        </div>

        <div className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-white shadow-lg backdrop-blur sm:text-xs">
          <span role="img" aria-label="sparkles">✨</span> Taste the Tradition, Feel the Devotion <span role="img" aria-label="sparkles">✨</span>
        </div>

        <h1 className="mb-4 flex flex-col gap-3 font-serif font-bold text-white drop-shadow-lg">
          <span className="text-2xl leading-snug sm:text-3xl md:text-4xl">
            Best Indian & Gujarati Caterers in
          </span>
          <span
            className="text-3xl leading-tight text-accent sm:text-5xl md:text-7xl"
            aria-live="polite"
          >
            {displayedCity || '\u00A0'}
            <span className="ml-1 inline-block h-8 w-[2px] animate-pulse bg-white align-middle" aria-hidden="true" />
          </span>
        </h1>
        <p className="mx-auto mb-6 text-base text-gray-200 sm:text-lg md:text-xl">
          Atmiya Caterers blends Gujarati hospitality with chef-driven menus for weddings, corporate galas, garba nights, and intimate celebrations across Southwestern Ontario.
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/food-catalogue" className="btn-secondary w-full px-8 py-3 text-base sm:w-auto sm:px-10 sm:py-4 sm:text-lg">
            View Menu
          </Link>
          <Link
            href={plannerEnabled ? '/planner' : '/contact'}
            className="btn-primary w-full px-8 py-3 text-base sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
          >
            {plannerEnabled ? 'Plan Your Menu' : 'Get Free Quote'}
          </Link>
        </div>
      </motion.div>

      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-20 w-full fill-white">
          <path d="M0,0 C600,100 600,100 1200,0 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  )
}
