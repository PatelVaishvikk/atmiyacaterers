'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomeGallery() {
  const [images, setImages] = useState([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' })
        const data = await res.json()
        if (mounted) setImages(data.images || [])
      } catch (e) {
        console.error('Home gallery fetch failed:', e)
      }
    })()
    return () => { mounted = false }
  }, [])

  const preview = images.slice(0, 6) // 👈 show only first 6

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="section-padding bg-gray-50"
    >
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">
            Gallery Highlights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A glimpse of our delicious dishes & memorable events
          </p>
        </div>

        {preview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {preview.map((item, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg shadow-md group">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/gallery"
            className="btn-primary inline-flex rounded-full px-8"
          >
            View Full Gallery →
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
