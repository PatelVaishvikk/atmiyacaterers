
"use client";
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
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    mealTime: 'lunch'
  })

  const filteredPlans = tiffinPlans.filter(plan => {
    if (activeFilter === 'all') return true
    return plan.type === activeFilter
  })

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    const message = `Hi! I'd like to order the ${selectedPlan.plan} plan.

*Customer Details:*
Name: ${formData.name}
Address: ${formData.address}
Phone: ${formData.phone}
Meal Time: ${formData.mealTime === 'lunch' ? 'Lunch' : 'Dinner'}

*Plan Details:*
Plan: ${selectedPlan.plan} (${selectedPlan.category})
Daily Price: $${selectedPlan.dailyPrice}
Monthly (Weekdays): $${selectedPlan.monthlyExclWeekends}
Monthly (All Days): $${selectedPlan.monthlyInclWeekends}

Please confirm my order. Thank you!`

    const whatsappUrl = `https://wa.me/15199927920?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    setShowModal(false)
    setFormData({ name: '', address: '', phone: '', mealTime: 'lunch' })
  }

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
                {plan.plan === "A Mini" ? (
                  <div className="text-gray-600 text-sm">
                    <ul className="space-y-2 mb-3">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span>8 oz Sabji</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
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
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span>8 oz Dal</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span>8 oz Rice</span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <ul className="text-gray-600 space-y-2 text-sm">
                    {plan.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleChoosePlan(plan)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.type === 'A'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Order {selectedPlan?.plan} Plan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your complete delivery address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Time *
                </label>
                <select
                  name="mealTime"
                  value={formData.mealTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Send WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// "use client"
// import { motion, AnimatePresence } from 'framer-motion'
// import { useState, useEffect } from 'react'
// import { Calendar, Clock, MapPin, Star, Heart, ShoppingCart, User, Phone, Mail, Utensils, CheckCircle, X, Plus, Minus, Sparkles } from 'lucide-react'

// const tiffinPlans = [
//   {
//     plan: "A Mini",
//     category: "Light Meal",
//     items: ["8 oz Sabji", "6 Roti", "OR (8 oz Dal + 8 oz Rice)"],
//     dailyPrice: 7.99,
//     monthlyExclWeekends: 178.99,
//     monthlyInclWeekends: 238.99,
//     popular: false,
//     type: "A",
//     calories: "450-500",
//     spiceLevel: 2,
//     prepTime: "25 min",
//     rating: 4.3,
//     reviews: 128,
//     tags: ["Vegetarian", "Light", "Quick"]
//   },
//   {
//     plan: "A+",
//     category: "Standard Meal",
//     items: ["8 oz Sabji", "5 Roti", "8 oz Dal", "8 oz Rice"],
//     dailyPrice: 9.99,
//     monthlyExclWeekends: 198.99,
//     monthlyInclWeekends: 278.99,
//     popular: false,
//     type: "A",
//     calories: "650-700",
//     spiceLevel: 3,
//     prepTime: "30 min",
//     rating: 4.5,
//     reviews: 256,
//     tags: ["Vegetarian", "Balanced", "Traditional"]
//   },
//   {
//     plan: "A Pro",
//     category: "Complete Meal",
//     items: ["8 oz Sabji", "5 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)"],
//     dailyPrice: 10.99,
//     monthlyExclWeekends: 228.99,
//     monthlyInclWeekends: 298.99,
//     popular: true,
//     type: "A",
//     calories: "750-800",
//     spiceLevel: 3,
//     prepTime: "35 min",
//     rating: 4.7,
//     reviews: 412,
//     tags: ["Vegetarian", "Complete", "Popular"]
//   },
//   {
//     plan: "A Pro Max",
//     category: "Premium Meal",
//     items: ["8 oz Sabji", "7 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)", "Sweet", "Farsan"],
//     dailyPrice: 13.99,
//     monthlyExclWeekends: 298.99,
//     monthlyInclWeekends: 398.99,
//     popular: false,
//     type: "A",
//     calories: "900-950",
//     spiceLevel: 4,
//     prepTime: "40 min",
//     rating: 4.8,
//     reviews: 189,
//     tags: ["Vegetarian", "Premium", "Feast"]
//   },
//   {
//     plan: "AA Mini",
//     category: "Large Light Meal",
//     items: ["12 oz Sabji", "8 Roti"],
//     dailyPrice: 9.49,
//     monthlyExclWeekends: 198.99,
//     monthlyInclWeekends: 278.99,
//     popular: false,
//     type: "AA",
//     calories: "600-650",
//     spiceLevel: 2,
//     prepTime: "30 min",
//     rating: 4.4,
//     reviews: 98,
//     tags: ["Vegetarian", "Large", "Simple"]
//   },
//   {
//     plan: "AA+",
//     category: "Large Standard",
//     items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice"],
//     dailyPrice: 12.99,
//     monthlyExclWeekends: 268.99,
//     monthlyInclWeekends: 368.99,
//     popular: false,
//     type: "AA",
//     calories: "850-900",
//     spiceLevel: 3,
//     prepTime: "35 min",
//     rating: 4.6,
//     reviews: 167,
//     tags: ["Vegetarian", "Large", "Hearty"]
//   },
//   {
//     plan: "AA Pro",
//     category: "Large Complete",
//     items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)"],
//     dailyPrice: 13.99,
//     monthlyExclWeekends: 298.99,
//     monthlyInclWeekends: 398.99,
//     popular: false,
//     type: "AA",
//     calories: "950-1000",
//     spiceLevel: 3,
//     prepTime: "40 min",
//     rating: 4.7,
//     reviews: 203,
//     tags: ["Vegetarian", "Large", "Complete"]
//   },
//   {
//     plan: "AA Pro Max",
//     category: "Large Premium",
//     items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)", "Sweet", "Farsan"],
//     dailyPrice: 15.99,
//     monthlyExclWeekends: 338.99,
//     monthlyInclWeekends: 458.99,
//     popular: false,
//     type: "AA",
//     calories: "1100-1150",
//     spiceLevel: 4,
//     prepTime: "45 min",
//     rating: 4.9,
//     reviews: 145,
//     tags: ["Vegetarian", "Large", "Luxury"]
//   }
// ]

// const menuRotation = {
//   Monday: ["Rajma", "Aloo Gobi", "Mixed Dal", "Jeera Rice"],
//   Tuesday: ["Paneer Butter Masala", "Bhindi Masala", "Chana Dal", "Plain Rice"],
//   Wednesday: ["Chole", "Baingan Bharta", "Moong Dal", "Pulao"],
//   Thursday: ["Kadhi Pakora", "Aloo Matar", "Masoor Dal", "Jeera Rice"],
//   Friday: ["Palak Paneer", "Karela Sabji", "Toor Dal", "Coconut Rice"],
//   Saturday: ["Special Thali", "Seasonal Vegetables", "Mixed Dal", "Biryani"],
//   Sunday: ["Chef's Special", "Stuffed Paratha", "Dal Makhani", "Special Rice"]
// }

// export default function TiffinPlans() {
//   const [activeFilter, setActiveFilter] = useState('all')
//   const [showModal, setShowModal] = useState(false)
//   const [selectedPlan, setSelectedPlan] = useState(null)
//   const [favorites, setFavorites] = useState(new Set())
//   const [cart, setCart] = useState([])
//   const [showCart, setShowCart] = useState(false)
//   const [currentTime, setCurrentTime] = useState(new Date())
//   const [showMenuPreview, setShowMenuPreview] = useState(false)
//   const [selectedDay, setSelectedDay] = useState('Monday')
//   const [notifications, setNotifications] = useState([])
//   const [formData, setFormData] = useState({
//     name: '',
//     address: '',
//     phone: '',
//     email: '',
//     mealTime: 'lunch',
//     startDate: '',
//     specialInstructions: '',
//     subscriptionType: 'monthly-weekdays'
//   })

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000)
//     return () => clearInterval(timer)
//   }, [])

//   const filteredPlans = tiffinPlans.filter(plan => {
//     if (activeFilter === 'all') return true
//     if (activeFilter === 'popular') return plan.popular || plan.rating >= 4.7
//     if (activeFilter === 'budget') return plan.dailyPrice < 11
//     if (activeFilter === 'premium') return plan.dailyPrice >= 13
//     return plan.type === activeFilter
//   })

//   const addNotification = (message, type = 'success') => {
//     const id = Date.now()
//     setNotifications(prev => [...prev, { id, message, type }])
//     setTimeout(() => {
//       setNotifications(prev => prev.filter(n => n.id !== id))
//     }, 3000)
//   }

//   const toggleFavorite = (plan) => {
//     setFavorites(prev => {
//       const newFavorites = new Set(prev)
//       if (newFavorites.has(plan.plan)) {
//         newFavorites.delete(plan.plan)
//         addNotification(`Removed ${plan.plan} from favorites`, 'info')
//       } else {
//         newFavorites.add(plan.plan)
//         addNotification(`Added ${plan.plan} to favorites`, 'success')
//       }
//       return newFavorites
//     })
//   }

//   const addToCart = (plan) => {
//     setCart(prev => {
//       const existing = prev.find(item => item.plan === plan.plan)
//       if (existing) {
//         addNotification(`Updated ${plan.plan} quantity`, 'info')
//         return prev.map(item => 
//           item.plan === plan.plan 
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         )
//       } else {
//         addNotification(`Added ${plan.plan} to cart`, 'success')
//         return [...prev, { ...plan, quantity: 1 }]
//       }
//     })
//   }

//   const removeFromCart = (planName) => {
//     setCart(prev => prev.filter(item => item.plan !== planName))
//     addNotification('Removed from cart', 'info')
//   }

//   const updateCartQuantity = (planName, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(planName)
//       return
//     }
//     setCart(prev => prev.map(item => 
//       item.plan === planName ? { ...item, quantity: newQuantity } : item
//     ))
//   }

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => {
//       const price = formData.subscriptionType === 'daily' 
//         ? item.dailyPrice 
//         : formData.subscriptionType === 'monthly-all'
//         ? item.monthlyInclWeekends
//         : item.monthlyExclWeekends
//       return total + (price * item.quantity)
//     }, 0)
//   }

//   const handleChoosePlan = (plan) => {
//     setSelectedPlan(plan)
//     setShowModal(true)
//   }

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = () => {
//     if (!formData.name || !formData.address || !formData.phone) {
//       addNotification('Please fill in all required fields', 'error')
//       return
//     }

//     const totalAmount = calculateTotal()
//     const cartItems = cart.length > 0 ? cart : [selectedPlan]
    
//     let message = `🍽️ New Tiffin Order Request\n\n`
//     message += `Customer Details:\n`
//     message += `Name: ${formData.name}\n`
//     message += `Address: ${formData.address}\n`
//     message += `Phone: ${formData.phone}\n`
//     message += `Email: ${formData.email || 'Not provided'}\n`
//     message += `Meal Time: ${formData.mealTime === 'lunch' ? 'Lunch' : 'Dinner'}\n`
//     message += `Start Date: ${formData.startDate || 'ASAP'}\n\n`

//     message += `Order Details:\n`
//     cartItems.forEach(item => {
//       const qty = item.quantity || 1
//       const price = formData.subscriptionType === 'daily' 
//         ? item.dailyPrice 
//         : formData.subscriptionType === 'monthly-all'
//         ? item.monthlyInclWeekends
//         : item.monthlyExclWeekends
//       message += `• ${item.plan} (${item.category}) x${qty}\n`
//       message += `  $${price.toFixed(2)} each\n`
//     })

//     message += `\nSubscription Type: ${
//       formData.subscriptionType === 'daily' ? 'Daily' :
//       formData.subscriptionType === 'monthly-all' ? 'Monthly (7 days)' :
//       'Monthly (5 days weekdays)'
//     }\n`
//     message += `Total Amount: $${totalAmount.toFixed(2)}\n\n`

//     if (formData.specialInstructions) {
//       message += `Special Instructions:\n${formData.specialInstructions}\n\n`
//     }

//     message += `Order Time: ${currentTime.toLocaleString()}\n\n`
//     message += `Please confirm this order. Thank you!`

//     const whatsappUrl = `https://wa.me/15199927929?text=${encodeURIComponent(message)}`
//     window.open(whatsappUrl, '_blank')
    
//     setShowModal(false)
//     setCart([])
//     setFormData({ 
//       name: '', 
//       address: '', 
//       phone: '', 
//       email: '', 
//       mealTime: 'lunch', 
//       startDate: '', 
//       specialInstructions: '',
//       subscriptionType: 'monthly-weekdays'
//     })
//     addNotification('Order sent successfully!', 'success')
//   }

//   const getSpiceIcons = (level) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <span key={i} className={`text-sm ${i < level ? 'text-red-500' : 'text-gray-300'}`}>🌶️</span>
//     ))
//   }

//   const getDeliveryStatus = () => {
//     const hour = currentTime.getHours()
//     if (hour >= 11 && hour <= 13) return { text: "Lunch delivery in progress", color: "bg-green-500", pulse: true }
//     if (hour >= 18 && hour <= 20) return { text: "Dinner delivery in progress", color: "bg-orange-500", pulse: true }
//     if (hour >= 6 && hour <= 10) return { text: "Preparing lunch orders", color: "bg-blue-500", pulse: false }
//     if (hour >= 14 && hour <= 17) return { text: "Preparing dinner orders", color: "bg-purple-500", pulse: false }
//     return { text: "Kitchen closed - Orders for tomorrow", color: "bg-gray-500", pulse: false }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div 
//           animate={{ rotate: 360 }}
//           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
//           className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full"
//         />
//         <motion.div 
//           animate={{ rotate: -360 }}
//           transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
//           className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full"
//         />
//       </div>

//       {/* Notifications */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         <AnimatePresence>
//           {notifications.map(notification => (
//             <motion.div
//               key={notification.id}
//               initial={{ opacity: 0, x: 100, scale: 0.8 }}
//               animate={{ opacity: 1, x: 0, scale: 1 }}
//               exit={{ opacity: 0, x: 100, scale: 0.8 }}
//               className={`p-3 rounded-lg shadow-lg text-white font-medium ${
//                 notification.type === 'success' ? 'bg-green-500' :
//                 notification.type === 'error' ? 'bg-red-500' :
//                 'bg-blue-500'
//               }`}
//             >
//               {notification.message}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       {/* Header with Live Status */}
//       <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-orange-200 shadow-sm">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Utensils className="w-6 h-6 text-orange-600" />
//                 <span className="font-bold text-xl text-gray-800">TiffinExpress</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className={`w-2 h-2 rounded-full ${getDeliveryStatus().color} ${getDeliveryStatus().pulse ? 'animate-pulse' : ''}`}></div>
//                 <span className="text-sm font-medium text-gray-600">{getDeliveryStatus().text}</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-sm text-gray-600">
//                 <Clock className="w-4 h-4 inline mr-1" />
//                 {currentTime.toLocaleTimeString()}
//               </div>
//               <button
//                 onClick={() => setShowCart(true)}
//                 className="relative p-2 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors"
//               >
//                 <ShoppingCart className="w-5 h-5 text-orange-600" />
//                 {cart.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {cart.reduce((sum, item) => sum + item.quantity, 0)}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <section className="py-16 relative">
//         <div className="container mx-auto px-4">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-12"
//           >
//             <motion.h2 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-4xl md:text-6xl font-serif font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4"
//             >
//               Daily Tiffin Service
//             </motion.h2>
//             <motion.p 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
//             >
//               Authentic home-style vegetarian meals crafted with love, delivered fresh to your doorstep daily.
//             </motion.p>
            
//             {/* Enhanced Filter Tabs */}
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="flex flex-wrap justify-center mb-6 gap-2"
//             >
//               <div className="bg-white/80 backdrop-blur-md rounded-xl p-2 shadow-lg">
//                 {[
//                   { key: 'all', label: 'All Plans', icon: '🍽️' },
//                   { key: 'popular', label: 'Popular', icon: '⭐' },
//                   { key: 'budget', label: 'Budget', icon: '💰' },
//                   { key: 'A', label: 'Regular', icon: '🥗' },
//                   { key: 'AA', label: 'Large', icon: '🍛' },
//                   { key: 'premium', label: 'Premium', icon: '👑' }
//                 ].map(filter => (
//                   <button
//                     key={filter.key}
//                     onClick={() => setActiveFilter(filter.key)}
//                     className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
//                       activeFilter === filter.key
//                         ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105'
//                         : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
//                     }`}
//                   >
//                     <span>{filter.icon}</span>
//                     <span className="hidden sm:inline">{filter.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Menu Preview Button */}
//             <motion.button
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.4 }}
//               onClick={() => setShowMenuPreview(true)}
//               className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
//             >
//               <Calendar className="w-5 h-5" />
//               View This Weeks Menu
//               <Sparkles className="w-5 h-5" />
//             </motion.button>
//           </motion.div>
          
//           <motion.div 
//             layout
//             className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//           >
//             <AnimatePresence>
//               {filteredPlans.map((plan, index) => (
//                 <motion.div
//                   key={plan.plan}
//                   layout
//                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9, y: -20 }}
//                   transition={{ delay: index * 0.1, duration: 0.3 }}
//                   whileHover={{ scale: 1.02, y: -8 }}
//                   className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border-2 relative overflow-hidden group ${
//                     plan.type === 'A' 
//                       ? 'border-blue-200 hover:border-blue-400' 
//                       : 'border-purple-200 hover:border-purple-400'
//                   }`}
//                 >
//                   {/* Type Badge */}
//                   <div className="absolute top-3 left-3 z-10">
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
//                       plan.type === 'A' ? 'bg-blue-500' : 'bg-purple-500'
//                     }`}>
//                       {plan.type} Series
//                     </span>
//                   </div>
                  
//                   {plan.popular && (
//                     <div className="absolute top-3 right-3 z-10">
//                       <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
//                         🔥 Popular
//                       </span>
//                     </div>
//                   )}
                  
//                   {/* Favorite Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       toggleFavorite(plan)
//                     }}
//                     className="absolute top-16 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
//                   >
//                     <Heart className={`w-5 h-5 ${favorites.has(plan.plan) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
//                   </button>

//                   <div className="p-6">
//                     <div className="text-center mb-4">
//                       <h3 className="text-2xl font-bold text-gray-800 mb-1">
//                         {plan.plan}
//                       </h3>
//                       <p className="text-sm text-gray-500 mb-2">{plan.category}</p>
                      
//                       {/* Rating and Reviews */}
//                       <div className="flex items-center justify-center gap-2 mb-3">
//                         <div className="flex items-center">
//                           <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                           <span className="ml-1 text-sm font-medium">{plan.rating}</span>
//                         </div>
//                         <span className="text-gray-300">•</span>
//                         <span className="text-sm text-gray-600">{plan.reviews} reviews</span>
//                       </div>

//                       {/* Tags */}
//                       <div className="flex flex-wrap gap-1 justify-center mb-3">
//                         {plan.tags.map(tag => (
//                           <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                             {tag}
//                           </span>
//                         ))}
//                       </div>

//                       {/* Meal Info */}
//                       <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-4">
//                         <div className="text-center">
//                           <div className="font-medium">Calories</div>
//                           <div>{plan.calories}</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="font-medium">Spice Level</div>
//                           <div className="flex justify-center">{getSpiceIcons(plan.spiceLevel)}</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="font-medium">Prep Time</div>
//                           <div>{plan.prepTime}</div>
//                         </div>
//                       </div>
                      
//                       <div className="mb-4">
//                         <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-2">
//                           ${plan.dailyPrice.toFixed(2)}
//                           <span className="text-lg font-normal text-gray-500">/day</span>
//                         </div>
//                         <div className="space-y-1">
//                           <div className="flex justify-between items-center text-sm">
//                             <span className="text-gray-600">Monthly (5 days):</span>
//                             <span className="font-semibold text-blue-600">${plan.monthlyExclWeekends}</span>
//                           </div>
//                           <div className="flex justify-between items-center text-sm">
//                             <span className="text-gray-600">Monthly (7 days):</span>
//                             <span className="font-semibold text-green-600">${plan.monthlyInclWeekends}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mb-6">
//                       <h4 className="font-semibold text-gray-700 mb-3 text-center">What iss Included:</h4>
//                       {plan.plan === "A Mini" ? (
//                         <div className="text-gray-600 text-sm">
//                           <ul className="space-y-2 mb-3">
//                             <li className="flex items-start">
//                               <span className="text-orange-500 mr-2 mt-1">•</span>
//                               <span>8 oz Sabji</span>
//                             </li>
//                             <li className="flex items-start">
//                               <span className="text-orange-500 mr-2 mt-1">•</span>
//                               <span>6 Roti</span>
//                             </li>
//                           </ul>
//                           <div className="text-center my-4">
//                             <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold text-lg">
//                               OR
//                             </span>
//                           </div>
//                           <ul className="space-y-2">
//                             <li className="flex items-start">
//                               <span className="text-orange-500 mr-2 mt-1">•</span>
//                               <span>8 oz Dal</span>
//                             </li>
//                             <li className="flex items-start">
//                               <span className="text-orange-500 mr-2 mt-1">•</span>
//                               <span>8 oz Rice</span>
//                             </li>
//                           </ul>
//                         </div>
//                       ) : (
//                         <ul className="text-gray-600 space-y-2 text-sm">
//                           {plan.items.map((item, i) => (
//                             <li key={i} className="flex items-start">
//                               <span className="text-orange-500 mr-2 mt-1">•</span>
//                               <span>{item}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>

//                     <div className="space-y-3">
//                       <div className="flex gap-2">
//                         <button 
//                           onClick={() => addToCart(plan)}
//                           className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
//                         >
//                           <Plus className="w-4 h-4" />
//                           Cart
//                         </button>
//                         <button 
//                           onClick={() => handleChoosePlan(plan)}
//                           className={`flex-2 py-2 px-4 rounded-lg font-semibold transition-colors text-white ${
//                             plan.type === 'A'? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
//               : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
//           }`}
//                         >
//                           Order Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </motion.div>
//         </div>
//       </section>

//       {/* Cart Modal */}
//       <AnimatePresence>
//         {showCart && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowCart(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
//             >
//               <div className="p-6 border-b">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                     <ShoppingCart className="w-5 h-5" />
//                     Your Cart
//                   </h3>
//                   <button
//                     onClick={() => setShowCart(false)}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto max-h-96">
//                 {cart.length === 0 ? (
//                   <div className="text-center py-8">
//                     <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                     <p className="text-gray-500">Your cart is empty</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {cart.map(item => (
//                       <div key={item.plan} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//                         <div className="flex-1">
//                           <h4 className="font-semibold">{item.plan}</h4>
//                           <p className="text-sm text-gray-600">{item.category}</p>
//                           <div className="flex items-center gap-4 mt-2">
//                             <span className="font-semibold text-orange-600">
//                               ${(formData.subscriptionType === 'daily' 
//                                 ? item.dailyPrice 
//                                 : formData.subscriptionType === 'monthly-all'
//                                 ? item.monthlyInclWeekends
//                                 : item.monthlyExclWeekends
//                               ).toFixed(2)}
//                             </span>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => updateCartQuantity(item.plan, item.quantity - 1)}
//                                 className="p-1 hover:bg-gray-200 rounded"
//                               >
//                                 <Minus className="w-4 h-4" />
//                               </button>
//                               <span className="w-8 text-center">{item.quantity}</span>
//                               <button
//                                 onClick={() => updateCartQuantity(item.plan, item.quantity + 1)}
//                                 className="p-1 hover:bg-gray-200 rounded"
//                               >
//                                 <Plus className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => removeFromCart(item.plan)}
//                           className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {cart.length > 0 && (
//                 <div className="p-6 border-t bg-gray-50">
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="font-semibold">Total:</span>
//                     <span className="text-xl font-bold text-orange-600">
//                       ${calculateTotal().toFixed(2)}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowCart(false)
//                       setShowModal(true)
//                     }}
//                     className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors"
//                   >
//                     Checkout
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Menu Preview Modal */}
//       <AnimatePresence>
//         {showMenuPreview && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowMenuPreview(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
//             >
//               <div className="p-6 border-b">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                     <Calendar className="w-6 h-6" />
//                     This Weeks Menu
//                   </h3>
//                   <button
//                     onClick={() => setShowMenuPreview(false)}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <div className="flex gap-2 mt-4 flex-wrap">
//                   {Object.keys(menuRotation).map(day => (
//                     <button
//                       key={day}
//                       onClick={() => setSelectedDay(day)}
//                       className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                         selectedDay === day
//                           ? 'bg-orange-500 text-white'
//                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                       }`}
//                     >
//                       {day}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto">
//                 <div className="text-center mb-6">
//                   <h4 className="text-xl font-semibold text-gray-800 mb-2">{selectedDay}s Special Menu</h4>
//                   <p className="text-gray-600">Fresh ingredients, traditional recipes, made with love</p>
//                 </div>
                
//                 <div className="grid gap-4 md:grid-cols-2">
//                   {menuRotation[selectedDay].map((dish, index) => (
//                     <motion.div
//                       key={dish}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
//                           {index + 1}
//                         </div>
//                         <div>
//                           <h5 className="font-semibold text-gray-800">{dish}</h5>
//                           <p className="text-sm text-gray-600">
//                             {index === 0 ? 'Main Curry' : 
//                              index === 1 ? 'Vegetable Side' : 
//                              index === 2 ? 'Dal (Lentils)' : 
//                              'Rice Preparation'}
//                           </p>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                   <h5 className="font-semibold text-blue-800 mb-2">📝 Menu Notes:</h5>
//                   <ul className="text-sm text-blue-700 space-y-1">
//                     <li>• Menu items may vary based on seasonal availability</li>
//                     <li>• All meals are freshly prepared daily</li>
//                     <li>• Special dietary requirements can be accommodated</li>
//                     <li>• Weekend specials include additional premium items</li>
//                   </ul>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Order Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
//             >
//               <div className="p-6 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-2xl font-bold flex items-center gap-2">
//                       <Utensils className="w-6 h-6" />
//                       Order Your Tiffin
//                     </h3>
//                     <p className="text-orange-100 mt-1">Fill in your details to place your order</p>
//                   </div>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
//                 {/* Order Summary */}
//                 <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                   <h4 className="font-semibold mb-3">Order Summary</h4>
//                   {cart.length > 0 ? (
//                     <div className="space-y-2">
//                       {cart.map(item => (
//                         <div key={item.plan} className="flex justify-between items-center">
//                           <span>{item.plan} x{item.quantity}</span>
//                           <span className="font-semibold text-orange-600">
//                             ${(formData.subscriptionType === 'daily' 
//                               ? item.dailyPrice * item.quantity
//                               : formData.subscriptionType === 'monthly-all'
//                               ? item.monthlyInclWeekends * item.quantity
//                               : item.monthlyExclWeekends * item.quantity
//                             ).toFixed(2)}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   ) : selectedPlan ? (
//                     <div className="flex justify-between items-center">
//                       <span>{selectedPlan.plan}</span>
//                       <span className="font-semibold text-orange-600">
//                         ${(formData.subscriptionType === 'daily' 
//                           ? selectedPlan.dailyPrice
//                           : formData.subscriptionType === 'monthly-all'
//                           ? selectedPlan.monthlyInclWeekends
//                           : selectedPlan.monthlyExclWeekends
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                   ) : null}
//                   <div className="border-t mt-3 pt-3 flex justify-between font-bold">
//                     <span>Total:</span>
//                     <span className="text-orange-600">${calculateTotal().toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Subscription Type */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Subscription Type *
//                     </label>
//                     <select
//                       name="subscriptionType"
//                       value={formData.subscriptionType}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     >
//                       <option value="daily">Daily Order</option>
//                       <option value="monthly-weekdays">Monthly (Weekdays Only)</option>
//                       <option value="monthly-all">Monthly (All 7 Days)</option>
//                     </select>
//                   </div>

//                   {/* Customer Details */}
//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <User className="w-4 h-4 inline mr-1" />
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         placeholder="Enter your full name"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Phone className="w-4 h-4 inline mr-1" />
//                         Phone Number *
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         placeholder="Enter your phone number"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <Mail className="w-4 h-4 inline mr-1" />
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       placeholder="Enter your email (optional)"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <MapPin className="w-4 h-4 inline mr-1" />
//                       Delivery Address *
//                     </label>
//                     <textarea
//                       name="address"
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       rows={3}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       placeholder="Enter complete delivery address with landmarks"
//                       required
//                     />
//                   </div>

//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Clock className="w-4 h-4 inline mr-1" />
//                         Preferred Meal Time
//                       </label>
//                       <select
//                         name="mealTime"
//                         value={formData.mealTime}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       >
//                         <option value="lunch">Lunch (11:30 AM - 1:00 PM)</option>
//                         <option value="dinner">Dinner (6:30 PM - 8:00 PM)</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Calendar className="w-4 h-4 inline mr-1" />
//                         Start Date
//                       </label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={formData.startDate}
//                         onChange={handleInputChange}
//                         min={new Date().toISOString().split('T')[0]}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Special Instructions
//                     </label>
//                     <textarea
//                       name="specialInstructions"
//                       value={formData.specialInstructions}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       placeholder="Any dietary restrictions, spice preferences, or delivery instructions..."
//                     />
//                   </div>

//                   {/* Payment Info */}
//                   <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                     <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
//                       <CheckCircle className="w-5 h-5" />
//                       Payment Information
//                     </h4>
//                     <p className="text-sm text-blue-700">
//                       Payment can be made via cash on delivery, e-transfer, or monthly subscription setup. 
//                       Our team will contact you to confirm payment method and delivery schedule.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6 border-t bg-gray-50">
//                 <div className="flex gap-4">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSubmit}
//                     className="flex-2 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <Utensils className="w-5 h-5" />
//                     Place Order via WhatsApp
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white py-12 relative">
//         <div className="container mx-auto px-4">
//           <div className="grid gap-8 md:grid-cols-3">
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <Utensils className="w-6 h-6 text-orange-400" />
//                 <span className="font-bold text-xl">TiffinExpress</span>
//               </div>
//               <p className="text-gray-300 mb-4">
//                 Bringing authentic home-style vegetarian meals to your doorstep. 
//                 Fresh, healthy, and made with love daily.
//               </p>
//               <div className="flex gap-2">
//                 <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
//                   100% Vegetarian
//                 </span>
//                 <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
//                   Daily Fresh
//                 </span>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
//               <div className="space-y-3 text-gray-300">
//                 <div className="flex items-center gap-2">
//                   <Phone className="w-4 h-4" />
//                   <span>(519) 992-7929</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Mail className="w-4 h-4" />
//                   <span>orders@tiffinexpress.ca</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <MapPin className="w-4 h-4" />
//                   <span>Windsor, ON, Canada</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4" />
//                   <span>Daily: 8:00 AM - 8:00 PM</span>
//                 </div>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-lg mb-4">Service Hours</h3>
//               <div className="space-y-2 text-gray-300">
//                 <div className="flex justify-between">
//                   <span>Lunch Delivery:</span>
//                   <span>11:30 AM - 1:00 PM</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Dinner Delivery:</span>
//                   <span>6:30 PM - 8:00 PM</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Order Cutoff:</span>
//                   <span>11:00 PM (Previous Day)</span>
//                 </div>
//                 <div className="mt-4 p-3 bg-gray-700 rounded-lg">
//                   <p className="text-sm">
//                     <strong>Emergency Orders:</strong> Call directly for same-day orders 
//                     (subject to availability)
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
//             <p>&copy; 2024 TiffinExpress. All rights reserved. Made with ❤️ for food lovers.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }