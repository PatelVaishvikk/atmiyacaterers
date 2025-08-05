'use client'
import { motion } from 'framer-motion'

const tiffinPlans = [
  {
    plan: "A Mini",
    category: "Light Meal",
    items: ["6 oz Sabji", "6 Roti"],
    dailyPrice: 7.00,
    monthlyExclWeekends: 159.00,
    monthlyInclWeekends: 219.00,
    popular: false
  },
  {
    plan: "A+",
    category: "Standard Meal",
    items: ["8 oz Sabji", "5 Roti", "8 oz Dal", "8 oz Rice"],
    dailyPrice: 10.00,
    monthlyExclWeekends: 199.00,
    monthlyInclWeekends: 279.00,
    popular: false
  },
  {
    plan: "A Pro",
    category: "Complete Meal",
    items: ["8 oz Sabji", "5 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)"],
    dailyPrice: 11.00,
    monthlyExclWeekends: 229.00,
    monthlyInclWeekends: 299.00,
    popular: true
  },
  {
    plan: "A Pro Max",
    category: "Premium Meal",
    items: ["8 oz Sabji", "7 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)", "Sweet", "Farsan"],
    dailyPrice: 14.00,
    monthlyExclWeekends: 299.00,
    monthlyInclWeekends: 399.00,
    popular: false
  },
  {
    plan: "AA Mini",
    category: "Large Light Meal",
    items: ["12 oz Sabji", "8 Roti"],
    dailyPrice: 9.00,
    monthlyExclWeekends: 199.00,
    monthlyInclWeekends: 279.00,
    popular: false
  },
  {
    plan: "AA+",
    category: "Large Standard",
    items: ["12 oz Sabji", "6 Roti", "12 oz Dal", "12 oz Rice"],
    dailyPrice: 13.00,
    monthlyExclWeekends: 269.00,
    monthlyInclWeekends: 369.00,
    popular: false
  },
  {
    plan: "AA Pro",
    category: "Large Complete",
    items: ["12 oz Sabji", "6 Roti", "12 oz Dal", "12 oz Rice", "Raitu/Papad/Salad (Any Two)"],
    dailyPrice: 14.00,
    monthlyExclWeekends: 299.00,
    monthlyInclWeekends: 399.00,
    popular: false
  },
  {
    plan: "AA Pro Max",
    category: "Large Premium",
    items: ["12 oz Sabji", "6 Roti", "12 oz Dal", "12 oz Rice", "Raitu/Papad/Salad (Any Two)", "Sweet", "Farsan"],
    dailyPrice: 16.00,
    monthlyExclWeekends: 339.00,
    monthlyInclWeekends: 459.00,
    popular: false
  }
]

export default function TiffinPlans() {
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
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiffinPlans.map((plan) => (
            <motion.div
              key={plan.plan}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100 relative flex flex-col"
            >
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {plan.plan}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{plan.category}</p>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    ${plan.dailyPrice}
                    <span className="text-lg font-normal text-gray-500">/day</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Monthly (weekdays):</span>
                      <span className="font-semibold text-blue-600">${plan.monthlyExclWeekends}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Monthly (all days):</span>
                      <span className="font-semibold text-green-600">${plan.monthlyInclWeekends}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-grow mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-center">What is Included:</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">&#8226;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 px-4 rounded-lg font-semibold transition-colors bg-gray-800 hover:bg-gray-700 text-white">
                  Choose Plan
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Fresh delivery &bull; All vegetarian &bull; Home-style cooking
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700 mb-2">Delivery Schedule:</p>
                <p>&bull; Weekday plans: Monday to Friday</p>
                <p>&bull; Full week plans: Monday to Sunday</p>
                <p>&bull; Fresh meals prepared daily</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Service Area:</p>
                <p>&bull; Windsor and surrounding areas</p>
                {/* <p>&bull; Free delivery for monthly subscriptions</p> */}
                <p>&bull; Contact us for custom requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
