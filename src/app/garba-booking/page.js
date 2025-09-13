// src/app/garba-booking/page.js
'use client';

import { useEffect, useState } from 'react';

export default function GarbaBookingPage() {
  const [mounted, setMounted] = useState(false);
  const [todayStr, setTodayStr] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bookingDate: '',
    numberOfPeople: 1, // still kept as a summary field if you want it
    specialRequests: '',
  });

  // NEW: dishes state
  const [dishes, setDishes] = useState({
    vegPuff: { selected: false, qty: 1 },
    vegManNoodle: { selected: false, qty: 1 },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const t = new Date();
    const tz = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()))
      .toISOString()
      .split('T')[0];
    setTodayStr(tz);
  }, []);

  async function safeJSON(res) {
    const txt = await res.text();
    if (!txt) return { __empty: true };
    try { return JSON.parse(txt); } catch (e) { return { __parseError: String(e), __raw: txt }; }
  }

  // Build dishes array to submit
  function buildDishesPayload() {
    const out = [];
    if (dishes.vegPuff.selected) {
      out.push({ name: 'Veg Puff', qty: Math.max(1, Number(dishes.vegPuff.qty) || 1) });
    }
    if (dishes.vegManNoodle.selected) {
      out.push({ name: 'Veg Manchurian Noodle', qty: Math.max(1, Number(dishes.vegManNoodle.qty) || 1) });
    }
    return out;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const dishList = buildDishesPayload();
    if (dishList.length === 0) {
      setError('Select at least one dish.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Cache-Control': 'no-cache' },
        cache: 'no-store',
        body: JSON.stringify({
          ...formData,
          eventType: 'garba',
          bookingDate: formData.bookingDate ? new Date(formData.bookingDate) : new Date(),
          dishes: dishList, // NEW
        }),
      });

      const data = await safeJSON(res);
      if (!res.ok) {
        setError(`Server error (${res.status})`);
      } else if (data.__empty || data.__parseError || !data.success) {
        setError(data.error || 'Invalid server response');
      } else {
        setBookingResult(data.booking);
        // reset
        setFormData({ name: '', email: '', phone: '', bookingDate: '', numberOfPeople: 1, specialRequests: '' });
        setDishes({ vegPuff: { selected: false, qty: 1 }, vegManNoodle: { selected: false, qty: 1 } });
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'numberOfPeople' ? Number(value) : value }));
  };

  if (!mounted) return null;

  if (bookingResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Your Garba order has been created.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="font-medium">{bookingResult.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Token:</span><span className="font-bold text-blue-600 text-lg">{bookingResult.tokenNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-medium">{bookingResult.bookingDate ? new Date(bookingResult.bookingDate).toLocaleDateString() : ''}</span></div>

              {/* Show dishes */}
              <div>
                <div className="text-gray-600 mb-1">Dishes:</div>
                <ul className="list-disc ml-5 text-gray-900">
                  {(bookingResult.dishes || []).map((d, i) => (
                    <li key={i}>{d.name} × {d.qty}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => setBookingResult(null)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🎭 Garba Food Order</h1>
          <p className="text-xl text-blue-200">Give an order!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input
                  type="date" id="bookingDate" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} required
                  min={todayStr || undefined}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* NEW: Dishes section */}
            <div className="border rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-3">Choose Dishes</div>

              {/* Veg Puff */}
              <div className="flex items-center gap-3 mb-3">
                <input
                  id="vegPuff"
                  type="checkbox"
                  checked={dishes.vegPuff.selected}
                  onChange={(e) => setDishes((p) => ({ ...p, vegPuff: { ...p.vegPuff, selected: e.target.checked } }))}
                />
                <label htmlFor="vegPuff" className="flex-1 text-gray-800">Veg Puff</label>
                {dishes.vegPuff.selected && (
                  <input
                    type="number"
                    min={1}
                    value={dishes.vegPuff.qty}
                    onChange={(e) => setDishes((p) => ({ ...p, vegPuff: { ...p.vegPuff, qty: Number(e.target.value) || 1 } }))}
                    className="w-20 border rounded px-2 py-1"
                  />
                )}
              </div>

              {/* Veg Manchurian Noodle */}
              <div className="flex items-center gap-3">
                <input
                  id="vegManNoodle"
                  type="checkbox"
                  checked={dishes.vegManNoodle.selected}
                  onChange={(e) => setDishes((p) => ({ ...p, vegManNoodle: { ...p.vegManNoodle, selected: e.target.checked } }))}
                />
                <label htmlFor="vegManNoodle" className="flex-1 text-gray-800">Veg Manchurian Noodle</label>
                {dishes.vegManNoodle.selected && (
                  <input
                    type="number"
                    min={1}
                    value={dishes.vegManNoodle.qty}
                    onChange={(e) => setDishes((p) => ({ ...p, vegManNoodle: { ...p.vegManNoodle, qty: Number(e.target.value) || 1 } }))}
                    className="w-20 border rounded px-2 py-1"
                  />
                )}
              </div>
            </div>

            {/* Optional overall numberOfPeople stays (can keep or remove) */}
            <div>
              <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-2">Number of Dishes (summary)</label>
              <select
                id="numberOfPeople" name="numberOfPeople" value={formData.numberOfPeople} onChange={handleInputChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
              <textarea
                id="specialRequests" name="specialRequests" value={formData.specialRequests} onChange={handleInputChange}
                rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any dietary restrictions or special requests..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Booking…' : 'Book Now & Get Token'}
            </button>
          </form>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📋 How it works:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Fill out the form above</li>
              <li>2. Get your short token like <b>A123</b></li>
              <li>3. Bring the token to the event</li>
              <li>4. Show your token to get your food</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
