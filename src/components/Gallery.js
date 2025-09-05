'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' })
        const data = await res.json()
        if (mounted) setImages(data.images || [])
      } catch (e) {
        console.error('Gallery fetch failed:', e)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <section className="section-padding">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
            Our Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a look at some of our beautifully crafted dishes and memorable events
          </p>
        </div>

        {images.length === 0 ? (
          <p className="text-center text-gray-500">
            No images found. Add some to <code>/public/gallery</code>.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item, i) => (
              <button
                key={item.src}
                className="group relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                onClick={() => setSelected(item)}
                aria-label={`Open ${item.title}`}
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.src}
                    alt={item.title || 'Gallery image'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    className="object-cover"
                    priority={i < 6}
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center px-3">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-xs opacity-90">Tap to view</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-xl max-w-3xl w-full p-4 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-serif font-bold text-secondary">
                  {selected.title}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={selected.src}
                  alt={selected.title || 'Selected image'}
                  fill
                  sizes="100vw"
                  className="object-contain bg-black/5"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
