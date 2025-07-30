'use client'
import { tiffinPlans } from '@/data/tiffinPlans'
import { motion } from 'framer-motion'

export default function TiffinPlans() {
  return (
    <section className="section-padding bg-light">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
          Daily Tiffin Service Plans
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose a plan that fits your appetite and budget—all vegetarian, home-style meals delivered fresh.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {tiffinPlans.map((plan, idx) => (
            <motion.div
              key={plan.plan}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col"
            >
              <h3 className="text-2xl font-semibold text-secondary mb-2">
                {plan.plan}
              </h3>
              <p className="text-3xl font-bold text-primary mb-4">
                ${plan.price}/mo
              </p>
              <ul className="text-gray-700 mb-4 space-y-1 text-left">
                {plan.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
              <p className="mt-auto text-gray-600">
                Delivery: {plan.delivery}  
                {plan.deliveryCharge > 0 && ` (CAD ${plan.deliveryCharge} extra)`}
              </p>
              <button className="btn-primary mt-6">
                Subscribe
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
