'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePlannerAvailability } from '@/hooks/usePlannerAvailability'
import { motion } from 'framer-motion'

export default function Hero() {
  const { enabled: plannerEnabled } = usePlannerAvailability()

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
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
        className="relative z-10 px-4 text-center"
      >
        <div className="relative mx-auto mb-6 h-[300px] w-[300px]">
          <Image
            src="/images/logo.png"
            alt="Atmiya Catering Logo"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="mb-6 text-4xl font-serif font-bold text-white drop-shadow-lg sm:text-5xl md:text-7xl">
          Atmiya <span className="text-accent">Caterers</span>
          <br />Taste the Tradition, Feel the Devotion
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-gray-200 sm:text-lg md:text-xl">
          From intimate gatherings to grand celebrations, we craft unforgettable culinary moments that delight your guests and honour Gujarati hospitality.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/menu" className="btn-secondary px-10 py-4 text-lg">
            View Menu
          </Link>
          <Link href={plannerEnabled ? '/planner' : '/contact'} className="btn-primary px-10 py-4 text-lg">
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
