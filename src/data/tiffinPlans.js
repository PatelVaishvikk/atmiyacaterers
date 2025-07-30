export const tiffinPlans = [
  {
    plan: 'Basic',
    price: 149,            // Monthly price in CAD
    items: [
      'Rotli / Thepla',
      'Dal / Kadhi',
      'Bhaat (Rice)',
      'Shaak (Sabzi)',
    ],
    delivery: 'Mon–Fri',
    deliveryCharge: 0      // Free delivery
  },
  {
    plan: 'Standard',
    price: 199,
    items: [
      'Everything in Basic',
      'Farsan (Dhokla, Patra)',
      'Sweet (Mohanthal)',
    ],
    delivery: 'Mon–Fri',
    deliveryCharge: 10
  },
  {
    plan: 'Premium',
    price: 249,
    items: [
      'Everything in Standard',
      'Paneer Sabzi',
      'Seasonal Salad',
      'Dessert of the Day',
    ],
    delivery: 'Mon–Sat',
    deliveryCharge: 10
  }
];
