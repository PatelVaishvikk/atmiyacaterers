
// 'use client'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useState } from 'react'
// import { Plus, Minus, ShoppingCart, Sparkles, Phone, X } from 'lucide-react'

// const basePlans = [
//   {
//     id: 'mini',
//     name: 'Mini',
//     category: 'Light Meal',
//     basePrice: 7.99,
//     baseItems: ['8 oz Sabji', '6 Roti'],
//     alternativeBase: ['8 oz Dal', '8 oz Rice'],
//     hasAlternative: true,
//     color: 'emerald'
//   },
//   {
//     id: 'plus',
//     name: 'Plus',
//     category: 'Standard Meal', 
//     basePrice: 9.99,
//     baseItems: ['8 oz Sabji', '5 Roti', '8 oz Dal', '8 oz Rice'],
//     color: 'blue'
//   },
//   {
//     id: 'pro',
//     name: 'Pro',
//     category: 'Complete Meal',
//     basePrice: 10.99,
//     baseItems: ['8 oz Sabji', '5 Roti', '8 oz Dal', '8 oz Rice', 'Raitu/Papad/Salad (Any Two)'],
//     popular: true,
//     color: 'purple'
//   },
//   {
//     id: 'promax',
//     name: 'Pro Max',
//     category: 'Premium Meal',
//     basePrice: 13.99,
//     baseItems: ['8 oz Sabji', '7 Roti', '8 oz Dal', '8 oz Rice', 'Raitu/Papad/Salad (Any Two)', 'Sweet', 'Farsan'],
//     color: 'orange'
//   }
// ]

// const addOnItems = [
//   { id: 'extra_sabji', name: 'Extra 1oz Sabji', price: 0.375 },
//   { id: 'extra_roti', name: 'Extra 1 Roti', price: 0.50 },
//   { id: 'extra_dal', name: 'Extra 1oz Dal', price: 0.30 },
//   { id: 'extra_rice', name: 'Extra 1oz Rice', price: 0.20 },
//   { id: 'raita', name: 'Raita', price: 1.50 },
//   { id: 'papad', name: 'Papad', price: 0.75 },
//   { id: 'salad', name: 'Fresh Salad', price: 1.25 },
//   { id: 'pickle', name: 'Homemade Pickle', price: 0.50 },
//   { id: 'sweet', name: 'Sweet of the Day', price: 2.00 },
//   { id: 'farsan', name: 'Farsan', price: 1.75 },
//   { id: 'buttermilk', name: 'Fresh Buttermilk', price: 1.00 },
//   { id: 'premium_sabji', name: 'Premium Sabji (Paneer/Special)', price: 2.50 }
// ]

// // Smart pricing combinations that match original plans
// const smartPricingRules = [
//   {
//     basePlan: 'mini',
//     addOns: { 'extra_sabji': 4, 'extra_roti': 2 },
//     targetPrice: 9.49,
//     description: 'AA Mini equivalent'
//   },
//   {
//     basePlan: 'plus', 
//     addOns: { 'extra_sabji': 4, 'extra_roti': 3 },
//     targetPrice: 12.99,
//     description: 'AA+ equivalent'
//   },
//   {
//     basePlan: 'pro',
//     addOns: { 'extra_sabji': 4, 'extra_roti': 3 },
//     targetPrice: 13.99,
//     description: 'AA Pro equivalent'
//   },
//   {
//     basePlan: 'promax',
//     addOns: { 'extra_sabji': 4, 'extra_roti': 1 },
//     targetPrice: 15.99,
//     description: 'AA Pro Max equivalent'
//   },
//   {
//     basePlan: 'mini',
//     addOns: { 'raita': 2 },
//     targetPrice: 9.99,
//     description: 'A+ equivalent'
//   },
//   {
//     basePlan: 'plus',
//     addOns: { 'raita': 2 },
//     targetPrice: 10.99,
//     description:'A Pro equivalent'
//   }
// ]

// const portionUpgrades = [
//   { id: 'large_portion', name: 'Upgrade to Large Portions (AA Series)', price: 2.00, description: 'All sabji portions become 12oz' }
// ]


// export default function CustomizableTiffinPlans() {
//   const [selectedPlan, setSelectedPlan] = useState(null)
//   const [customizations, setCustomizations] = useState({})
//   const [portionUpgrade, setPortionUpgrade] = useState(false)
//   const [alternativeBase, setAlternativeBase] = useState(false)
//   const [customerPhone, setCustomerPhone] = useState('')
//   const [showPhoneInput, setShowPhoneInput] = useState(false)
//   const [orderType, setOrderType] = useState('') 
//   const [customerName, setCustomerName] = useState('')
// const [customerAddress, setCustomerAddress] = useState('')// 'direct' or 'custom'

//   // Your restaurant's WhatsApp number (replace with actual number)
//   const restaurantWhatsApp = "15199927920" // Replace with your WhatsApp number (with country code)

//   const getColorClasses = (color, variant = 'default') => {
//     const colors = {
//       emerald: {
//         default: 'border-emerald-200 hover:border-emerald-300',
//         bg: 'bg-emerald-500',
//         text: 'text-emerald-600',
//         light: 'bg-emerald-50 border-emerald-200',
//         button: 'bg-emerald-600 hover:bg-emerald-700'
//       },
//       blue: {
//         default: 'border-blue-200 hover:border-blue-300',
//         bg: 'bg-blue-500',
//         text: 'text-blue-600',
//         light: 'bg-blue-50 border-blue-200',
//         button: 'bg-blue-600 hover:bg-blue-700'
//       },
//       purple: {
//         default: 'border-purple-200 hover:border-purple-300',
//         bg: 'bg-purple-500',
//         text: 'text-purple-600',
//         light: 'bg-purple-50 border-purple-200',
//         button: 'bg-purple-600 hover:bg-purple-700'
//       },
//       orange: {
//         default: 'border-orange-200 hover:border-orange-300',
//         bg: 'bg-orange-500',
//         text: 'text-orange-600',
//         light: 'bg-orange-50 border-orange-200',
//         button: 'bg-orange-600 hover:bg-orange-700'
//       }
//     }
//     return colors[color]?.[variant] || colors.blue[variant]
//   }

//   const calculateTotalPrice = (basePlan) => {
//     if (!basePlan) return 0
    
//     // Check for smart pricing rules first
//     const matchingRule = smartPricingRules.find(rule => {
//       if (rule.basePlan !== basePlan.id) return false
      
//       // Check if current customizations match this rule exactly
//       return Object.entries(rule.addOns).every(([itemId, expectedQty]) => {
//         return (customizations[itemId] || 0) === expectedQty
//       }) && Object.keys(customizations).length === Object.keys(rule.addOns).length && !portionUpgrade
//     })
    
//     if (matchingRule) {
//       return matchingRule.targetPrice
//     }
    
//     // Standard calculation if no smart pricing rule applies
//     let total = basePlan.basePrice
    
//     // Add portion upgrade
//     if (portionUpgrade) {
//       total += portionUpgrades[0].price
//     }
    
//     // Add customizations
//     Object.entries(customizations).forEach(([itemId, quantity]) => {
//       const item = addOnItems.find(addon => addon.id === itemId)
//       if (item && quantity > 0) {
//         total += item.price * quantity
//       }
//     })
    
//     return total
//   }

//   const getSmartPricingMessage = (basePlan) => {
//     if (!basePlan) return null
    
//     const matchingRule = smartPricingRules.find(rule => {
//       if (rule.basePlan !== basePlan.id) return false
      
//       return Object.entries(rule.addOns).every(([itemId, expectedQty]) => {
//         return (customizations[itemId] || 0) === expectedQty
//       }) && Object.keys(customizations).length === Object.keys(rule.addOns).length && !portionUpgrade
//     })
    
//     return matchingRule ? matchingRule.description : null
//   }

//   const calculateMonthlyPricing = (dailyPrice) => {
//     return {
//       weekdays: dailyPrice * 22, // Approximate weekdays per month
//       fullWeek: dailyPrice * 30  // Full month
//     }
//   }

//   const updateCustomization = (itemId, change) => {
//     setCustomizations(prev => ({
//       ...prev,
//       [itemId]: Math.max(0, (prev[itemId] || 0) + change)
//     }))
//   }

//   const hasCustomizations = () => {
//     return Object.values(customizations).some(qty => qty > 0) || portionUpgrade || alternativeBase
//   }

//   const generateWhatsAppMessage = (plan, isDirectOrder = false) => {
//   const totalPrice = isDirectOrder ? plan.basePrice : calculateTotalPrice(plan)
//   const monthlyPricing = calculateMonthlyPricing(totalPrice)
  
//   let message = `🍛 *TIFFIN ORDER REQUEST* 🍛\n\n`
//   message += `👤 *Customer Name:* ${customerName}\n`
//   message += `📱 *Phone:* ${customerPhone}\n`
//   message += `📍 *Address:* ${customerAddress}\n\n`
//   message += `📋 *Plan:* ${plan.name} (${plan.category})\n`
//   message += `💰 *Daily Price:* $${totalPrice.toFixed(2)}\n`
  
//   // Only show monthly pricing for direct orders (no customizations)
//   if (isDirectOrder) {
//     message += `📅 *Monthly (Weekdays):* $${monthlyPricing.weekdays.toFixed(2)}\n`
//     message += `📅 *Monthly (Full Week):* $${monthlyPricing.fullWeek.toFixed(2)}\n\n`
//   } else {
//     message += `📅 *Monthly Pricing:* Please contact for custom pricing\n\n`
//   }
  
//   message += `🍽️ *Items Included:*\n`
  
//   if (isDirectOrder) {
//     // Direct order - show base items
//     const baseItems = (plan.hasAlternative && alternativeBase ? plan.alternativeBase : plan.baseItems)
//     baseItems.forEach(item => {
//       message += `• ${item}\n`
//     })
//   } else {
//     // Custom order - show base + customizations
//     const baseItems = (plan.hasAlternative && alternativeBase ? plan.alternativeBase : plan.baseItems)
//     message += `*Base Items:*\n`
//     baseItems.forEach(item => {
//       message += `• ${item}\n`
//     })
    
//     // Add portion upgrade
//     if (portionUpgrade) {
//       message += `\n*Upgrades:*\n`
//       message += `• Large Portions (AA Series) +$${portionUpgrades[0].price.toFixed(2)}\n`
//     }
    
//     // Add customizations
//     const hasCustom = Object.values(customizations).some(qty => qty > 0)
//     if (hasCustom) {
//       message += `\n*Extra Items:*\n`
//       Object.entries(customizations).forEach(([itemId, quantity]) => {
//         if (quantity > 0) {
//           const item = addOnItems.find(addon => addon.id === itemId)
//           message += `• ${item.name} x${quantity} (+$${(item.price * quantity).toFixed(2)})\n`
//         }
//       })
//     }
    
//     // Show smart pricing match if applicable
//     const smartPriceMsg = getSmartPricingMessage(plan)
//     if (smartPriceMsg) {
//       message += `\n🎉 *Smart Price Match:* ${smartPriceMsg}\n`
//     }
//   }
  
//   if (!isDirectOrder) {
//     message += `\n💡 *Note:* This is a customized order. Please contact for monthly subscription pricing and delivery schedule.\n`
//   }
  
//   message += `\n✅ Please confirm this order and delivery details.\n`
//   message += `📍 Service Area: Windsor and surrounding areas`
  
//   return message
// }

//   const handleDirectOrder = (plan, e) => {
//     e.stopPropagation() // Prevent plan selection
//     setOrderType('direct')
//     setSelectedPlan(plan)
//     setShowPhoneInput(true)
//   }

//   const handleCustomOrder = () => {
//     setOrderType('custom')
//     setShowPhoneInput(true)
//   }

//   const sendWhatsAppOrder = () => {
//   if (!customerName.trim()) {
//     alert('Please enter your name')
//     return
//   }
//   if (!customerPhone.trim()) {
//     alert('Please enter your phone number')
//     return
//   }
//   if (!customerAddress.trim()) {
//     alert('Please enter your address')
//     return
//   }
  
//   const message = generateWhatsAppMessage(selectedPlan, orderType === 'direct')
//   const encodedMessage = encodeURIComponent(message)
//   const whatsappUrl = `https://wa.me/${restaurantWhatsApp}?text=${encodedMessage}`
  
//   // Open WhatsApp
//   window.open(whatsappUrl, '_blank')
  
//   // Reset state
//   setShowPhoneInput(false)
//   setCustomerName('')
//   setCustomerPhone('')
//   setCustomerAddress('')
//   if (orderType === 'direct') {
//     setSelectedPlan(null)
//   }
//   setOrderType('')
// }
//   const resetCustomizations = () => {
//     setCustomizations({})
//     setPortionUpgrade(false)
//     setAlternativeBase(false)
//   }

//   return (
//     <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mb-4">
//               Build Your Perfect Tiffin
//             </h2>
//             <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
//               Start with a base plan and customize it exactly how you like. Fresh, vegetarian, home-style meals delivered daily.
//             </p>
//             <div className="flex items-center justify-center gap-2 text-orange-600">
//               <Sparkles className="w-5 h-5" />
//               <span className="font-medium">Fully Customizable • Real-time Pricing</span>
//               <Sparkles className="w-5 h-5" />
//             </div>
//           </motion.div>
//         </div>

//         {!selectedPlan ? (
//           // Plan Selection View
//           <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
//             {basePlans.map((plan, index) => (
//               <motion.div
//                 key={plan.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ scale: 1.02, y: -8 }}
//                 onClick={() => setSelectedPlan(plan)}
//                 className={`cursor-pointer bg-white p-6 rounded-2xl shadow-lg border-2 relative ${getColorClasses(plan.color)}`}
//               >
//                 {plan.popular && (
//                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                     <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
//                       ⭐ Most Popular
//                     </span>
//                   </div>
//                 )}

//                 <div className="text-center mb-6">
//                   <div className={`w-16 h-16 ${getColorClasses(plan.color, 'bg')} rounded-full mx-auto mb-4 flex items-center justify-center`}>
//                     <span className="text-white text-2xl font-bold">{plan.name[0]}</span>
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
//                   <p className="text-sm text-gray-500 mb-4">{plan.category}</p>
                  
//                   <div className="text-3xl font-bold text-gray-800 mb-2">
//                     ${plan.basePrice.toFixed(2)}
//                     <span className="text-lg font-normal text-gray-500">/day</span>
//                   </div>
//                   <p className="text-xs text-gray-500">Starting price • Customizable</p>
//                 </div>

//                 <div className="mb-6">
//                   <h4 className="font-semibold text-gray-700 mb-3">Base Includes:</h4>
//                   <ul className="space-y-2 text-sm text-gray-600">
//                     {plan.baseItems.map((item, i) => (
//                       <li key={i} className="flex items-center">
//                         <span className={`w-2 h-2 ${getColorClasses(plan.color, 'bg')} rounded-full mr-2 flex-shrink-0`}></span>
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                   {plan.hasAlternative && (
//                     <div className="mt-3 text-center">
//                       <span className="text-xs text-gray-500 bg-orange-100 px-2 py-1 rounded-full">
//                         Alternative options available
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <button className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${getColorClasses(plan.color, 'button')}`}>
//                     Customize This Plan
//                   </button>
//                   <button 
//                     onClick={(e) => handleDirectOrder(plan, e)}
//                     className={`w-full py-2 px-4 rounded-lg font-medium border-2 transition-all hover:scale-105 ${getColorClasses(plan.color)} text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2`}
//                   >
//                     <Phone className="w-4 h-4" />
//                     Order Directly
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           // Customization View
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="max-w-6xl mx-auto"
//           >
//             <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//               {/* Header */}
//               <div className={`${getColorClasses(selectedPlan.color, 'light')} p-6 border-b`}>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className={`w-12 h-12 ${getColorClasses(selectedPlan.color, 'bg')} rounded-full flex items-center justify-center`}>
//                       <span className="text-white text-xl font-bold">{selectedPlan.name[0]}</span>
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold text-gray-800">{selectedPlan.name} Plan</h3>
//                       <p className="text-gray-600">{selectedPlan.category}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setSelectedPlan(null)
//                       resetCustomizations()
//                     }}
//                     className="text-gray-500 hover:text-gray-700 text-sm underline"
//                   >
//                     ← Choose Different Plan
//                   </button>
//                 </div>
//               </div>

//               <div className="grid lg:grid-cols-2 gap-8 p-8">
//                 {/* Customization Panel */}
//                 <div className="space-y-6">
//                   <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                     <ShoppingCart className="w-5 h-5" />
//                     Customize Your Meal
//                   </h4>

//                   {/* Base Items */}
//                   <div className={`p-4 rounded-xl ${getColorClasses(selectedPlan.color, 'light')}`}>
//                     <h5 className="font-semibold text-gray-700 mb-3">Base Items Included:</h5>
                    
//                     {selectedPlan.hasAlternative && (
//                       <div className="mb-4">
//                         <label className="flex items-center gap-2 text-sm">
//                           <input
//                             type="checkbox"
//                             checked={alternativeBase}
//                             onChange={(e) => setAlternativeBase(e.target.checked)}
//                             className="rounded"
//                           />
//                           <span>Switch to Alternative Base (Dal + Rice instead of Sabji + Roti)</span>
//                         </label>
//                       </div>
//                     )}
                    
//                     <ul className="space-y-1 text-sm text-gray-600">
//                       {(selectedPlan.hasAlternative && alternativeBase ? selectedPlan.alternativeBase : selectedPlan.baseItems).map((item, i) => (
//                         <li key={i} className="flex items-center">
//                           <span className={`w-2 h-2 ${getColorClasses(selectedPlan.color, 'bg')} rounded-full mr-2`}></span>
//                           {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {/* Portion Upgrade */}
//                   <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <h5 className="font-semibold text-gray-700">Upgrade to Large Portions</h5>
//                         <p className="text-sm text-gray-500">All sabji portions become 12oz (AA Series)</p>
//                       </div>
//                       <label className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={portionUpgrade}
//                           onChange={(e) => setPortionUpgrade(e.target.checked)}
//                           className="sr-only"
//                         />
//                         <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//                           portionUpgrade ? getColorClasses(selectedPlan.color, 'bg') : 'bg-gray-300'
//                         }`}>
//                           <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
//                             portionUpgrade ? 'translate-x-6' : 'translate-x-1'
//                           }`} />
//                         </div>
//                       </label>
//                     </div>
//                     <p className={`text-sm font-medium ${getColorClasses(selectedPlan.color, 'text')}`}>
//                       +${portionUpgrades[0].price.toFixed(2)}/day
//                     </p>
//                   </div>

//                   {/* Add-ons */}
//                   <div>
//                     <h5 className="font-semibold text-gray-700 mb-4">Add Extra Items:</h5>
//                     <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                       <p className="text-sm text-blue-700 font-medium mb-1">💡 Smart Pricing Tips:</p>
//                       <div className="text-xs text-blue-600 space-y-1">
//                         {selectedPlan.id === 'mini' && (
//                           <>
//                             <p>• Add <strong>4oz Sabji + 2 Roti</strong> = AA Mini price ($9.49)</p>
//                             <p>• Add <strong>2x Raita</strong> = A+ equivalent ($9.99)</p>
//                           </>
//                         )}
//                         {selectedPlan.id === 'plus' && (
//                           <>
//                             <p>• Add <strong>4oz Sabji + 3 Roti</strong> = AA+ price ($12.99)</p>
//                             <p>• Add <strong>2x Raita</strong> = A Pro equivalent ($10.99)</p>
//                           </>
//                         )}
//                         {selectedPlan.id === 'pro' && (
//                           <p>• Add <strong>4oz Sabji + 3 Roti</strong> = AA Pro price ($13.99)</p>
//                         )}
//                         {selectedPlan.id === 'promax' && (
//                           <p>• Add <strong>4oz Sabji + 1 Roti</strong> = AA Pro Max price ($15.99)</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="grid sm:grid-cols-2 gap-3">
//                       {addOnItems.map((item) => (
//                         <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
//                           <div className="flex-1">
//                             <p className="font-medium text-sm text-gray-800">{item.name}</p>
//                             <p className={`text-xs ${getColorClasses(selectedPlan.color, 'text')} font-semibold`}>
//                               +${item.price.toFixed(2)}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => updateCustomization(item.id, -1)}
//                               className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
//                               disabled={!customizations[item.id]}
//                             >
//                               <Minus className="w-3 h-3" />
//                             </button>
//                             <span className="w-8 text-center font-medium">
//                               {customizations[item.id] || 0}
//                             </span>
//                             <button
//                               onClick={() => updateCustomization(item.id, 1)}
//                               className={`w-7 h-7 rounded-full ${getColorClasses(selectedPlan.color, 'bg')} text-white hover:opacity-80 flex items-center justify-center transition-opacity`}
//                             >
//                               <Plus className="w-3 h-3" />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Summary */}
//                 <div className="lg:sticky lg:top-8">
//                   <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
//                     <h4 className="text-xl font-bold text-gray-800">Order Summary</h4>
                    
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Base {selectedPlan.name} Plan</span>
//                         <span className="font-medium">${selectedPlan.basePrice.toFixed(2)}</span>
//                       </div>
                      
//                       {portionUpgrade && (
//                         <div className="flex justify-between items-center text-sm">
//                           <span className="text-gray-600">Large Portion Upgrade</span>
//                           <span className="font-medium text-purple-600">+${portionUpgrades[0].price.toFixed(2)}</span>
//                         </div>
//                       )}
                      
//                       {Object.entries(customizations).map(([itemId, quantity]) => {
//                         if (quantity === 0) return null
//                         const item = addOnItems.find(addon => addon.id === itemId)
//                         return (
//                           <div key={itemId} className="flex justify-between items-center text-sm">
//                             <span className="text-gray-600">{item.name} x{quantity}</span>
//                             <span className="font-medium text-green-600">+${(item.price * quantity).toFixed(2)}</span>
//                           </div>
//                         )
//                       })}
//                     </div>
                    
//                     <hr className="border-gray-300" />
                    
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center text-lg">
//                         <span className="font-bold text-gray-800">Daily Total:</span>
//                         <span className={`text-2xl font-bold ${getColorClasses(selectedPlan.color, 'text')}`}>
//                           ${calculateTotalPrice(selectedPlan).toFixed(2)}
//                         </span>
//                       </div>
                      
//                       {getSmartPricingMessage(selectedPlan) && (
//                         <div className="bg-green-100 border border-green-200 rounded-lg p-3">
//                           <p className="text-sm text-green-800 font-medium">
//                             🎉 Smart Price Match: {getSmartPricingMessage(selectedPlan)}
//                           </p>
//                         </div>
//                       )}
                      
//                       <div className="text-xs text-gray-500 space-y-1">
//                         <p>Monthly estimates:</p>
//                         <p>• Weekdays only: ~${(calculateTotalPrice(selectedPlan) * 22).toFixed(2)}</p>
//                         <p>• Full week: ~${(calculateTotalPrice(selectedPlan) * 30).toFixed(2)}</p>
//                       </div>
//                     </div>

//                     <div className="space-y-3 pt-4">
//                       {hasCustomizations() && (
//                         <button
//                           onClick={resetCustomizations}
//                           className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
//                         >
//                           Reset Customizations
//                         </button>
//                       )}
                      
//                       <button
//                         onClick={handleCustomOrder}
//                         className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all transform hover:scale-105 ${getColorClasses(selectedPlan.color, 'button')} flex items-center justify-center gap-3`}
//                       >
//                         <Phone className="w-5 h-5" />
//                         Order via WhatsApp
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
        
//         {/* Phone Input Modal */}
//         <AnimatePresence>
//   {showPhoneInput && (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//     >
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
//       >
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-bold text-gray-800">Customer Information</h3>
//           <button
//             onClick={() => {
//               setShowPhoneInput(false)
//               setCustomerName('')
//               setCustomerPhone('')
//               setCustomerAddress('')
//               if (orderType === 'direct') {
//                 setSelectedPlan(null)
//               }
//               setOrderType('')
//             }}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>
        
//         <p className="text-sm text-gray-600 mb-6">
//           Please provide your details for order confirmation and delivery coordination.
//         </p>
        
//         <div className="space-y-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Full Name *
//             </label>
//             <input
//               type="text"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//               placeholder="Enter your full name"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               autoFocus
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number *
//             </label>
//             <input
//               type="tel"
//               value={customerPhone}
//               onChange={(e) => setCustomerPhone(e.target.value)}
//               placeholder="e.g., (519) 123-4567"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Delivery Address *
//             </label>
//             <textarea
//               value={customerAddress}
//               onChange={(e) => setCustomerAddress(e.target.value)}
//               placeholder="Enter your complete delivery address including postal code"
//               rows={3}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//           </div>
//         </div>
        
//         <div className="flex gap-3">
//           <button
//             onClick={() => {
//               setShowPhoneInput(false)
//               setCustomerName('')
//               setCustomerPhone('')
//               setCustomerAddress('')
//               if (orderType === 'direct') {
//                 setSelectedPlan(null)
//               }
//               setOrderType('')
//             }}
//             className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={sendWhatsAppOrder}
//             className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
//           >
//             <Phone className="w-4 h-4" />
//             Send Order
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   )}
// </AnimatePresence>
//       </div>
//     </section>
//   )
// } 
//   // ... (rest of the JSX remains the same as in your complete code)
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Minus, ShoppingCart, Sparkles, Phone, X } from 'lucide-react'

const basePlans = [
  {
    id: 'mini',
    name: 'Mini',
    category: 'Light Meal',
    basePrice: 7.99,
    baseItems: ['8 oz Sabji', '6 Roti'],
    alternativeBase: ['8 oz Dal', '8 oz Rice'],
    hasAlternative: true,
    color: 'emerald'
  },
  {
    id: 'plus',
    name: 'Plus',
    category: 'Standard Meal', 
    basePrice: 9.99,
    baseItems: ['8 oz Sabji', '5 Roti', '8 oz Dal', '8 oz Rice'],
    color: 'blue'
  },
  {
    id: 'pro',
    name: 'Pro',
    category: 'Complete Meal',
    basePrice: 10.99,
    baseItems: ['8 oz Sabji', '5 Roti', '8 oz Dal', '8 oz Rice', 'Raitu/Papad/Salad (Any Two)'],
    popular: true,
    color: 'purple'
  },
  {
    id: 'promax',
    name: 'Pro Max',
    category: 'Premium Meal',
    basePrice: 13.99,
    baseItems: ['8 oz Sabji', '7 Roti', '8 oz Dal', '8 oz Rice', 'Raitu/Papad/Salad (Any Two)', 'Sweet', 'Farsan'],
    color: 'orange'
  }
]

const addOnItems = [
  { id: 'extra_sabji', name: 'Extra 1oz Sabji', price: 0.375 },
  { id: 'extra_roti', name: 'Extra 1 Roti', price: 0.50 },
  { id: 'extra_dal', name: 'Extra 1oz Dal', price: 0.30 },
  { id: 'extra_rice', name: 'Extra 1oz Rice', price: 0.20 },
  { id: 'raita', name: 'Raita', price: 1.50 },
  { id: 'papad', name: 'Papad', price: 0.75 },
  { id: 'salad', name: 'Fresh Salad', price: 1.25 },
  { id: 'pickle', name: 'Homemade Pickle', price: 0.50 },
  { id: 'sweet', name: 'Sweet of the Day', price: 2.00 },
  { id: 'farsan', name: 'Farsan', price: 1.75 },
  { id: 'buttermilk', name: 'Fresh Buttermilk', price: 1.00 },
  { id: 'premium_sabji', name: 'Premium Sabji (Paneer/Special)', price: 2.50 }
]

// Smart pricing combinations that match original plans
const smartPricingRules = [
  {
    basePlan: 'mini',
    addOns: { 'extra_sabji': 4, 'extra_roti': 2 },
    targetPrice: 9.49,
    description: 'AA Mini equivalent'
  },
  {
    basePlan: 'plus', 
    addOns: { 'extra_sabji': 4, 'extra_roti': 3 },
    targetPrice: 12.99,
    description: 'AA+ equivalent'
  },
  {
    basePlan: 'pro',
    addOns: { 'extra_sabji': 4, 'extra_roti': 3 },
    targetPrice: 13.99,
    description: 'AA Pro equivalent'
  },
  {
    basePlan: 'promax',
    addOns: { 'extra_sabji': 4, 'extra_roti': 1 },
    targetPrice: 15.99,
    description: 'AA Pro Max equivalent'
  },
  {
    basePlan: 'mini',
    addOns: { 'raita': 2 },
    targetPrice: 9.99,
    description: 'A+ equivalent'
  },
  {
    basePlan: 'plus',
    addOns: { 'raita': 2 },
    targetPrice: 10.99,
    description:'A Pro equivalent'
  }
]

const portionUpgrades = [
  { id: 'large_portion', name: 'Upgrade to Large Portions (AA Series)', price: 2.00, description: 'All sabji portions become 12oz' }
]


export default function CustomizableTiffinPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [customizations, setCustomizations] = useState({})
  const [portionUpgrade, setPortionUpgrade] = useState(false)
  const [alternativeBase, setAlternativeBase] = useState(false)
  const [customerPhone, setCustomerPhone] = useState('')
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [orderType, setOrderType] = useState('') // 'direct' or 'custom'

  // Your restaurant's WhatsApp number (replace with actual number)
  const restaurantWhatsApp = "15199927920" // Replace with your WhatsApp number (with country code)

  const getColorClasses = (color, variant = 'default') => {
    const colors = {
      emerald: {
        default: 'border-emerald-200 hover:border-emerald-300',
        bg: 'bg-emerald-500',
        text: 'text-emerald-600',
        light: 'bg-emerald-50 border-emerald-200',
        button: 'bg-emerald-600 hover:bg-emerald-700'
      },
      blue: {
        default: 'border-blue-200 hover:border-blue-300',
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        light: 'bg-blue-50 border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        default: 'border-purple-200 hover:border-purple-300',
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        light: 'bg-purple-50 border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      orange: {
        default: 'border-orange-200 hover:border-orange-300',
        bg: 'bg-orange-500',
        text: 'text-orange-600',
        light: 'bg-orange-50 border-orange-200',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    }
    return colors[color]?.[variant] || colors.blue[variant]
  }

  const calculateTotalPrice = (basePlan) => {
    if (!basePlan) return 0
    
    // Check for smart pricing rules first
    const matchingRule = smartPricingRules.find(rule => {
      if (rule.basePlan !== basePlan.id) return false
      
      // Check if current customizations match this rule exactly
      return Object.entries(rule.addOns).every(([itemId, expectedQty]) => {
        return (customizations[itemId] || 0) === expectedQty
      }) && Object.keys(customizations).length === Object.keys(rule.addOns).length && !portionUpgrade
    })
    
    if (matchingRule) {
      return matchingRule.targetPrice
    }
    
    // Standard calculation if no smart pricing rule applies
    let total = basePlan.basePrice
    
    // Add portion upgrade
    if (portionUpgrade) {
      total += portionUpgrades[0].price
    }
    
    // Add customizations
    Object.entries(customizations).forEach(([itemId, quantity]) => {
      const item = addOnItems.find(addon => addon.id === itemId)
      if (item && quantity > 0) {
        total += item.price * quantity
      }
    })
    
    return total
  }

  const getSmartPricingMessage = (basePlan) => {
    if (!basePlan) return null
    
    const matchingRule = smartPricingRules.find(rule => {
      if (rule.basePlan !== basePlan.id) return false
      
      return Object.entries(rule.addOns).every(([itemId, expectedQty]) => {
        return (customizations[itemId] || 0) === expectedQty
      }) && Object.keys(customizations).length === Object.keys(rule.addOns).length && !portionUpgrade
    })
    
    return matchingRule ? matchingRule.description : null
  }

  const calculateMonthlyPricing = (dailyPrice) => {
    return {
      weekdays: dailyPrice * 22, // Approximate weekdays per month
      fullWeek: dailyPrice * 30  // Full month
    }
  }

  const updateCustomization = (itemId, change) => {
    setCustomizations(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }))
  }

  const hasCustomizations = () => {
    return Object.values(customizations).some(qty => qty > 0) || portionUpgrade || alternativeBase
  }

  const generateWhatsAppMessage = (plan, isDirectOrder = false) => {
    const totalPrice = isDirectOrder ? plan.basePrice : calculateTotalPrice(plan)
    const monthlyPricing = calculateMonthlyPricing(totalPrice)
    
    let message = `🍛 *TIFFIN ORDER REQUEST* 🍛\n\n`
    message += `📋 *Plan:* ${plan.name} (${plan.category})\n`
    message += `💰 *Daily Price:* ${totalPrice.toFixed(2)}\n`
    
    // Only show monthly pricing for direct orders (no customizations)
    if (isDirectOrder) {
      message += `📅 *Monthly (Weekdays):* ${monthlyPricing.weekdays.toFixed(2)}\n`
      message += `📅 *Monthly (Full Week):* ${monthlyPricing.fullWeek.toFixed(2)}\n\n`
    } else {
      message += `📅 *Monthly Pricing:* Please contact for custom pricing\n\n`
    }
    
    message += `🍽️ *Items Included:*\n`
    
    if (isDirectOrder) {
      // Direct order - show base items
      const baseItems = (plan.hasAlternative && alternativeBase ? plan.alternativeBase : plan.baseItems)
      baseItems.forEach(item => {
        message += `• ${item}\n`
      })
    } else {
      // Custom order - show base + customizations
      const baseItems = (plan.hasAlternative && alternativeBase ? plan.alternativeBase : plan.baseItems)
      message += `*Base Items:*\n`
      baseItems.forEach(item => {
        message += `• ${item}\n`
      })
      
      // Add portion upgrade
      if (portionUpgrade) {
        message += `\n*Upgrades:*\n`
        message += `• Large Portions (AA Series) +${portionUpgrades[0].price.toFixed(2)}\n`
      }
      
      // Add customizations
      const hasCustom = Object.values(customizations).some(qty => qty > 0)
      if (hasCustom) {
        message += `\n*Extra Items:*\n`
        Object.entries(customizations).forEach(([itemId, quantity]) => {
          if (quantity > 0) {
            const item = addOnItems.find(addon => addon.id === itemId)
            message += `• ${item.name} x${quantity} (+${(item.price * quantity).toFixed(2)})\n`
          }
        })
      }
      
      // Show smart pricing match if applicable
      const smartPriceMsg = getSmartPricingMessage(plan)
      if (smartPriceMsg) {
        message += `\n🎉 *Smart Price Match:* ${smartPriceMsg}\n`
      }
    }
    
    message += `\n📱 *Customer Phone:* ${customerPhone}\n`
    
    if (!isDirectOrder) {
      message += `\n💡 *Note:* This is a customized order. Please contact for monthly subscription pricing and delivery schedule.\n`
    }
    
    message += `\n✅ Please confirm this order and delivery details.\n`
    message += `📍 Service Area: Windsor and surrounding areas`
    
    return message
  }

  const handleDirectOrder = (plan, e) => {
    e.stopPropagation() // Prevent plan selection
    setOrderType('direct')
    setSelectedPlan(plan)
    setShowPhoneInput(true)
  }

  const handleCustomOrder = () => {
    setOrderType('custom')
    setShowPhoneInput(true)
  }

  const sendWhatsAppOrder = () => {
    if (!customerPhone.trim()) {
      alert('Please enter your phone number')
      return
    }
    
    const message = generateWhatsAppMessage(selectedPlan, orderType === 'direct')
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${restaurantWhatsApp}?text=${encodedMessage}`
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
    
    // Reset state
    setShowPhoneInput(false)
    setCustomerPhone('')
    if (orderType === 'direct') {
      setSelectedPlan(null)
    }
    setOrderType('')
  }

  const resetCustomizations = () => {
    setCustomizations({})
    setPortionUpgrade(false)
    setAlternativeBase(false)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mb-4">
              Build Your Perfect Tiffin
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Start with a base plan and customize it exactly how you like. Fresh, vegetarian, home-style meals delivered daily.
            </p>
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Fully Customizable • Real-time Pricing</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        {!selectedPlan ? (
          // Plan Selection View
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {basePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
                onClick={() => setSelectedPlan(plan)}
                className={`cursor-pointer bg-white p-6 rounded-2xl shadow-lg border-2 relative ${getColorClasses(plan.color)}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${getColorClasses(plan.color, 'bg')} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <span className="text-white text-2xl font-bold">{plan.name[0]}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.category}</p>
                  
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    ${plan.basePrice.toFixed(2)}
                    <span className="text-lg font-normal text-gray-500">/day</span>
                  </div>
                  <p className="text-xs text-gray-500">Starting price • Customizable</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Base Includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {plan.baseItems.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className={`w-2 h-2 ${getColorClasses(plan.color, 'bg')} rounded-full mr-2 flex-shrink-0`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {plan.hasAlternative && (
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500 bg-orange-100 px-2 py-1 rounded-full">
                        Alternative options available
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${getColorClasses(plan.color, 'button')}`}>
                    Customize This Plan
                  </button>
                  <button 
                    onClick={(e) => handleDirectOrder(plan, e)}
                    className={`w-full py-2 px-4 rounded-lg font-medium border-2 transition-all hover:scale-105 ${getColorClasses(plan.color)} text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2`}
                  >
                    <Phone className="w-4 h-4" />
                    Order Directly
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Customization View
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className={`${getColorClasses(selectedPlan.color, 'light')} p-6 border-b`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${getColorClasses(selectedPlan.color, 'bg')} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xl font-bold">{selectedPlan.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedPlan.name} Plan</h3>
                      <p className="text-gray-600">{selectedPlan.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlan(null)
                      resetCustomizations()
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm underline"
                  >
                    ← Choose Different Plan
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 p-8">
                {/* Customization Panel */}
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Customize Your Meal
                  </h4>

                  {/* Base Items */}
                  <div className={`p-4 rounded-xl ${getColorClasses(selectedPlan.color, 'light')}`}>
                    <h5 className="font-semibold text-gray-700 mb-3">Base Items Included:</h5>
                    
                    {selectedPlan.hasAlternative && (
                      <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={alternativeBase}
                            onChange={(e) => setAlternativeBase(e.target.checked)}
                            className="rounded"
                          />
                          <span>Switch to Alternative Base (Dal + Rice instead of Sabji + Roti)</span>
                        </label>
                      </div>
                    )}
                    
                    <ul className="space-y-1 text-sm text-gray-600">
                      {(selectedPlan.hasAlternative && alternativeBase ? selectedPlan.alternativeBase : selectedPlan.baseItems).map((item, i) => (
                        <li key={i} className="flex items-center">
                          <span className={`w-2 h-2 ${getColorClasses(selectedPlan.color, 'bg')} rounded-full mr-2`}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Portion Upgrade */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-gray-700">Upgrade to Large Portions</h5>
                        <p className="text-sm text-gray-500">All sabji portions become 12oz (AA Series)</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={portionUpgrade}
                          onChange={(e) => setPortionUpgrade(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                          portionUpgrade ? getColorClasses(selectedPlan.color, 'bg') : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            portionUpgrade ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </div>
                    <p className={`text-sm font-medium ${getColorClasses(selectedPlan.color, 'text')}`}>
                      +${portionUpgrades[0].price.toFixed(2)}/day
                    </p>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-4">Add Extra Items:</h5>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium mb-1">💡 Smart Pricing Tips:</p>
                      <div className="text-xs text-blue-600 space-y-1">
                        {selectedPlan.id === 'mini' && (
                          <>
                            <p>• Add <strong>4oz Sabji + 2 Roti</strong> = AA Mini price ($9.49)</p>
                            <p>• Add <strong>2x Raita</strong> = A+ equivalent ($9.99)</p>
                          </>
                        )}
                        {selectedPlan.id === 'plus' && (
                          <>
                            <p>• Add <strong>4oz Sabji + 3 Roti</strong> = AA+ price ($12.99)</p>
                            <p>• Add <strong>2x Raita</strong> = A Pro equivalent ($10.99)</p>
                          </>
                        )}
                        {selectedPlan.id === 'pro' && (
                          <p>• Add <strong>4oz Sabji + 3 Roti</strong> = AA Pro price ($13.99)</p>
                        )}
                        {selectedPlan.id === 'promax' && (
                          <p>• Add <strong>4oz Sabji + 1 Roti</strong> = AA Pro Max price ($15.99)</p>
                        )}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {addOnItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-800">{item.name}</p>
                            <p className={`text-xs ${getColorClasses(selectedPlan.color, 'text')} font-semibold`}>
                              +${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCustomization(item.id, -1)}
                              className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                              disabled={!customizations[item.id]}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {customizations[item.id] || 0}
                            </span>
                            <button
                              onClick={() => updateCustomization(item.id, 1)}
                              className={`w-7 h-7 rounded-full ${getColorClasses(selectedPlan.color, 'bg')} text-white hover:opacity-80 flex items-center justify-center transition-opacity`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-8">
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <h4 className="text-xl font-bold text-gray-800">Order Summary</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base {selectedPlan.name} Plan</span>
                        <span className="font-medium">${selectedPlan.basePrice.toFixed(2)}</span>
                      </div>
                      
                      {portionUpgrade && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Large Portion Upgrade</span>
                          <span className="font-medium text-purple-600">+${portionUpgrades[0].price.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {Object.entries(customizations).map(([itemId, quantity]) => {
                        if (quantity === 0) return null
                        const item = addOnItems.find(addon => addon.id === itemId)
                        return (
                          <div key={itemId} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{item.name} x{quantity}</span>
                            <span className="font-medium text-green-600">+${(item.price * quantity).toFixed(2)}</span>
                          </div>
                        )
                      })}
                    </div>
                    
                    <hr className="border-gray-300" />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-gray-800">Daily Total:</span>
                        <span className={`text-2xl font-bold ${getColorClasses(selectedPlan.color, 'text')}`}>
                          ${calculateTotalPrice(selectedPlan).toFixed(2)}
                        </span>
                      </div>
                      
                      {getSmartPricingMessage(selectedPlan) && (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800 font-medium">
                            🎉 Smart Price Match: {getSmartPricingMessage(selectedPlan)}
                          </p>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Monthly estimates:</p>
                        <p>• Weekdays only: ~${(calculateTotalPrice(selectedPlan) * 22).toFixed(2)}</p>
                        <p>• Full week: ~${(calculateTotalPrice(selectedPlan) * 30).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      {hasCustomizations() && (
                        <button
                          onClick={resetCustomizations}
                          className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Reset Customizations
                        </button>
                      )}
                      
                      <button
                        onClick={handleCustomOrder}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all transform hover:scale-105 ${getColorClasses(selectedPlan.color, 'button')} flex items-center justify-center gap-3`}
                      >
                        <Phone className="w-5 h-5" />
                        Order via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Phone Input Modal */}
        <AnimatePresence>
          {showPhoneInput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Enter Your Phone Number</h3>
                  <button
                    onClick={() => {
                      setShowPhoneInput(false)
                      setCustomerPhone('')
                      if (orderType === 'direct') {
                        setSelectedPlan(null)
                      }
                      setOrderType('')
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  We will include your phone number in the WhatsApp message to help with order confirmation and delivery coordination.
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g., (519) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPhoneInput(false)
                      setCustomerPhone('')
                      if (orderType === 'direct') {
                        setSelectedPlan(null)
                      }
                      setOrderType('')
                    }}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendWhatsAppOrder}
                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Send Order
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
} 
  // ... (rest of the JSX remains the same as in your complete code)
