'use client'
import { dailyMenu } from '@/data/dailyMenu'
import { motion } from 'framer-motion'

export default function DailyMenu() {
  return (
    <section className="section-padding bg-light">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
          Today’s Tiffin Menu
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Order by <strong>4:00 PM</strong> yesterday to enjoy fresh, home-style meals delivered free!
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {dailyMenu.map((day) => (
            <motion.div
              key={day.date}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col"
            >
              {/* Date Header */}
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-primary">{day.day}</h3>
                <p className="text-gray-500">{day.date}</p>
              </div>

              {/* Menu Items */}
              <ul className="text-gray-700 mb-4 space-y-1 text-left">
                {day.menuItems.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>

              {/* Delivery & Pickup Info */}
              <div className="mb-4 text-gray-600 text-left space-y-1">
                <p><strong>Delivery:</strong> Free</p>
                <p><strong>Pickup:</strong> {day.pickupAddress}</p>
                <p><strong>Pickup Starts At:</strong> 7:00 PM</p>
                <p><strong>Cost: 9 CAD</strong> Same as delivery (Free)</p>
                <p><strong>Order Cutoff:</strong> {day.orderCutoff}</p>
              </div>

              {/* Daily Offer */}
              {day.dailyOffer && (
                <p className="mt-auto text-sm text-accent font-medium">
                  🎁 {day.dailyOffer}
                </p>
              )}

              {/* Order Button */}
              <button className="btn-primary mt-4">
                Order Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
