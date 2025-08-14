"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const tiffinPlans = [
  { plan: "A Mini", category: "Light Meal", items: ["8 oz Sabji", "6 Roti", "OR (8 oz Dal + 8 oz Rice)"], dailyPrice: 7.99, monthlyExclWeekends: 178.99, monthlyInclWeekends: 238.99, popular: false, type: "A" },
  { plan: "A+", category: "Standard Meal", items: ["8 oz Sabji", "5 Roti", "8 oz Dal", "8 oz Rice"], dailyPrice: 9.99, monthlyExclWeekends: 198.99, monthlyInclWeekends: 278.99, popular: false, type: "A" },
  { plan: "A Pro", category: "Complete Meal", items: ["8 oz Sabji", "5 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)"], dailyPrice: 10.99, monthlyExclWeekends: 228.99, monthlyInclWeekends: 298.99, popular: true, type: "A" },
  { plan: "A Pro Max", category: "Premium Meal", items: ["8 oz Sabji", "7 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)", "Sweet", "Farsan"], dailyPrice: 13.99, monthlyExclWeekends: 298.99, monthlyInclWeekends: 398.99, popular: false, type: "A" },
  { plan: "AA Mini", category: "Large Light Meal", items: ["12 oz Sabji", "8 Roti"], dailyPrice: 9.49, monthlyExclWeekends: 198.99, monthlyInclWeekends: 278.99, popular: false, type: "AA" },
  { plan: "AA+", category: "Large Standard", items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice"], dailyPrice: 12.99, monthlyExclWeekends: 268.99, monthlyInclWeekends: 368.99, popular: false, type: "AA" },
  { plan: "AA Pro", category: "Large Complete", items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)"], dailyPrice: 13.99, monthlyExclWeekends: 298.99, monthlyInclWeekends: 398.99, popular: false, type: "AA" },
  { plan: "AA Pro Max", category: "Large Premium", items: ["12 oz Sabji", "8 Roti", "8 oz Dal", "8 oz Rice", "Raitu/Papad/Salad (Any Two)", "Sweet", "Farsan"], dailyPrice: 15.99, monthlyExclWeekends: 338.99, monthlyInclWeekends: 458.99, popular: false, type: "AA" }
];

export default function TiffinPlans() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [awaitConfirm, setAwaitConfirm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState("single");
  const [formData, setFormData] = useState({ name: "", address: "", phone: "", mealTime: "lunch" });

  const [confirmCode, setConfirmCode] = useState("");
  const [inputCode, setInputCode] = useState("");

  const filteredPlans = tiffinPlans.filter((plan) =>
    activeFilter === "all" ? true : plan.type === activeFilter
  );

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setSubscriptionType("single");
    setShowModal(true);
  };

  const handleInputChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const getCurrentPrice = (plan, subscription) => {
    if (!plan) return 0;
    switch (subscription) {
      case "single": return plan.dailyPrice ?? 0;
      case "monthly-weekdays": return plan.monthlyExclWeekends ?? 0;
      case "monthly-all": return plan.monthlyInclWeekends ?? 0;
      default: return plan.dailyPrice ?? 0;
    }
  };

  const getSubscriptionLabel = (subscription) => {
    switch (subscription) {
      case "single": return "Single Day";
      case "monthly-weekdays": return "Monthly (Weekdays Only)";
      case "monthly-all": return "Monthly (All Days)";
      default: return "Single Day";
    }
  };

  // Submit: send to caterer FIRST (with a confirmation code), then wait for confirmation
  const handleSubmit = () => {
    if (!formData.name || !formData.address || !formData.phone || !selectedPlan) {
      alert("Please fill in all required fields");
      return;
    }

    const now = new Date();
    const orderId = `AT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}-${Math.floor(Math.random() * 90000 + 10000)}`;

    const price = getCurrentPrice(selectedPlan, subscriptionType); // NO TAX

    const code = String(Math.floor(Math.random() * 9000 + 1000)); // 4-digit
    setConfirmCode(code);

    const orderObj = {
      orderId,
      orderDate: now.toLocaleString(),
      customer: { ...formData },
      plan: selectedPlan,
      subscription: { key: subscriptionType, label: getSubscriptionLabel(subscriptionType) },
      pricing: { amount: price }, // only your price, no tax
      confirmCode: code
    };

    setOrderDetails(orderObj);

    // 1) Send WhatsApp to caterer with CONFIRMATION CODE
    const msg = `🛒 NEW TIFFIN ORDER

ORDER ID: ${orderObj.orderId}
DATE: ${orderObj.orderDate}

CUSTOMER: ${orderObj.customer.name}
PHONE: ${orderObj.customer.phone}
ADDRESS: ${orderObj.customer.address}
MEAL TIME: ${orderObj.customer.mealTime === "lunch" ? "Lunch" : "Dinner"}

PLAN: ${orderObj.plan.plan} - ${orderObj.plan.category}
SUBSCRIPTION: ${orderObj.subscription.label}

INCLUDES:
${orderObj.plan.items.map((i) => `• ${i}`).join("\n")}

ORDER AMOUNT: ${orderObj.pricing.amount.toFixed(2)} CAD

CONFIRMATION CODE: ${code}

Please reply with the 4-digit code to CONFIRM this order. Thank you.`;

    // Caterer number: +1 519-992-7920
    const waUrl = `https://wa.me/15199927920?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    // 2) Close order modal, open "Awaiting Confirmation"
    setShowModal(false);
    setAwaitConfirm(true);
  };

  const verifyCodeAndShowReceipt = () => {
    if (inputCode.trim() === confirmCode) {
      setAwaitConfirm(false);
      setShowReceipt(true);
    } else {
      alert("Confirmation code does not match. Please check the code you received from the caterer.");
    }
  };

  const resetAll = () => {
    setShowReceipt(false);
    setAwaitConfirm(false);
    setOrderDetails(null);
    setSelectedPlan(null);
    setFormData({ name: "", address: "", phone: "", mealTime: "lunch" });
    setInputCode("");
    setConfirmCode("");
  };

  return (
    <section className="py-16 bg-gray-50">
      {/* One-page print rules for receipt */}
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          body * { visibility: hidden !important; }
          #receiptModal, #receiptModal * { visibility: visible !important; }
          #receiptModal { position: absolute; left: 0; top: 0; width: 190mm; }
          .receipt-container { font-size: 11px !important; line-height: 1.25 !important; }
          .no-print { display: none !important; }
          .avoid-break { page-break-inside: avoid; }
          .tight { margin: 0 !important; padding: 8px !important; }
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">Daily Tiffin Service Plans</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose a plan that fits your appetite and budget—all vegetarian, home-style meals delivered fresh.
          </p>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeFilter === "all" ? "bg-orange-500 text-white shadow-md" : "text-gray-600 hover:text-orange-500"
              }`}
            >
              All Plans
            </button>
            <button
              onClick={() => setActiveFilter("A")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeFilter === "A" ? "bg-orange-500 text-white shadow-md" : "text-gray-600 hover:text-orange-500"
              }`}
            >
              A Series 8 oz
              <span className="block text-xs opacity-80">Regular Portions</span>
            </button>
            <button
              onClick={() => setActiveFilter("AA")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeFilter === "AA" ? "bg-orange-500 text-white shadow-md" : "text-gray-600 hover:text-orange-500"
              }`}
            >
              AA Series 12 oz
              <span className="block text-xs opacity-80">Large Portions</span>
            </button>
          </div>
        </div>

        {/* Portion Guide */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>Portion Guide:</span>
            {activeFilter === "A" && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">A Series: 8 oz portions</span>
            )}
            {activeFilter === "AA" && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">AA Series: 12 oz portions</span>
            )}
            {activeFilter === "all" && (
              <>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">A: 8 oz portions</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">AA: 12 oz portions</span>
              </>
            )}
          </div>
        </div>
        </div>

        {/* Cards */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                plan.type === "A" ? "border-blue-200 hover:border-blue-300" : "border-purple-200 hover:border-purple-300"
              }`}
            >
              <div className="absolute -top-2 -right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${plan.type === "A" ? "bg-blue-500" : "bg-purple-500"}`}>
                  {plan.type} Series
                </span>
              </div>

              {plan.popular && (
                <div className="absolute -top-2 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">Most Popular</span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{plan.plan}</h3>
                <p className="text-sm text-gray-500 mb-3">{plan.category}</p>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    ${plan.dailyPrice?.toFixed(2)} <span className="text-lg font-normal text-gray-500">/day</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Monthly (weekdays):</span>
                      <span className="font-semibold text-blue-600">${plan.monthlyExclWeekends?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Monthly (all days):</span>
                      <span className="font-semibold text-green-600">${plan.monthlyInclWeekends?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-grow mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-center">What is Included:</h4>
                {plan.plan === "A Mini" ? (
                  <div className="text-gray-600 text-sm">
                    <ul className="space-y-2 mb-3">
                      <li className="flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><span>8 oz Sabji</span></li>
                      <li className="flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><span>6 Roti</span></li>
                    </ul>
                    <div className="text-center my-4"><span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold text-lg">OR</span></div>
                    <ul className="space-y-2">
                      <li className="flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><span>8 oz Dal</span></li>
                      <li className="flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><span>8 oz Rice</span></li>
                    </ul>
                  </div>
                ) : (
                  <ul className="text-gray-600 space-y-2 text-sm">
                    {plan.items.map((item, i) => (
                      <li key={i} className="flex items-start"><span className="text-orange-500 mr-2 mt-1">•</span><span>{item}</span></li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleChoosePlan(plan)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.type === "A" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  Choose Plan
                </button>
                <p className="text-xs text-gray-500 text-center">Fresh delivery • All vegetarian • Home-style cooking</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Delivery Info */}
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

      {/* Order Modal */}
{showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
             onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[95vh] flex flex-col"
               onClick={(e) => e.stopPropagation()}>
            {/* Modal Header - Sticky on mobile */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Order {selectedPlan?.plan ?? "Plan"}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 overscroll-contain"
                 style={{ WebkitOverflowScrolling: 'touch' }}>
              {/* Subscription */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose Subscription Type *</label>
                <div className="space-y-2">
                  {[
                    { key: "single", label: "Single Day", note: "Pay per day", value: selectedPlan?.dailyPrice?.toFixed(2) ?? "0.00", color: "text-orange-600" },
                    { key: "monthly-weekdays", label: "Monthly (Weekdays)", note: "Monday to Friday only", value: selectedPlan?.monthlyExclWeekends?.toFixed(2) ?? "0.00", color: "text-blue-600" },
                    { key: "monthly-all", label: "Monthly (All Days)", note: "Monday to Sunday", value: selectedPlan?.monthlyInclWeekends?.toFixed(2) ?? "0.00", color: "text-green-600" }
                  ].map(opt => (
                    <label key={opt.key} className="flex items-start sm:items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="subscription"
                        value={opt.key}
                        checked={subscriptionType === opt.key}
                        onChange={(e) => setSubscriptionType(e.target.value)}
                        className="mt-1 sm:mt-0 mr-3 flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-sm sm:text-base">{opt.label}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{opt.note}</div>
                      </div>
                      <div className={`font-bold text-sm sm:text-base ${opt.color} flex-shrink-0 ml-2`}>${opt.value}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount (no tax) */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Amount</div>
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">
                    ${getCurrentPrice(selectedPlan, subscriptionType).toFixed(2)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">{getSubscriptionLabel(subscriptionType)}</div>
                </div>
              </div>

              {/* Customer fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                    placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base resize-none"
                    placeholder="Enter your complete delivery address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                    placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Time *</label>
                  <select name="mealTime" value={formData.mealTime} onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base">
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer - Sticky on mobile */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-lg">
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowModal(false)}
                  className="w-full sm:flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="w-full sm:flex-1 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                  Send to Caterer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Awaiting Confirmation Modal */}
      {awaitConfirm && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Awaiting Caterer Confirmation</h3>
            <p className="text-sm text-gray-600 mb-4">
              We sent your order to the caterer on WhatsApp. After they reply with the 4‑digit code, enter it below to generate your receipt.
            </p>
            <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><strong>Amount:</strong> ${orderDetails.pricing.amount.toFixed(2)}</p>
              <p><strong>Plan:</strong> {orderDetails.plan.plan} — {orderDetails.plan.category}</p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter 4‑digit code</label>
            <input
              type="text"
              maxLength={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ""))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 tracking-widest text-center text-lg"
              placeholder="____"
            />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAwaitConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={verifyCodeAndShowReceipt} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Confirm & Generate Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal (only after confirmation) */}
      {showReceipt && orderDetails && (
        <div id="receiptModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto receipt-container">
            <div className="text-center mb-4 pb-3 border-b border-gray-200 tight avoid-break">
              <h2 className="text-xl font-bold text-gray-800">🍽️ Tiffin Service Receipt</h2>
              <p className="text-gray-600 text-sm">Order Confirmation</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-4 avoid-break">
              <div className="bg-blue-50 p-3 rounded-lg tight">
                <h3 className="font-semibold text-blue-800 mb-1 text-sm">📋 Order</h3>
                <p className="text-sm"><strong>ID:</strong> {orderDetails.orderId}</p>
                <p className="text-sm"><strong>Date:</strong> {orderDetails.orderDate}</p>
                <p className="text-sm"><strong>Status:</strong> <span className="text-green-700 font-semibold">Confirmed</span></p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg tight">
                <h3 className="font-semibold text-green-800 mb-1 text-sm">👤 Customer</h3>
                <p className="text-sm"><strong>Name:</strong> {orderDetails.customer.name}</p>
                <p className="text-sm"><strong>Phone:</strong> {orderDetails.customer.phone}</p>
                <p className="text-sm"><strong>Meal:</strong> {orderDetails.customer.mealTime === "lunch" ? "Lunch" : "Dinner"}</p>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg mb-4 tight avoid-break">
              <h3 className="font-semibold text-purple-800 mb-1 text-sm">🚚 Address</h3>
              <p className="text-sm">{orderDetails.customer.address}</p>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg mb-4 tight avoid-break">
              <h3 className="font-semibold text-orange-800 mb-2 text-sm">🍽️ Order Details</h3>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{orderDetails.plan.plan} — {orderDetails.plan.category}</p>
                  <p className="text-xs text-gray-600">Subscription: {orderDetails.subscription.label}</p>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {orderDetails.plan.items.map((item, i) => (
                      <li key={i} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <p className="font-bold text-base">${orderDetails.pricing.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 no-print">
              <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold">
                🖨️ Print (1 Page)
              </button>
              <button onClick={resetAll} className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-semibold">
                ✓ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
