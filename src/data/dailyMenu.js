// src/data/dailyMenu.js

/**
 * Data source for the Daily Tiffin Menu.
 * — Update the first entry for “today’s” menu —
 */

export const dailyMenu = [
  {
    date: '8th August 2025',                           // YYYY-MM-DD
    day: 'Friday',
    tiffinType: '🍽️ Lunch & Dinner',
    menuItems: [
      'Ringan batata sabji',
      'Roti',
      'Daal',
      'Rice'
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
      'Rice',
      'Dal',
      'Sabji',
      'Sweet',
      'Farsan'
    ],
    pickupAddress:    '📍 867 Langlois Ave, Windsor',
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
