// src/components/Header.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home',         href: '/' },
    { name: 'About',        href: '/about' },
    { name: 'Services',     href: '/services' },
    { name: 'Food Catalogue', href: '/food-catalogue' },
    { name: 'Tiffin Plans', href: '/tiffin-plans' },
    // { name: 'Menu',       href: '/menu' },
    // { name: 'Daily Menu', href: '/daily-menu' },
    { name: 'Gallery',      href: '/gallery' },
    { name: 'Locations',    href: '/locations' },
    { name: 'Contact',      href: '/contact' },
    { name: 'Testimonials', href: '/testimonials' },
    // { name: '🎭 Order here', href: '/garba-booking', special: true },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-nowrap items-center justify-between gap-4 py-3 sm:py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10">
                <Image
                  src="/images/logo.png"
                  alt="Atmiya Catering Logo"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold text-secondary leading-tight">
                Atmiya Caterers
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium whitespace-nowrap transition-colors duration-200 ${
                  item.special
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none p-2"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 font-medium whitespace-nowrap transition-colors duration-200 ${
                    item.special
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg mx-2 my-1 hover:from-purple-700 hover:to-blue-700'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/contact"
                className="block px-3 py-2 w-full text-center mt-4 rounded-lg bg-primary text-white hover:opacity-90 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

