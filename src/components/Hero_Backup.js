'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePlannerAvailability } from '@/hooks/usePlannerAvailability'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Hero() {
  const { enabled: plannerEnabled } = usePlannerAvailability()
  
  // Typewriter effect state
  const locations = [
    "Windsor",
    "London", 
    "Waterloo",
    "Toronto",
    "Etobicoke", 
    "Brampton",
    "Mississauga"
  ]

  return (
    <section 
      aria-labelledby="hero-heading" 
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6"
    >
      
      {/* 1. Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpeg"
          alt="Authentic Indian Food Spread"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" /> {/* Dark Overlay */}
        {/* Bottom Gradient for smooth transition to wood */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center h-full pt-0 pb-10">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-60 h-60 sm:w-80 sm:h-80 -mb-6 drop-shadow-2xl"
        >
          <Image
            src="/images/logo.png"
            alt="Atmiya Caterers Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Gujarati Quote */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center font-gujarati text-2xl sm:text-3xl md:text-4xl leading-relaxed px-6 py-4 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
        >
          <div className="text-slate-200">“ભાવે તો સહુ ને કહેજો,</div>
          <div className="text-amber-500 mt-1">ના ભાવે તો અમને કહેજો”</div>
        </motion.div>

        {/* Tagline */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
        >
            <span className="text-amber-500 text-sm">➔</span>
            <span className="text-white/90 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
                Taste the Tradition, Feel the Devotion
            </span>
            <span className="text-amber-500 text-sm">➔</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg"
        >
          Best Indian & Gujarati Caterers in
          <div className="h-16 sm:h-20 mt-2 flex items-center justify-center text-amber-500 min-w-[300px]">
             {/* Typewriter Effect */}
             <Typewriter words={locations} />
          </div>
        </motion.h1>



        {/* Action Buttons - Moved Up & Anchored */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center"
        >
          <Link 
            href="/food-catalogue" 
            className="min-w-[170px] px-8 py-3.5 bg-slate-800 text-white rounded-full font-semibold text-lg hover:bg-slate-700 transition-colors border border-slate-600 shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(93,93,93,0.23)] hover:scale-105 transform duration-200"
          >
            View Menu
          </Link>
          <Link
            href="/contact"
            className="min-w-[170px] px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:scale-105 transform duration-200"
          >
            Get Free Quote
          </Link>
        </motion.div>

      </div>


    </section>
  )
}

// Robust Typewriter Component
// Robust Typewriter Component with Delete Effect
function Typewriter({ words }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0);
      return;
    }

    const currentWord = words[index];

    if (subIndex === currentWord.length + 1 && !reverse) {
      // Finished typing word, wait before deleting
      const timeout = setTimeout(() => {
        setReverse(true);
      }, 1500); // Wait 1.5s before deleting
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      // Finished deleting, move to next word
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150); // Typing speed: 150ms, Deleting speed: 75ms

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="inline-block relative min-w-[10px]">
      {words[index].substring(0, subIndex)}
      <span className={`text-amber-500 ${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
    </span>
  );
}

