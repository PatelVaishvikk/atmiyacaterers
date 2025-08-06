'use client'

import { dailyMenu } from '@/data/dailyMenu'
import { motion } from 'framer-motion'

export default function DailyMenu() {
  const menu = dailyMenu[0]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-16 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🍛</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent mb-4 leading-tight">
            Today Special
          </h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.3 }} className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto mb-6 rounded-full" />
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50">
            <span className="text-xl font-medium text-gray-800 mr-3">{menu.date}</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-lg text-gray-600 ml-3">{menu.tiffinType}</span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-8">
          {/* Menu Card */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full -mr-16 -mt-16"></div>
            {menu.specialNote && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-400 p-4 rounded-r-xl mb-6">
                <p className="text-orange-800 font-medium flex items-center">
                  <span className="mr-2">✨</span>{menu.specialNote}
                </p>
              </motion.div>
            )}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-3xl mr-3">🍲</span>Today Delights
              </h3>
              <div className="space-y-3">
                {menu.menuItems.map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + idx * 0.1 }} className="flex items-center bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">➕</span>Customize Your Meal
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {menu.addons.map((addon, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.1 }} className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></div>{addon}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Info & Pricing Card */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Single-Day Plan Only */}
            <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50">
              <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-3xl mr-3">💰</span>Single-Day Tiffin
              </h4>
              <div className="flex justify-between items-center bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-2xl border border-yellow-200">
                <span className="font-semibold text-gray-800">Price</span>
                <span className="text-2xl font-bold text-red-600">${menu.pricing.singleDay.price}</span>
              </div>
              {menu.pricing.singleDay.includesDelivery && (
                <p className="text-sm text-gray-600 mt-2">✓ Includes delivery</p>
              )}
            </motion.div>

            {/* Timing & Delivery */}
            <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50">
              <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-3xl mr-3">⏰</span>Timing & Delivery
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl">
                  <span className="font-medium text-gray-700">🌅 Lunch By</span>
                  <span className="font-bold text-blue-600">{menu.timings.lunchBy}</span>
                </div>
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl">
                  <span className="font-medium text-gray-700">🌙 Dinner By</span>
                  <span className="font-bold text-purple-600">{menu.timings.dinnerBy}</span>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
                  <p className="text-gray-700 mb-2">📍 {menu.pickupAddress}</p>
                  <p className="text-green-700 text-sm">{menu.delivery.note}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Thank You & Order */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }} className="text-center mt-12">
          {menu.thankYouMessage && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-gray-600 mt-4 italic">
              {menu.thankYouMessage}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Floating Icons */}
      <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-10 text-4xl opacity-20 pointer-events-none hidden md:block">🌶️</motion.div>
      <motion.div animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 left-10 text-4xl opacity-20 pointer-events-none hidden md:block">🥘</motion.div>
    </section>
  )
}
