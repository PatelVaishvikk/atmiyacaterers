'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

const tiffinPlans = [
  {
    plan: "A Mini",
    category: "Light Meal",
    items: ["8 oz Sabji", "6 Roti", "OR (8 oz Dal + 8 oz Rice)"],
    dailyPrice: 7.99,
    monthlyExclWeekends: 178.99,
    monthlyInclWeekends: 238.99,
    popular: false,
    type: "A"
  },
  {
    plan: "A+",
    category: "Standard Meal",
    items: ["8 oz Sabji", "5 Roti", "8 oz Dal", "8 oz Rice"],
    dailyPrice: 9.99,
    monthlyExclWeekends: 198.99,
    monthlyInclWeekends: 278.99,
    popular: false,
    type: "A"
  },
  {
    plan: "A Pro",
    category: "Complete Meal",
    items: ["8 oz Sabji", "5 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)"],
    dailyPrice: 10.99,
    monthlyExclWeekends: 228.99,
    monthlyInclWeekends: 298.99,
    popular: true,
    type: "A"
  },
  {
    plan: "A Pro Max",
    category: "Premium Meal",
    items: ["8 oz Sabji", "7 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)", "Sweet", "Farsan"],
    dailyPrice: 13.99,
    monthlyExclWeekends: 298.99,
    monthlyInclWeekends: 398.99,
    popular: false,
    type: "A"
  },
  {
    plan: "AA Mini",
    category: "Large Light Meal",
    items: ["12 oz Sabji", "8 Roti"],
    dailyPrice: 9.49,
    monthlyExclWeekends: 198.99,
    monthlyInclWeekends: 278.99,
    popular: false,
    type: "AA"
  },
  {
    plan: "AA+",
    category: "Large Standard",
    items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice"],
    dailyPrice: 12.99,
    monthlyExclWeekends: 268.99,
    monthlyInclWeekends: 368.99,
    popular: false,
    type: "AA"
  },
  {
    plan: "AA Pro",
    category: "Large Complete",
    items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)"],
    dailyPrice: 13.99,
    monthlyExclWeekends: 298.99,
    monthlyInclWeekends: 398.99,
    popular: false,
    type: "AA"
  },
  {
    plan: "AA Pro Max",
    category: "Large Premium",
    items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)", "Sweet", "Farsan"],
    dailyPrice: 15.99,
    monthlyExclWeekends: 338.99,
    monthlyInclWeekends: 458.99,
    popular: false,
    type: "AA"
  }
]

export default function TiffinPlans() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredPlans = tiffinPlans.filter(plan => {
    if (activeFilter === 'all') return true
    return plan.type === activeFilter
  })

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Daily Tiffin Service Plans
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose a plan that fits your appetite and budget—all vegetarian, home-style meals delivered fresh.
          </p>
          
          {/* Filter Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeFilter === 'all'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                All Plans
              </button>
              <button
                onClick={() => setActiveFilter('A')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeFilter === 'A'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                A Series 8 oz
                <span className="block text-xs opacity-80">Regular Portions</span>
              </button>
              <button
                onClick={() => setActiveFilter('AA')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeFilter === 'AA'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                AA Series 12 oz
                <span className="block text-xs opacity-80">Large Portions</span>
              </button>
            </div>
          </div>

          {/* Portion Size Info */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>Portion Guide:</span>
              {activeFilter === 'A' && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  A Series: 8 oz portions
                </span>
              )}
              {activeFilter === 'AA' && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  AA Series: 12 oz portions
                </span>
              )}
              {activeFilter === 'all' && (
                <>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    A: 8 oz portions
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    AA: 12 oz portions
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mb-8">
            <span className="text-sm text-gray-500">Monthly pricing includes:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Weekdays Only
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Including Weekends
            </span>
          </div>
        </div>
        
        <motion.div 
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan.plan}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              className={`bg-white p-6 rounded-xl shadow-lg border-2 relative flex flex-col ${
                plan.type === 'A' 
                  ? 'border-blue-200 hover:border-blue-300' 
                  : 'border-purple-200 hover:border-purple-300'
              }`}
            >
              {/* Type Badge */}
              <div className="absolute -top-2 -right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                  plan.type === 'A' ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {plan.type} Series
                </span>
              </div>

              {plan.popular && (
                <div className="absolute -top-2 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {plan.plan}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{plan.category}</p>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    ${plan.dailyPrice.toFixed(2)}
                    <span className="text-lg font-normal text-gray-500">/day</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Monthly (weekdays):</span>
                      <span className="font-semibold text-blue-600">${plan.monthlyExclWeekends.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Monthly (all days):</span>
                      <span className="font-semibold text-green-600">${plan.monthlyInclWeekends.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-grow mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-center">What is Included:</h4>
                {plan.plan === "A Mini" ? (
                  <div className="text-gray-600 text-sm">
                    <ul className="space-y-2 mb-3">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">&#8226;</span>
                        <span>8 oz Sabji</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">&#8226;</span>
                        <span>6 Roti</span>
                      </li>
                    </ul>
                    <div className="text-center my-4">
                      <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold text-lg">
                        OR
                      </span>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">&#8226;</span>
                        <span>8 oz Dal</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">&#8226;</span>
                        <span>8 oz Rice</span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <ul className="text-gray-600 space-y-2 text-sm">
                    {plan.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">&#8226;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-3">
                <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.type === 'A'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}>
                  Choose Plan
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Fresh delivery • All vegetarian • Home-style cooking
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700 mb-2">Delivery Schedule:</p>
                <p>• Weekday plans: Monday to Friday</p>
                <p>• Full week plans: Monday to Sunday</p>
                <p>• Fresh meals prepared daily</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Service Area:</p>
                <p>• Windsor and surrounding areas</p>
                <p>• Contact us for custom requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}