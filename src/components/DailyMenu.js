// 'use client'

// import { dailyMenu } from '@/data/dailyMenu'
// import { motion } from 'framer-motion'

// export default function DailyMenu() {
//   const menu = dailyMenu[0]

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
//   }

//   return (
//     <section className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-16 px-4 relative overflow-hidden">
//       {/* Background Decorations */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
//       </div>

//       <div className="container mx-auto max-w-4xl relative z-10">
//         {/* Header */}
//         <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6 shadow-lg">
//             <span className="text-3xl">🍛</span>
//           </div>
//           <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent mb-4 leading-tight">
//             Today Special
//           </h1>
//           <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.3 }} className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto mb-6 rounded-full" />
//           <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50">
//             <span className="text-xl font-medium text-gray-800 mr-3">{menu.date}</span>
//             <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
//             <span className="text-lg text-gray-600 ml-3">{menu.tiffinType}</span>
//           </div>
//         </motion.div>

//         {/* Content */}
//         <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-8">
//           {/* Menu Card */}
//           <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full -mr-16 -mt-16"></div>
//             {menu.specialNote && (
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-400 p-4 rounded-r-xl mb-6">
//                 <p className="text-orange-800 font-medium flex items-center">
//                   <span className="mr-2">✨</span>{menu.specialNote}
//                 </p>
//               </motion.div>
//             )}
//             <div className="mb-8">
//               <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="text-3xl mr-3">🍲</span>Today Delights
//               </h3>
//               <div className="space-y-3">
//                 {menu.menuItems.map((item, idx) => (
//                   <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + idx * 0.1 }} className="flex items-center bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-xl hover:shadow-md transition-all duration-300">
//                     <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
//                     <span className="text-gray-700 font-medium">{item}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
//                 <span className="text-2xl mr-2">➕</span>Customize Your Meal
//               </h4>
//               <div className="grid grid-cols-1 gap-2">
//                 {menu.addons.map((addon, i) => (
//                   <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.1 }} className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200">
//                     <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></div>{addon}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>

//           {/* Info & Pricing Card */}
//           <motion.div variants={itemVariants} className="space-y-6">
//             {/* Single-Day Plan Only */}
//             <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50">
//               <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="text-3xl mr-3">💰</span>Single-Day Tiffin
//               </h4>
//               <div className="flex justify-between items-center bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-2xl border border-yellow-200">
//                 <span className="font-semibold text-gray-800">Price</span>
//                 <span className="text-2xl font-bold text-red-600">${menu.pricing.singleDay.price}</span>
//               </div>
//               {menu.pricing.singleDay.includesDelivery && (
//                 <p className="text-sm text-gray-600 mt-2">✓ Includes delivery</p>
//               )}
//             </motion.div>

//             {/* Timing & Delivery */}
//             <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50">
//               <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="text-3xl mr-3">⏰</span>Timing & Delivery
//               </h4>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl">
//                   <span className="font-medium text-gray-700">🌅 Lunch By</span>
//                   <span className="font-bold text-blue-600">{menu.timings.lunchBy}</span>
//                 </div>
//                 <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl">
//                   <span className="font-medium text-gray-700">🌙 Dinner By</span>
//                   <span className="font-bold text-purple-600">{menu.timings.dinnerBy}</span>
//                 </div>
//                 <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
//                   <p className="text-gray-700 mb-2">📍 {menu.pickupAddress}</p>
//                   <p className="text-green-700 text-sm">{menu.delivery.note}</p>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </motion.div>

//         {/* Thank You & Order */}
//         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }} className="text-center mt-12">
//           {menu.thankYouMessage && (
//             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-gray-600 mt-4 italic">
//               {menu.thankYouMessage}
//             </motion.p>
//           )}
//         </motion.div>
//       </div>

//       {/* Floating Icons */}
//       <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-10 text-4xl opacity-20 pointer-events-none hidden md:block">🌶️</motion.div>
//       <motion.div animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 left-10 text-4xl opacity-20 pointer-events-none hidden md:block">🥘</motion.div>
//     </section>
//   )
// }

"use client";
import { useState, useEffect } from 'react';
import { dailyMenu as fallbackMenu } from '../data/dailyMenu.js'; // Your existing data

export default function DailyMenu() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useGoogleSheets, setUseGoogleSheets] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 🔴 REPLACE WITH YOUR ACTUAL GOOGLE SHEET ID
  const SHEET_ID = "1Ki0e8hmVaxAcGhrjdXMAoOO3ZWnbc9Dq0n7Fo4KGe2s"; // ← Put your Sheet ID here
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (useGoogleSheets && SHEET_ID !== "YOUR_SHEET_ID_HERE") {
        console.log('🔄 Fetching from Google Sheets...');
        
        // Try to fetch from Google Sheets first
        const response = await fetch(`${SHEET_URL}&timestamp=${Date.now()}`);
        
        if (response.ok) {
          const csvData = await response.text();
          console.log('✅ Google Sheets data received');
          
          const parsedData = parseGoogleSheetsData(csvData);
          
          if (parsedData.length > 0) {
            console.log('📊 Parsed menu items:', parsedData.length);
            setMenuData(parsedData);
            setLoading(false);
            return;
          }
        }
      }
      
      console.log('📱 Using local fallback data');
      // Fallback to local data
      setMenuData(transformLocalData(fallbackMenu));
      setUseGoogleSheets(false);
      
    } catch (err) {
      console.error('❌ Error fetching menu:', err);
      // Use local data as fallback
      setMenuData(transformLocalData(fallbackMenu));
      setUseGoogleSheets(false);
      setError('Using local menu data');
    } finally {
      setLoading(false);
    }
  };

  // Transform your existing local data structure to match the component
  const transformLocalData = (localMenu) => {
    return localMenu.map(item => {
      // Convert your date format to YYYY-MM-DD if needed
      let dateFormatted = item.date;
      if (item.date && (item.date.includes('th ') || item.date.includes('st ') || item.date.includes('nd ') || item.date.includes('rd '))) {
        // Convert "8th August 2025" to "2025-08-08" format
        const dateParts = item.date.match(/(\d+)[a-z]{2}\s+([A-Za-z]+)\s+(\d+)/);
        if (dateParts) {
          const day = dateParts[1].padStart(2, '0');
          const month = getMonthNumber(dateParts[2]);
          const year = dateParts[3];
          dateFormatted = `${year}-${month}-${day}`;
        }
      }

      return {
        date: dateFormatted,
        day: item.day,
        meal_type: item.tiffinType,
        description: Array.isArray(item.menuItems) ? item.menuItems.join(', ') : item.menuItems || '',
        price: item.pricing?.singleDay?.price || '',
        special_note: item.specialNote || '',
        lunch_by: item.timings?.lunchBy || '',
        dinner_by: item.timings?.dinnerBy || '',
        addons: Array.isArray(item.addons) ? item.addons.join(', ') : item.addons || '',
        pickup_address: item.pickupAddress || '',
        delivery_note: item.delivery?.note || (item.delivery?.free ? '🚚 Free Delivery Available' : ''),
        thank_you: item.thankYouMessage || ''
      };
    });
  };

  // Helper function to convert month name to number
  const getMonthNumber = (monthName) => {
    const months = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    return months[monthName] || '01';
  };

  // Parse Google Sheets CSV data
  const parseGoogleSheetsData = (csvData) => {
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    console.log('📋 Sheet headers:', headers);
    
    const parsedItems = lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const item = {};
      
      headers.forEach((header, index) => {
        item[header] = values[index]?.replace(/"/g, '').trim() || '';
      });
      
      return item;
    }).filter(item => item.date && item.date !== '');

    console.log('🍽️ Parsed menu items:', parsedItems);
    return parsedItems;
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  const getMenuForDate = (date) => {
    return menuData.filter(item => item.date === date);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getNextFewDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const menuForDay = getMenuForDate(dateStr);
      
      if (menuForDay.length > 0 || i === 0) {
        dates.push({
          date: dateStr,
          displayDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          isToday: i === 0,
          hasMenu: menuForDay.length > 0
        });
      }
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading todays menu...</p>
        </div>
      </div>
    );
  }

  const selectedMenu = getMenuForDate(selectedDate);
  const availableDates = getNextFewDays();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Daily Tiffin Menu</h2>
            <p className="text-orange-100">Fresh, home-style vegetarian meals</p>
            <div className="flex items-center gap-2 mt-2">
              {useGoogleSheets ? (
                <p className="text-green-200 text-sm">✅ Live from Google Sheets</p>
              ) : (
                <p className="text-orange-200 text-sm">📱 Using local menu data</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchMenuData}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              title="Refresh Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableDates.map(({ date, displayDate, isToday, hasMenu }) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDate === date
                  ? 'bg-orange-500 text-white'
                  : hasMenu
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {isToday ? 'Today' : displayDate}
              {hasMenu && selectedDate !== date && (
                <span className="ml-1 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {formatDate(selectedDate)}
        </h3>
        
        {selectedMenu.length > 0 ? (
          <div className="space-y-6">
            {selectedMenu.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-orange-600 mb-1">
                        {item.meal_type || 'Daily Tiffin'}
                      </h4>
                      {item.day && (
                        <p className="text-gray-500 text-sm">{item.day}</p>
                      )}
                    </div>
                    {item.price && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${parseFloat(item.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">per day</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Menu Items */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-700 mb-2">Todays Menu:</h5>
                    <p className="text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Special Note */}
                  {item.special_note && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-blue-700 font-medium">
                        {item.special_note}
                      </p>
                    </div>
                  )}

                  {/* Timings */}
                  {(item.lunch_by || item.dinner_by) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {item.lunch_by && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-yellow-800">
                            <span className="font-semibold">🍽️ Lunch by:</span> {item.lunch_by}
                          </p>
                        </div>
                      )}
                      {item.dinner_by && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-purple-800">
                            <span className="font-semibold">🍽️ Dinner by:</span> {item.dinner_by}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add-ons */}
                  {item.addons && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">🍛 Available Add-ons:</h5>
                      <div className="flex flex-wrap gap-2">
                        {item.addons.split(',').map((addon, i) => (
                          <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                            {addon.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pickup & Delivery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {item.pickup_address && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-gray-700">
                          <span className="font-semibold">📍 Pickup:</span><br/>
                          {item.pickup_address}
                        </p>
                      </div>
                    )}
                    {item.delivery_note && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-blue-700">
                          <span className="font-semibold">🚚 Delivery:</span><br/>
                          {item.delivery_note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Thank You Message */}
                  {item.thank_you && (
                    <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-orange-700 font-medium">{item.thank_you}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No menu available for this date</p>
            <p className="text-gray-400 text-sm mt-1">Check back later or contact us for details</p>
          </div>
        )}
      </div>
    </div>
  );
}