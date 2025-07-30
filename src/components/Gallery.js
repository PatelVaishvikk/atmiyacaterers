'use client'
import { useState } from 'react'
import { galleryData } from '@/data/gallery'

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryData.map((item, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-square bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white text-6xl">{item.icon}</span>
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-serif font-bold text-secondary">{selectedImage.title}</h3>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="aspect-video bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded-lg mb-4">
                <span className="text-white text-8xl">{selectedImage.icon}</span>
              </div>
              <p className="text-gray-600">{selectedImage.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}