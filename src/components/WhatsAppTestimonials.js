'use client';

import React, { useState, useEffect } from 'react';

const WhatsAppTestimonials = () => {
  const [currentChat, setCurrentChat] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const customerReviews = [
    {
      id: 1,
      name: "Vandita Patel",
      lastSeen: "online",
      messages: [
        {
          text: "Hello",
          time: "2:28 PM",
          type: "customer"
        },
        {
          text: "The food was absolutely delicious😍",
          time: "2:29 PM",
          type: "customer"
        },
        {
          text: "I ordered one yesterday and it was tasty and felt soo much homely, thank you",
          time: "2:30 PM",
          type: "customer"
        },
        {
          text: "Hello, ma'am, glad you liked it. Thank you for your feedback.",
          time: "2:31 PM",
          type: "business"
        },
      ],
      orderType: "Tiffin",
      location: "Windsor, ON",
      screenshot: "/images/reviews/vandita-patel-review.jpg" // Placeholder for actual screenshot
    },
    {
      id: 2,
      name: "Smit Rana",
      lastSeen: "online",
      messages: [
        {
          text: "Are bro jordar",
          time: "11:40 AM",
          type: "customer"
        },
        {
          text: "Sabji kadhi mast ek dam",
          time: "11:41 AM",
          type: "customer"
        },
        {
          text: "And Roti to peli vaar mane mara sivay bija koi ni gami , Aabhar",
          time: "11:42 AM",
          type: "customer"
        },
        {
          text: "Best",
          time: "11:43 AM",
          type: "business"
        },
  
      ],
      orderType: "Tiffin",
      location: "Windsor, ON",
      screenshot: "/images/reviews/ssss.jpg"
    },
    {
      id: 3,
      name: "Swara",
      lastSeen: "2 min ago",
      messages: [
        {
          text: "Hi, thank you! We picked up the tiffin :)",
          time: "1:18 PM",
          type: "customer"
        },
        {
          text: "Food is really good today.. we would like to continue for monthly from 15th August if that's possible",
          time: "1:35 PM",
          type: "customer"
        },
    
        {
          text: "Thank you for making your special day perfect! Congratulations! 🎉",
          time: "6:18 PM",
          type: "business"
        },
      ],
      orderType: "Tiffin",
      location: "Windsor, ON",
      screenshot: "/images/reviews/swara.jpg"
    },
    {
      id: 4,
      name: "Meet",
      lastSeen: "5 min ago",
      messages: [
                {
          text: "Hello Meet bhai, Rasoi Kevi Lagi ? Let us know the feedback",
          time: "1:13 PM",
          type: "business"
        },
        {
          text: "Hello, the food as really good, quality and quantity. Thank you",
          time: "1:10 PM",
          type: "customer"
        },
      ],
      orderType: "Tiffin",
      location: "Windsor, ON",
      screenshot: "/images/reviews/meet.jpg"
    }
  ];

  // Auto-rotate every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentChat((prev) => (prev + 1) % customerReviews.length);
        setIsTransitioning(false);
      }, 500);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Show messages one by one when chat changes
  useEffect(() => {
    setVisibleMessages([]);
    setIsTyping(false);
    
    const messages = customerReviews[currentChat].messages;
    
    messages.forEach((_, index) => {
      setTimeout(() => {
        if (index === messages.length - 1) {
          // Show typing for last message
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages(prev => [...prev, index]);
          }, 1000);
        } else {
          setVisibleMessages(prev => [...prev, index]);
        }
      }, index * 800);
    });
  }, [currentChat]);

  const currentReview = customerReviews[currentChat];

  // Function to generate avatar based on name
  const getAvatar = (name) => {
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${colors[colorIndex]}`}>
        {initials}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real Customer Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about us through authentic WhatsApp conversations
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Phone Mockup */}
          <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl w-full max-w-md mx-auto lg:sticky lg:top-8">
            <div className="bg-black rounded-2xl p-2">
              <div className="bg-white rounded-xl overflow-hidden">
                
                {/* Phone Status Bar */}
                <div className="bg-green-600 px-4 py-3 flex justify-between items-center text-sm text-white">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm11.5 1a.5.5 0 0 0-.5.5v3.793L9.854 8.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L12 9.293V5.5a.5.5 0 0 0-.5-.5zM5 7.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1z"/>
                    </svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                    </svg>
                  </div>
                </div>

                {/* WhatsApp Header */}
                <div className="bg-green-500 text-white px-4 py-3 flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    {getAvatar(currentReview.name)}
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{currentReview.name}</div>
                      <div className="text-xs text-green-100">{currentReview.lastSeen}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div className="h-80 bg-gray-100 p-4 overflow-y-auto">
                  
                  {/* Today Label */}
                  <div className="text-center mb-4">
                    <span className="bg-green-800 text-white px-3 py-1 rounded-full text-xs shadow-sm">
                      Today
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3">
                    {currentReview.messages.map((message, index) => {
                      const isVisible = visibleMessages.includes(index);
                      const isCustomer = message.type === 'customer';
                      
                      return (
                        <div
                          key={index}
                          className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} ${
                            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                          } transition-all duration-500`}
                        >
                          <div
                            className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                              isCustomer
                                ? 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                                : 'bg-green-500 text-white rounded-br-md shadow-sm'
                            }`}
                          >
                            <div className="leading-relaxed mb-1">
                              {message.text}
                            </div>
                            <div className={`text-xs flex items-center justify-end gap-1 ${
                              isCustomer ? 'text-gray-500' : 'text-green-100'
                            }`}>
                              <span>{message.time}</span>
                              {!isCustomer && <span className="text-xs">✓✓</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Area */}
                <div className="bg-gray-50 p-3 flex items-center gap-2">
                  <div className="text-gray-500 hover:text-gray-700 cursor-pointer">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                  </div>
                  <div className="text-gray-500 hover:text-gray-700 cursor-pointer">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/>
                      <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    </svg>
                  </div>
                  <div className="flex-1 bg-white rounded-full px-4 py-2 border border-gray-200">
                    <input 
                      type="text" 
                      placeholder="Type a message" 
                      className="w-full text-sm outline-none bg-transparent" 
                      disabled 
                    />
                  </div>
                  <div className="text-gray-500 hover:text-gray-700 cursor-pointer">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3 5.5A.5.5 0 0 1 3.5 5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9zM5 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 极 0 0 2zm-5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 极 1 0 0-2 1 1 0 0 0 0 2zm-5 3a1 1 0 1 0 0-极 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                  </div>
                  <div className="bg-green-500 p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15.854.极 a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className={`bg-white rounded-2xl p-6 shadow-lg w-full max-w-md transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {getAvatar(currentReview.name)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{currentReview.name}</h3>
              <div className="text-gray-600 mb-4">📍 {currentReview.location}</div>
              
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <div className="text-lg font-semibold text-green-800 mb-1">
                  {currentReview.orderType}
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">⭐</span>
                  ))}
                </div>
                <div className="text-xs text-green-极 bg-green-100 px-3 py-1 rounded-full inline-block">
                  ✓ Verified Customer Review
                </div>
              </div>
              
              <div className="text-left bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Review Summary</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentReview.messages.filter(m => m.type === 'customer').slice(0, 3).map((msg, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{msg.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {customerReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentChat(index);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentChat 
                      ? 'bg-green-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Screenshot Display Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Real Customer Screenshots 📸
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customerReviews.map((review, index) => (
              <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  {getAvatar(review.name)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.orderType}</p>
                  </div>
                </div>
                
<img
  src={review.screenshot}
  alt={`WhatsApp conversation with ${review.name}`}
  className="block"
/>

                
                <div className="mt-3 text-xs text-gray-500">
                  💬 {review.messages[0].text.substring(0, 50)}...
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              See more real customer conversations on our WhatsApp!
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto">
              <span className="text-xl">💬</span>
              Chat with Us on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTestimonials;