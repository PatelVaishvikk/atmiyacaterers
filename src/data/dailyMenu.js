// src/data/dailyMenu.js

/**
 * Data source for the Daily Tiffin Menu.
 * — Update the first entry for “today’s” menu —
 */

export const dailyMenu = [
  {
    date: '2025-08-06',                           // YYYY-MM-DD
    day: 'Wednesday',
    tiffinType: '🍽️ Lunch & Dinner (Both Available)',
    menuItems: [
      'Sev Tomato Sabji',
      'Roti (5 pcs)',
      'Khichdi',
      'Chaas'
    ],
    specialNote: '🎉 Swaminarayan Tiffin is now available! 🎉',
    pricing: {
      monthlySubscription: {
        price: 8,                                // CAD per day
        currency: 'CAD',
        offer: 'Launch-day offer: 20% OFF for the first 20 subscribers!'
      },
      singleDay: {
        price: 9,                                // CAD
        currency: 'CAD',
        includesDelivery: true
      }
    },
    timings: {
      lunchBy:  '1:00 PM',
      dinnerBy: '7:00 PM'
    },
    addons: [
      'Extra Roti',
      'Steamed Rice',
      'Additional Sabji',
      'Farsaan Platter',
      'Sweet Treat'
    ],
    pickupAddress:    '📍 495 Curry Ave, Windsor',
    delivery: {
      free: true,
      note: '🚚 Free Delivery: Just DM your address'
    },
    thankYouMessage: '🙏 Thank you for choosing Atmiya Caterers! 🙇🏻‍♂️'
  },

  // — Add more days below as needed —
  /*
  {
    date: '2025-08-07',
    day: 'Thursday',
    tiffinType: '🍽️ Lunch & Dinner (Both Available)',
    menuItems: [ /* … *\/ ],
    specialNote: '',
    pricing: { /* … *\/ },
    timings: { /* … *\/ },
    addons: [ /* … *\/ ],
    pickupAddress: '',
    delivery: { /* … *\/ },
    thankYouMessage: ''
  },
  */
];
