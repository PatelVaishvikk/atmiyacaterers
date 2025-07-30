'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-bg.jpeg"
        alt="Fresh ingredients background"
        fill
        className="object-cover brightness-75"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>

      {/* Animated content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4"
      >
        {/* Huge logo at 200×200px */}
        <div className="mx-auto mb-6 w-[300px] h-[300px] relative">
          <Image
            src="/images/logo.png"
            alt="Atmiya Catering Logo"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg">
          Atmiya <span className="text-accent">Caterers</span>
          <br />Taste the Tradition, Feel the Devotion
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          From intimate gatherings to grand celebrations, we craft unforgettable culinary experiences that delight your guests and exceed expectations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu" className="btn-secondary text-lg px-10 py-4">
            View Menu
          </Link>
          <Link href="/contact" className="btn-primary text-lg px-10 py-4">
            Get Free Quote
          </Link>
        </div>
      </motion.div>

      {/* SVG wave divider */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-white">
          <path d="M0,0 C600,100 600,100 1200,0 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  )
}
