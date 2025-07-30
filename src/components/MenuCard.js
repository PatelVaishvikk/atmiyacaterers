
'use client'
import { menuData } from '@/data/menu'

export default function MenuCard() {
  return (
    <section className="section-padding bg-light">
      <div className="container text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-6">
          Our Menu
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Discover our range of pure-veg, home-style meals prepared with love. Our menu offers regional Indian cuisines including Gujarati, Punjabi, and South Indian.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {menuData.map((section, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-primary mb-4">{section.category}</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
