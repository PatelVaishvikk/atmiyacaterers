'use client'

import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 400) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  })

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 100 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end"
        >
          <Link
            href="https://wa.me/15199927920"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] transition-shadow"
          >
            <span className="font-semibold hidden sm:block">Chat on WhatsApp</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.09.592 2.328.905 4.03.905 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.768-5.766-5.768zm0 13C9.854 19.172 8.5 18.5 7.5 17.5l-4 1 1-4C3.5 13.5 3 12 3 9.5 3 5.358 6.358 2 10.5 2S18 5.358 18 9.5c0 4.142-3.358 7.5-7.5 7.5z" />
              <path d="M14.5 15.5c-.5 0-1.5-.5-2.5-1.5s-1.5-2-1.5-2.5 0-1 .5-1.5l.5-.5c.5-.5.5-1 .5-1.5 0-.5-.5-1-1-1.5l-1-1.5c-.5-.5-1-.5-1.5 0-.5.5-1 1-1.5 1.5-.5.5-1 1.5-1.5 2.5s.5 2.5 1.5 3.5 3 3 3.5 3.5 2 1.5 2.5 1.5 1.5-.5 1.5-1.5l-1.5-1z" />
            </svg>
          </Link>
          
          <Link
            href="/contact"
            className="group flex items-center gap-3 bg-secondary text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
             <span className="font-semibold">Get a Quote</span>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
               <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
             </svg>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
